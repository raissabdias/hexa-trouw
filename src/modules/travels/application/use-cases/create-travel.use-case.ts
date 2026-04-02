import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTravelDto } from '../../infrastructure/controllers/dto/create-travel.dto';
import type { InvoiceRepositoryPort } from 'src/modules/invoices/domain/ports/invoice-repository.port';
import type { LocationRepositoryPort } from 'src/modules/locations/domain/ports/location-repository.port';
import type { RouterExternalPort } from '../../domain/ports/router-external.port';
import type { TravelRepositoryPort } from '../../domain/ports/travel-repository.port';
import { TravelLogicService } from '../../domain/services/travel-logic.service';

/**
 * Use case for creating a travel.
 * Handles all business logic, including validation, fetching dependencies, and calling external services.
 */
@Injectable()
export class CreateTravelUseCase {
  /**
   * Constructor with all required dependencies injected.
   * @param configService Provides access to environment variables and configuration.
   * @param invoiceRepo Repository for accessing invoice data.
   * @param locationRepo Repository for accessing location data.
   * @param routerExternal Port for external routing service integration.
   * @param travelRepo Repository for persisting travel data.
   * @param travelLogicService Domain service for travel-related business logic.
   */
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
    private readonly travelLogicService: TravelLogicService,
  ) {}

  /**
   * Main execution method for the use case.
   * Validates input, fetches invoices and origin, and processes the travel.
   * Throws NotFoundException if any required entity is missing.
   * @param data DTO containing travel creation input data.
   */
  async execute(data: CreateTravelDto, userCompanyId?: number) {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      throw new Error('Company ID is required');
    }

    let totalValue = 0;
    // Fetch all invoices and sum their values. Throws if any invoice is not found.
    const invoices = await Promise.all(
      data.invoiceIds.map(async (id) => {
        const invoice = await this.invoiceRepo.findById(id, companyId);
        if (!invoice) throw new NotFoundException(`Invoice ${id} not found.`);
        totalValue += Number(invoice.value || 0); // Sums invoice value
        return invoice;
      }),
    );

    // Fetch the origin location. Throws if not found.
    const origin = await this.locationRepo.findByPersonId(data.originPersonId);
    if (!origin)
      throw new NotFoundException(`Origin ${data.originPersonId} not found.`);

    // Prepare input for the external routing service.
    const routerInputs = invoices.map((inv) => ({
      invoiceId: inv.id ?? 0,
      invoiceNumber: inv.number ?? '',
      lat: String(inv.recipient?.address?.latitude ?? '0'),
      lng: String(inv.recipient?.address?.longitude ?? '0'),
      weight: inv.weight ?? 0,
      volume: inv.volume ?? 0,
      recipientPersonId: inv.recipientId,
    }));

    // Call the external routing service to calculate the optimal route.
    const routeResult = await this.routerExternal.calculateRoute(
      {
        lat: String(origin.reference.latitude),
        lng: String(origin.reference.longitude),
      },
      routerInputs,
      data.startDate,
      companyId,
    );

    // Group the route details into travel points for further processing.
    const { travelPoints, synchronizedDetails } =
      this.travelLogicService.groupDetailsIntoTravelPoints(
        {
          id: data.originPersonId,
          lat: String(origin.reference.latitude),
          lng: String(origin.reference.longitude),
        },
        routeResult.details,
      );

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
      endDate: new Date(
        new Date(data.startDate).getTime() +
          routeResult.summary.totalDuration * 1000,
      ),
      totalDistance: routeResult.summary.totalDistance,
      detailsJson: JSON.stringify(synchronizedDetails),
      travelPointsJson: JSON.stringify(travelPoints),
      color: this.generateRandomColor(),
      active: 1,
      polyline: JSON.stringify(routeResult.polyline),
      apiName: 'Trouw Hexa - API Here Manual',
      totalValue: totalValue,
    });

    return {
      travelId: travelSaved.id,
      summary: routeResult.summary,
    };
  }

  /**
   * Generates a random hex color code for travel visualization purposes
   */
  private generateRandomColor(): string {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  }
}
