import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';

@Injectable()
export class GetLocationByPersonUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
    ) {}

    async execute(personId: number) {
        const location = await this.locationRepo.findByPersonId(personId);

        if (!location) {
            throw new NotFoundException(`Location not found for person ID ${personId}`);
        }

        return location;
    }
}