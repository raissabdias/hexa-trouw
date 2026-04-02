import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TravelRepositoryPort } from '../../domain/ports/travel-repository.port';
import type { LocationRepositoryPort } from '../../../locations/domain/ports/location-repository.port';

/**
 * Use case for listing travels with pagination and formatting.
 * Fetches travels from the repository, enriches them with location data,
 * and formats the output for API responses.
 */
@Injectable()
export class ListTravelsUseCase {
  constructor(
    @Inject('TravelRepositoryPort')
    private readonly travelRepo: TravelRepositoryPort, // Repository for travel data
    @Inject('LocationRepositoryPort')
    private readonly locationRepo: LocationRepositoryPort, // Repository for location data
    private readonly configService: ConfigService, // Service for accessing environment/config variables
  ) {}

  /**
   * Executes the use case: fetches and formats travels with pagination.
   * @param page Page number for pagination (default: 1)
   * @param limit Number of items per page (default: 10)
   * @returns An object containing the formatted travels and total count
   */
  async execute(page: number = 1, limit: number = 10, userCompanyId?: number) {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      return { data: [], total: 0 };
    }

    const { data, total } = await this.travelRepo.findAll(
      page,
      limit,
      companyId,
    );

    const formattedTravels = await Promise.all(
      data.map(async (travel) => {
        // Helper to safely parse JSON fields
        const safeParse = (json: any) => {
          if (typeof json !== 'string') return json || [];
          try {
            return JSON.parse(json);
          } catch (e) {
            return [];
          }
        };

        // Parse invoice IDs and travel points from JSON fields
        const invoiceIds = safeParse(travel.invoiceIdsJson);
        const pointsRaw = safeParse(travel.travelPointsJson);
        const polylineArray = safeParse(travel.polyline);

        // Enrich travel points with location data
        const travelPoints = await Promise.all(
          Array.isArray(pointsRaw)
            ? pointsRaw.map(async (point: any) => {
                const locData = await this.locationRepo.findByPersonId(
                  point.local_id,
                );
                return {
                  locationId: point.local_id,
                  sequence: point.sequencia,
                  stopTypeId: point.tipo_parada_id,
                  name: locData?.person?.name || null,
                  address: this.mapAddress(locData?.reference),
                };
              })
            : [],
        );

        // Find the origin point (stopTypeId === 4) or fallback to the first point
        const originPoint =
          travelPoints.find((p) => p.stopTypeId === 4) || travelPoints[0];

        return {
          id: travel.id,
          invoiceQuantity: Array.isArray(invoiceIds) ? invoiceIds.length : 0,
          locationQuantity: travelPoints.length,
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
      }),
    );

    return { data: formattedTravels, total };
  }

  /**
   * Maps a reference object to a standardized address format.
   * @param ref Reference object containing address data
   * @returns Standardized address object
   */
  private mapAddress(ref: any) {
    return {
      latitude: String(ref?.latitude || '0'),
      longitude: String(ref?.longitude || '0'),
      street: ref?.address || 'N/A',
      number: ref?.number || 'N/A',
      neighborhood: ref?.neighborhood || 'N/A',
      city: ref?.city || 'N/A',
      state: ref?.state || 'N/A',
      zipCode: ref?.zipCode || 'N/A',
    };
  }
}
