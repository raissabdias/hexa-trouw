import { Injectable } from '@nestjs/common';

/**
 * Domain service for travel-related business logic.
 * Contains methods for processing and grouping travel route details.
 */
@Injectable()
export class TravelLogicService {
    /**
     * Groups the route details into travel points based on location changes.
     * Each travel point represents a unique location with its associated invoices and aggregated distance/duration.
     *
     * @param origin The origin location object containing id, latitude, and longitude.
     * @param details Array of route details from the routing service, each containing information about a stop and the associated invoice.
     * @returns An array of travel points, where each point represents a unique location with its associated invoices and aggregated distance/duration.
     */
    groupDetailsIntoTravelPoints(origin: { id: number, lat: string, lng: string }, details: any[]) {
        const points: any[] = [];

        // Add the origin as the first travel point
        points.push({
            sequencia: 1,
            local_id: origin.id,
            tipo_parada_id: 4, // 4 = origin type
            distancia_ponto_anterior_metros: 0,
            duracao_desde_inicio_segundos: 0,
            notas: [],
        });

        let currentPoint: any = null;
        let stopSequence = 2; 

        // Sort details by sequence to ensure correct order
        const sortedDetails = [...details].sort((a, b) => a.sequencia - b.sequencia);
        const localSequenceMap = new Map<number, number>();

        for (const detail of sortedDetails) {
            // If the location changes, create a new travel point
            if (!currentPoint || currentPoint.local_id !== detail.local_id) {
                currentPoint = {
                    sequencia: stopSequence++,
                    local_id: detail.local_id,
                    tipo_parada_id: 3, // 3 = stop type
                    distancia_ponto_anterior_metros: detail.distancia_ponto_anterior_metros,
                    duracao_desde_inicio_segundos: detail.duracao_desde_inicio_segundos,
                    notas: [detail.nota_id], 
                };
                points.push(currentPoint);
                localSequenceMap.set(detail.local_id, stopSequence - 2);
            } else {
                // If the location is the same, aggregate the invoice
                currentPoint.notas.push(detail.nota_id);
                
                currentPoint.distancia_ponto_anterior_metros = Math.max(
                    currentPoint.distancia_ponto_anterior_metros, 
                    detail.distancia_ponto_anterior_metros
                );
                currentPoint.duracao_desde_inicio_segundos = Math.max(
                    currentPoint.duracao_desde_inicio_segundos, 
                    detail.duracao_desde_inicio_segundos
                );
            }
        }

        const synchronizedDetails = sortedDetails.map((invoice) => ({
            nota_id: invoice.nota_id,
            latitude: invoice.latitude,
            local_id: invoice.local_id,
            longitude: invoice.longitude,
            sequencia: localSequenceMap.get(invoice.local_id),
            duracao_desde_inicio_segundos: invoice.duracao_desde_inicio_segundos,
            distancia_ponto_anterior_metros: invoice.distancia_ponto_anterior_metros
        }));

        return {
            travelPoints: points,
            synchronizedDetails
        };
    }
}