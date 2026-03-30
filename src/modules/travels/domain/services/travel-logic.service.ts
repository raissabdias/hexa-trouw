import { Injectable } from '@nestjs/common';

@Injectable()
export class TravelLogicService {
    /**
     * Groups the route details into travel points based on location changes
     * @param details Array of route details from the routing service, each containing information about a stop and the associated invoice
     * @returns An array of travel points, where each point represents a unique location with its associated invoices and aggregated distance/duration
     */
    groupDetailsIntoTravelPoints(origin: { id: number, lat: string, lng: string }, details: any[]) {
        const points: any[] = [];

        points.push({
            sequencia: 1,
            local_id: origin.id,
            tipo_parada_id: 4,
            distancia_ponto_anterior_metros: 0,
            duracao_desde_inicio_segundos: 0,
            notas: [],
        });

        let currentPoint: any = null;
        let stopSequence = 2; 

        const sortedDetails = [...details].sort((a, b) => a.sequencia - b.sequencia);

        for (const detail of sortedDetails) {
            if (!currentPoint || currentPoint.local_id !== detail.local_id) {
                currentPoint = {
                    sequencia: stopSequence++,
                    local_id: detail.local_id,
                    tipo_parada_id: 3,
                    distancia_ponto_anterior_metros: detail.distancia_ponto_anterior_metros,
                    duracao_desde_inicio_segundos: detail.duracao_desde_inicio_segundos,
                    notas: [detail.nota_id], 
                };
                points.push(currentPoint);
            } else {
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

        return points;
    }
}