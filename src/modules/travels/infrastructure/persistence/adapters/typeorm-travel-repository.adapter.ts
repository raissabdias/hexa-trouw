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
}