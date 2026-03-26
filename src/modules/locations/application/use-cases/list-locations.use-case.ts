import { Injectable, Inject } from '@nestjs/common';
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';

@Injectable()
export class ListLocationsUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort
    ) { }

    async execute() {
        return this.locationRepo.findAll();
    }
}