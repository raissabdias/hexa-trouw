import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { RegionRepositoryPort } from '../../domain/ports/region-repository.port';
import { Region } from '../../domain/models/region.model';
import { ConfigService } from '@nestjs/config';

export interface GetRegionByIdInput {
  id: number;
}

@Injectable()
export class GetRegionByIdUseCase {
  constructor(
    @Inject('RegionRepositoryPort')
    private readonly regionRepo: RegionRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(id: number, userCompanyId?: number): Promise<Region> {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    const region = await this.regionRepo.findById(id, companyId);

    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    return region;
  }
}
