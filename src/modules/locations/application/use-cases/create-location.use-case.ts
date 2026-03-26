import { Injectable, Inject } from '@nestjs/common';
import { Location } from '../../domain/models/location.model';
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';

@Injectable()
// Application service responsible for creating a new active location
export class CreateLocationUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
    ) { }

    async execute(dto: any): Promise<Location> {
        // New locations start as active by default
        const newLocation = new Location(
            null,
            dto.personId,
            dto.referenceId,
            dto.radius,
            true, // lcal_ativo = 'S'
        );

        // Enforce domain invariant before persisting
        if (!newLocation.isValidRadius()) {
            throw new Error('O raio do local deve ser positivo');
        }

        return await this.locationRepo.save(newLocation);
    }
}