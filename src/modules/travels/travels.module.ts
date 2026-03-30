import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from '../invoices/invoices.module';
import { LocationsModule } from '../locations/locations.module';
import { TravelController } from './infrastructure/controllers/travel.controller';
import { CreateTravelUseCase } from './application/use-cases/create-travel.use-case';
import { MsCubingRouterAdapter } from './infrastructure/external/ms-cubing-router.adapter';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
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
        {
            provide: 'RouterExternalPort',
            useClass: MsCubingRouterAdapter
        }
    ],
})
export class TravelsModule { }