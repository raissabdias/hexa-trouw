import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTravelDto } from '../../infrastructure/controllers/dto/create-travel.dto';
import type { InvoiceRepositoryPort } from 'src/modules/invoices/domain/ports/invoice-repository.port';
import type { LocationRepositoryPort } from 'src/modules/locations/domain/ports/location-repository.port';
import type { RouterExternalPort } from '../../domain/ports/router-external.port';
import type { TravelRepositoryPort } from '../../domain/ports/travel-repository.port';
import { TravelLogicService } from '../../domain/services/travel-logic.service';

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
        @Inject('TravelRepositoryPort')
        private readonly travelRepo: TravelRepositoryPort,
        private readonly travelLogicService: TravelLogicService
    ) { }

    async execute(data: CreateTravelDto) {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));

        // 1. Buscar faturas e calcular o valor total (conforme linha 205 do PHP)
        let totalValue = 0;
        const invoices = await Promise.all(
            data.invoiceIds.map(async (id) => {
                const invoice = await this.invoiceRepo.findById(id, companyId);
                if (!invoice) throw new NotFoundException(`Fatura ${id} não encontrada.`);
                totalValue += Number(invoice.value || 0); // Soma nota_valor
                return invoice;
            }),
        );

        // 2. Buscar localização de origem
        const origin = await this.locationRepo.findByPersonId(data.originPersonId);
        if (!origin) throw new NotFoundException(`Origem ${data.originPersonId} não encontrada.`);

        // 3. Preparar inputs e chamar Roteirização
        const routerInputs = invoices.map(inv => ({
            invoiceId: inv.id ?? 0,
            invoiceNumber: inv.number ?? '',
            lat: String(inv.recipient?.address?.latitude ?? '0'),
            lng: String(inv.recipient?.address?.longitude ?? '0'),
            weight: inv.weight ?? 0,
            volume: inv.volume ?? 0,
            recipientPersonId: inv.recipientId
        }));

        const routeResult = await this.routerExternal.calculateRoute(
            { lat: String(origin.reference.latitude), lng: String(origin.reference.longitude) },
            routerInputs,
            data.startDate,
            companyId
        );

        // 4. Agrupar Travel Points (Paradas)
        const travelPoints = this.travelLogicService.groupDetailsIntoTravelPoints(
            { id: data.originPersonId, lat: String(origin.reference.latitude), lng: String(origin.reference.longitude) },
            routeResult.details
        );

        // 5. Persistência no Banco Legado (Seguindo tb_planejamento_rotas)
        const travelSaved = await this.travelRepo.save({
            companyId: companyId,
            originId: data.originPersonId,
            invoiceIdsJson: JSON.stringify(data.invoiceIds),
            weightCapacity: routeResult.summary.weightCapacity,
            weightUsed: routeResult.summary.weightUsed,
            // Convert m3 to cm3 
            volumeCapacity: routeResult.summary.volumeCapacity / 1000000,
            volumeUsed: routeResult.summary.volumeUsed / 1000000,
            startDate: new Date(data.startDate),
            endDate: new Date(new Date(data.startDate).getTime() + routeResult.summary.totalDuration * 1000),
            totalDistance: routeResult.summary.totalDistance,
            detailsJson: JSON.stringify(routeResult.details),
            travelPointsJson: JSON.stringify(travelPoints),
            color: this.generateRandomColor(),
            active: 1,
            polyline: JSON.stringify(routeResult.polyline),
            apiName: 'Trouw Hexa - API Here Manual',
            totalValue: totalValue
        });

        return {
            success: true,
            message: 'Travel created successfully',
            travelId: travelSaved.id,
            summary: routeResult.summary
        };
    }

    /**
     * Generates a random hex color code for travel visualization purposes
     */
    private generateRandomColor(): string {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }
}