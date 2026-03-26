import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './infrastructure/persistence/entities/location.entity';
import { LocationController } from './infrastructure/controllers/location.controller';
import { CreateLocationUseCase } from './application/use-cases/create-location.use-case';
import { TypeOrmLocationRepository } from './infrastructure/persistence/typeorm-location.repository';

@Module({
    imports: [TypeOrmModule.forFeature([LocationEntity])],
    controllers: [LocationController],
    providers: [
        CreateLocationUseCase,
        {
            provide: 'LocationRepositoryPort',
            useClass: TypeOrmLocationRepository,
        },
    ],
})
export class LocationsModule { }