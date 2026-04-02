import { Region } from '../models/region.model';

export interface RegionRepositoryPort {
  insert(region: Region): Promise<number>;
  findById(id: number, companyId: number): Promise<Region | null>;
  findAll(companyId: number): Promise<Region[]>;
}
