import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './infrastructure/persistence/entities/location.entity';
import { LocationController } from './infrastructure/controllers/location.controller';
import { CreateLocationUseCase } from './application/use-cases/create-location.use-case';
import { ListLocationsUseCase } from './application/use-cases/list-locations.use-case';
import { TypeOrmLocationRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-location-repository.adapter';
import { PersonsModule } from '../persons/persons.module';
import { GetLocationByPersonUseCase } from './application/use-cases/get-location-by-person.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([LocationEntity]),
        PersonsModule
    ],
    controllers: [LocationController],
    providers: [
        CreateLocationUseCase,
        ListLocationsUseCase,
        GetLocationByPersonUseCase,
        {
            provide: 'LocationRepositoryPort',
            useClass: TypeOrmLocationRepositoryAdapter,
        },
    ],
    exports: ['LocationRepositoryPort'],
})
export class LocationsModule { }
