import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTravelDto } from '../../infrastructure/controllers/dto/create-travel.dto';
import type { InvoiceRepositoryPort } from 'src/modules/invoices/domain/ports/invoice-repository.port';
import type { LocationRepositoryPort } from 'src/modules/locations/domain/ports/location-repository.port';
import type { RouterExternalPort } from '../../domain/ports/router-external.port';

@Injectable()
export class CreateTravelUseCase {
    constructor(
        private readonly configService: ConfigService,
        @Inject('InvoiceRepositoryPort')
        private readonly invoiceRepo: InvoiceRepositoryPort,
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
        @Inject('RouterExternalPort')
        private readonly routerExternal: RouterExternalPort,
    ) { }

    async execute(data: CreateTravelDto) {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));

        const invoices = await Promise.all(
            data.invoiceIds.map(async (id) => {
                const invoice = await this.invoiceRepo.findById(id, companyId);
                if (!invoice) throw new NotFoundException(`Invoice ${id} not found`);
                if (!invoice.recipient) throw new NotFoundException(`Invoice ${invoice.number} does not have a configured location`);
                return invoice;
            }),
        );

        const origin = await this.locationRepo.findByPersonId(data.originPersonId);
        if (!origin) {
            throw new NotFoundException(`Origin with person ID ${data.originPersonId} not found`);
        }

        const routerInputs = invoices.map(inv => ({
            invoiceId: inv.id ?? 0,
            invoiceNumber: inv.number ?? '',
            lat: String(inv.recipient?.address.latitude) ?? '0',
            lng: String(inv.recipient?.address.longitude) ?? '0',
            weight: inv.weight ?? 0,
            volume: inv.volume ?? 0,
            recipientPersonId: inv.recipientId ?? 0
        }));

        // External routing service call
        const routeResult = await this.routerExternal.calculateRoute(
            { lat: String(origin.reference.latitude), lng: String(origin.reference.longitude) },
            routerInputs,
            data.startDate,
            companyId
        );

        return {
            message: 'Viagem roteirizada com sucesso!',
            summary: routeResult.summary,
            details: routeResult.details,
            polyline: routeResult.polyline
        };
    }
}