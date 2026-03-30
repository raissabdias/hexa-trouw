import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from '../invoices/invoices.module';
import { LocationsModule } from '../locations/locations.module';
import { TravelController } from './infrastructure/controllers/travel.controller';
import { CreateTravelUseCase } from './application/use-cases/create-travel.use-case';
import { MsCubingRouterAdapter } from './infrastructure/external/ms-cubing-router.adapter';
import { HttpModule } from '@nestjs/axios';
import { TravelLogicService } from './domain/services/travel-logic.service';
import { TravelEntity } from './infrastructure/persistence/entities/travel.entity';
import { TypeOrmTravelRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-travel-repository.adapter';

@Module({
    imports: [
        TypeOrmModule.forFeature([TravelEntity]),
        ConfigModule,
        InvoiceModule, 
        LocationsModule,
        HttpModule,
    ],
    controllers: [
        TravelController
    ],
    providers: [
        CreateTravelUseCase,
        TravelLogicService,
        {
            provide: 'RouterExternalPort',
            useClass: MsCubingRouterAdapter
        },
        {
            provide: 'TravelRepositoryPort',
            useClass: TypeOrmTravelRepositoryAdapter
        }
    ],
})
export class TravelsModule { }