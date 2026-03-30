import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RouterExternalPort, RouterInvoiceInput, RouterResponse } from '../../domain/ports/router-external.port';
import { AxiosResponse } from 'axios';

@Injectable()
export class MsCubingRouterAdapter implements RouterExternalPort {
    private readonly url = 'https://prd-ms-cubing.trouw.com.br/api/v1/cubing/optimized/here-manual';

    constructor(private readonly httpService: HttpService) {}

    async calculateRoute(
        origin: { lat: string; lng: string },
        invoices: RouterInvoiceInput[],
        startDate: string,
        companyId: number
    ): Promise<RouterResponse> {
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
                this.httpService.post<any>(this.url, payload)
            );
            
            console.log(response);
            const data = response.data[0]; 

            if (data.errors && data.errors.length > 0) {
                console.error('Erros de negócio do MS Cubing:', data.errors);
                throw new InternalServerErrorException(`MS Cubing: ${data.errors[0].reason}`);
            }

            if (!data || !data.vehicles) {
                console.error('Unexpected response from MS Cubing:', response.data);
                throw new Error('Invalid response structure: "vehicles" field not found.');
            }
            
            return {
                rawResponse: data,
                sequence: data.vehicles[0][0].invoices.map((inv: any, index: number) => ({
                    invoiceId: inv.invoiceId,
                    order: index + 1,
                    estimatedArrival: new Date(inv.arrivalTime)
                }))
            };
        } catch (error) {
            console.error('Error MS Cubing:', error.response?.data || error.message);
            throw new InternalServerErrorException('Error calculating route with MS Cubing');
        }
    }
}