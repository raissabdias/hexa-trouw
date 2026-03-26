import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationRepositoryPort } from '../../domain/ports/location-repository.port';
import { Location } from '../../domain/models/location.model';
import { LocationEntity } from './entities/location.entity';
import { LocationMapper } from './mappers/location.mapper';

@Injectable()
// TypeORM-backed adapter that fulfills the domain repository contract
export class TypeOrmLocationRepository implements LocationRepositoryPort {
    constructor(
        @InjectRepository(LocationEntity)
        private readonly repository: Repository<LocationEntity>,
    ) { }

    async save(location: Location): Promise<Location> {
        // Convert domain model to persistence shape before writing to the database
        const persistenceModel = LocationMapper.toPersistence(location);

        const savedEntity = await this.repository.save(persistenceModel);

        // Always return the domain representation to keep layer boundaries explicit
        return LocationMapper.toDomain(savedEntity);
    }

    async findById(id: number): Promise<Location | null> {
        const entity = await this.repository.findOneBy({ id });
        if (!entity) return null;

        return LocationMapper.toDomain(entity);
    }

    async findAll(): Promise<Location[]> {
        const entities = await this.repository.find({
            relations: ['person', 'reference'],
            order: { id: 'DESC' }
        });

        return entities.map(entity => LocationMapper.toDomain(entity));
    }
}