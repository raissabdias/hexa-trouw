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

  async execute(): Promise<Region[]> {
    const companyId = Number(this.configService.get<string>('COMPANY_ID'));
    return this.regionRepo.findAll(companyId);
  }
}
