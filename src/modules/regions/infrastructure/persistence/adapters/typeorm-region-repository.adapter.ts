import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionRepositoryPort } from '../../../domain/ports/region-repository.port';
import { RegionEntity } from '../entities/region.entity';
import { Region } from '../../../domain/models/region.model';

@Injectable()
export class TypeOrmRegionRepositoryAdapter implements RegionRepositoryPort {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly repository: Repository<RegionEntity>,
  ) {}

  async insert(region: Region): Promise<number> {
    const newRegion = this.repository.create({
      companyId: region.companyId,
      color: region.color,
      description: region.description,
      ceps: region.ceps,
      summary: region.summary,
      isActive: region.isActive ? 1 : 0,
    });

    const savedRegion = await this.repository.save(newRegion);
    return savedRegion.id;
  }

  async findById(id: number, companyId: number): Promise<Region | null> {
    const entity = await this.repository.findOne({
      where: { id, companyId, isActive: 1 },
    });
    if (!entity) return null;

    return new Region(
      entity.id,
      entity.companyId,
      entity.color,
      entity.description,
      entity.ceps,
      entity.summary,
      entity.isActive === 1,
    );
  }

  async findAll(companyId: number): Promise<Region[]> {
    const entities = await this.repository.find({
      where: { companyId, isActive: 1 },
    });

    return entities.map(
      (entity) =>
        new Region(
          entity.id,
          entity.companyId,
          entity.color,
          entity.description,
          entity.ceps,
          entity.summary,
          entity.isActive === 1,
        ),
    );
  }
}
