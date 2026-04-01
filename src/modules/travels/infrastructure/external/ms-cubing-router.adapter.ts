import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RouterExternalPort, RouterInvoiceInput, RouterResponse } from '../../domain/ports/router-external.port';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MsCubingRouterAdapter implements RouterExternalPort {
    private readonly url = '';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async calculateRoute(
        origin: { lat: string; lng: string },
        invoices: RouterInvoiceInput[],
        startDate: string,
        companyId: number
    ): Promise<RouterResponse> {
        const url = this.configService.get<string>('MS_CUBING_URL');

        if (!url) {
            throw new InternalServerErrorException('MS_CUBING_URL is not defined in environment variables');
        }

        // Capacity totals
        const totalWeight = invoices.reduce((sum, inv) => sum + inv.weight, 0);
        const totalVolume = invoices.reduce((sum, inv) => sum + inv.volume, 0);

        const dateObj = new Date(startDate);
        const formattedDate = dateObj.toISOString()
            .replace('T', ' ')
            .substring(0, 19);

        // Payload format expected by the MS de Cubing
        const payload = [{
            date: formattedDate, // Format: YYYY-MM-DD HH:mm:ss
            origin: { location: { lat: Number(origin.lat), lng: Number(origin.lng) } },
            clientId: companyId,
            invoices: invoices.map(inv => ({
                location: { lat: Number(inv.lat), lng: Number(inv.lng) },
                invoiceId: inv.invoiceId,
                dimentions: { cubing: inv.volume, weight: inv.weight },
                macroRegion: 1,
                crossdocking: 0,
                invoiceNumber: Number(inv.invoiceNumber),
                localDeliveryId: inv.recipientPersonId
            })),
            vehicles: [[{
                type: "7",
                plate: "FICTICIO-01",
                dimentions: {
                    totalCubing: totalVolume + 1000, // Ensure it always fits
                    availableCubing: totalVolume + 1000,
                    totalWeightCapacity: totalWeight + 100,
                    availableWeightCapacity: totalWeight + 100
                },
                macroRegion: 1
            }]],
            sequenced: 0,
            crossdockingSort: false
        }];

        try {
            const response: AxiosResponse<any> = await firstValueFrom(
                this.httpService.post<any>(url, payload)
            );
            
            const data = Array.isArray(response.data) ? response.data[0] : response.data;
            const vehicle = data.vehicles[0][0];
            const startTime = new Date(startDate).getTime();

            const details = vehicle.invoices.map((invItem: any, index: number) => {
                const arrivalTime = new Date(invItem.arrivalTime).getTime();
                const durationSeconds = Math.max(0, Math.floor((arrivalTime - startTime) / 1000));

                return {
                    nota_id: invItem.invoiceId,
                    local_id: invItem.localDeliveryId,
                    sequencia: index + 1,
                    distancia_ponto_anterior_metros: invItem.distanceFromLastStop || 0,
                    duracao_desde_inicio_segundos: durationSeconds,
                    latitude: String(invItem.location.lat),
                    longitude: String(invItem.location.lng)
                };
            });

            return {
                summary: {
                    totalDistance: vehicle.metrics.totalDistance,
                    totalDuration: vehicle.metrics.totalDuration,
                    weightUsed: vehicle.dimentions.usedWeightCapacity,
                    weightCapacity: vehicle.dimentions.totalWeightCapacity,
                    volumeUsed: vehicle.dimentions.usedCubing,
                    volumeCapacity: vehicle.dimentions.totalCubing,
                },
                details: details,
                polyline: vehicle.polyline || [],
                rawResponse: data
            };
        } catch (error) {
            console.error('Error MS Cubing:', error.response?.data || error.message);
            throw new InternalServerErrorException('Error calculating route with MS Cubing');
        }
    }
}