import { Injectable, Inject } from '@nestjs/common';
import { Region } from '../../domain/models/region.model';
import type { RegionRepositoryPort } from '../../domain/ports/region-repository.port';
import { ConfigService } from '@nestjs/config';

export interface CreateRegionInput {
  color: string;
  description: string;
  ceps: string[];
  summary: any;
}

@Injectable()
export class CreateRegionUseCase {
  constructor(
    @Inject('RegionRepositoryPort')
    private readonly regionRepo: RegionRepositoryPort,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    input: CreateRegionInput,
    userCompanyId?: number,
  ): Promise<number> {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      throw new Error('Company ID is required');
    }

    const region = new Region(
      null,
      companyId,
      input.color,
      input.description,
      input.ceps,
      input.summary,
      true,
    );

    const id = await this.regionRepo.insert(region);

    return id;
  }
}
