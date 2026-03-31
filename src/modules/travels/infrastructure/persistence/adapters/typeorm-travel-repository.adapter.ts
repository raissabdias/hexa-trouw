import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelRepositoryPort } from '../../../domain/ports/travel-repository.port';
import { TravelEntity } from '../entities/travel.entity';

@Injectable()
export class TypeOrmTravelRepositoryAdapter implements TravelRepositoryPort {
    constructor(
        @InjectRepository(TravelEntity)
        private readonly repository: Repository<TravelEntity>,
    ) {}

    async save(travel: Partial<TravelEntity>): Promise<TravelEntity> {
        const newTravel = this.repository.create(travel);
        return await this.repository.save(newTravel);
    }

    async findAll(
        page: number,
        limit: number,
        companyId: number
    ): Promise<{ data: TravelEntity[], total: number }> {
        const skippedItems = (page - 1) * limit;

        const [entities, total] = await this.repository.createQueryBuilder('trav')
            .leftJoinAndSelect('trav.originLocation', 'lcal')
            .leftJoinAndSelect('lcal.person', 'pess')
            .leftJoinAndSelect('lcal.reference', 'refe')
            .where('trav.companyId = :companyId', { companyId })
            .andWhere('trav.active = 1')
            .orderBy('trav.id', 'DESC')
            .skip(skippedItems)
            .take(limit)
            .getManyAndCount();

        return {
            data: entities,
            total
        };
    }
}