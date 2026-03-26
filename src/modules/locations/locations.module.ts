import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './infrastructure/persistence/entities/location.entity';
import { LocationController } from './infrastructure/controllers/location.controller';
import { CreateLocationUseCase } from './application/use-cases/create-location.use-case';
import { ListLocationsUseCase } from './application/use-cases/list-locations.use-case';
import { TypeOrmLocationRepository } from './infrastructure/persistence/typeorm-location.repository';
import { PersonsModule } from '../persons/persons.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocationEntity]),
        PersonsModule
    ],
    controllers: [LocationController],
    providers: [
        CreateLocationUseCase,
        {
            provide: 'LocationRepositoryPort',
            useClass: TypeOrmLocationRepository,
        },
        ListLocationsUseCase
    ],
})
export class LocationsModule { }