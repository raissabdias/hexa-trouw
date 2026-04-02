import { Injectable, Inject } from '@nestjs/common';
import type { RegionRepositoryPort } from '../../domain/ports/region-repository.port';
import { Region } from '../../domain/models/region.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ListRegionsUseCase {
  constructor(
    @Inject('RegionRepositoryPort')
    private readonly regionRepo: RegionRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(userCompanyId?: number): Promise<Region[]> {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      return [];
    }

    return this.regionRepo.findAll(companyId);
  }
}
