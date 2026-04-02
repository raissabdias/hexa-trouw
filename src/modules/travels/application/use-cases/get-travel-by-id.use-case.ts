import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TravelRepositoryPort } from '../../domain/ports/travel-repository.port';
import type { LocationRepositoryPort } from '../../../locations/domain/ports/location-repository.port';
import type { InvoiceRepositoryPort } from '../../../invoices/domain/ports/invoice-repository.port';

@Injectable()
export class GetTravelByIdUseCase {
  constructor(
    @Inject('TravelRepositoryPort')
    private readonly travelRepo: TravelRepositoryPort,
    @Inject('LocationRepositoryPort')
    private readonly locationRepo: LocationRepositoryPort,
    @Inject('InvoiceRepositoryPort')
    private readonly invoiceRepo: InvoiceRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(id: number, userCompanyId?: number) {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      throw new NotFoundException(`Travel plan with ID ${id} not found.`);
    }

    const travel = await this.travelRepo.findById(id, companyId);

    if (!travel) {
      throw new NotFoundException(`Travel plan with ID ${id} not found.`);
    }

    const safeParse = (json: any) => {
      if (typeof json !== 'string') return json || [];
      try {
        return JSON.parse(json);
      } catch (e) {
        return [];
      }
    };

    const travelStartTime = new Date(travel.startDate).getTime();
    const pointsRaw = safeParse(travel.travelPointsJson);
    const polylineArray = safeParse(travel.polyline);

    console.log(pointsRaw);
    const travelPoints = await Promise.all(
      pointsRaw.map(async (point: any) => {
        const locData = await this.locationRepo.findByPersonId(point.local_id);

        // Invoices associated with the point (if any)
        const pointInvoices = await Promise.all(
          (point.notas || []).map(async (notaId: number) => {
            const invoice = await this.invoiceRepo.findById(notaId, companyId);

            if (!invoice) return null;

            return {
              id: invoice.id,
              number: invoice.number,
              series: invoice.series,
              value: invoice.value,
              weight: invoice.weight,
              volume: invoice.volume,
              statusDescription: invoice.statusDescription,
            };
          }),
        );

        const arrivalTime = new Date(
          travelStartTime + point.duracao_desde_inicio_segundos * 1000,
        );

        return {
          locationId: point.local_id,
          sequence: point.sequencia,
          stopTypeId: point.tipo_parada_id,
          name: locData?.person?.name || null,
          address: this.mapAddress(locData?.reference),
          estimatedArrivalTime: arrivalTime,
          distanceFromPreviousPoint: point.distancia_ponto_anterior_metros,
          durationFromStartSeconds: point.duracao_desde_inicio_segundos,
          invoices: pointInvoices.filter((i) => i !== null),
        };
      }),
    );

    const originPoint =
      travelPoints.find((p) => p.stopTypeId === 4) || travelPoints[0];

    return {
      id: travel.id,
      totalWeight: travel.weightUsed,
      totalVolume: travel.volumeUsed,
      startDate: travel.startDate,
      endDate: travel.endDate,
      totalDistance: travel.totalDistance,
      totalValue: travel.totalValue,
      color: travel.color,
      polyline: polylineArray,
      origin: originPoint,
      travelPoints: travelPoints,
    };
  }

  private mapAddress(ref: any) {
    return {
      latitude: String(ref?.latitude || '0'),
      longitude: String(ref?.longitude || '0'),
      street: ref?.address || null,
      number: ref?.number || null,
      neighborhood: ref?.neighborhood || null,
      city: ref?.city || null,
      state: ref?.state || null,
      zipCode: ref?.zipCode || null,
    };
  }
}
