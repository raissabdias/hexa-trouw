import { Injectable, Inject } from '@nestjs/common';
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ListLocationsUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
        private readonly configService: ConfigService,
    ) {}

    // Executes the use case to retrieve a paginated list of locations
    async execute(page: number = 1, limit: number = 10, search?: string) {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));
        return this.locationRepo.findAll(page, limit, search, companyId);
    }
}