import { Region } from '../models/region.model';

export interface RegionRepositoryPort {
    insert(region: Region): Promise<number>;
}