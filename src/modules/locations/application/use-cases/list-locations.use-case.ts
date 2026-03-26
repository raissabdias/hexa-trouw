import { Injectable, Inject } from '@nestjs/common';
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';

@Injectable()
export class ListLocationsUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort
    ) {}

    // Executes the use case to retrieve a paginated list of locations
    async execute(page: number = 1, limit: number = 10, search?: string) {
        return this.locationRepo.findAll(page, limit, search);
    }
}