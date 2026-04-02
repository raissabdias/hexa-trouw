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

  async execute(
    page: number = 1,
    limit: number = 10,
    search?: string,
    userCompanyId?: number,
  ) {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;
    return this.locationRepo.findAll(page, limit, search, companyId);
  }
}
