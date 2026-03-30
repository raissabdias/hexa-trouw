import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTravelDto } from '../../infrastructure/controllers/dto/create-travel.dto';
import type { InvoiceRepositoryPort } from 'src/modules/invoices/domain/ports/invoice-repository.port';
import type { LocationRepositoryPort } from 'src/modules/locations/domain/ports/location-repository.port';

@Injectable()
export class CreateTravelUseCase {
    constructor(
        private readonly configService: ConfigService,
        @Inject('InvoiceRepositoryPort')
        private readonly invoiceRepo: InvoiceRepositoryPort,
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
    ) { }

    async execute(data: CreateTravelDto) {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));

        const invoices = await Promise.all(
            data.invoiceIds.map(async (id) => {
                const invoice = await this.invoiceRepo.findById(id, companyId);
                if (!invoice) {
                    throw new NotFoundException(`Invoice ID ${id} not found or does not belong to this company`);
                }
                return invoice;
            }),
        );

        const origin = await this.locationRepo.findByPersonId(data.originPersonId);
        if (!origin) {
            throw new NotFoundException(`Origin with person ID ${data.originPersonId} not found.`);
        }

        return {
            message: 'Travel data consolidated',
            origin: {
                name: origin.person?.name,
                city: origin.reference?.city,
                coordinates: {
                    lat: origin.reference?.latitude,
                    lng: origin.reference?.longitude
                }
            },
            totalInvoices: invoices.length,
            invoices: invoices.map(i => ({ 
                id: i.id, 
                number: i.number,
                recipientId: i.recipientId
            }))
        };
    }
}