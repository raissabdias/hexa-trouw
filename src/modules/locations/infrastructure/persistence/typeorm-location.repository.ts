import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

    async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{ data: Location[], total: number }> {
        const skippedItems = (page - 1) * limit;

        // Build dynamic where conditions based on the presence of a search term
        let whereCondition: any = {};
        if (search) {
            whereCondition = [
                { person: { name: ILike(`%${search}%`) } },
                { reference: { description: ILike(`%${search}%`) } }
            ];
        }

        const [entities, total] = await this.repository.findAndCount({
            relations: [
                'person',
                'person.physicalPerson',
                'person.legalPerson',
                'reference'
            ],
            where: whereCondition,
            skip: skippedItems,
            take: limit,
            order: { id: 'DESC' }
        });

        const locations = entities.map(entity => LocationMapper.toDomain(entity));

        return {
            data: locations,
            total: total
        };
    }

    async findByPersonId(personId: number): Promise<Location | null> {
        const entity = await this.repository.findOne({
            where: { personId },
            relations: ['person', 'person.physicalPerson', 'person.legalPerson', 'reference']
        });

        if (!entity) return null;

        return LocationMapper.toDomain(entity);
    }
}