import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from '../invoices/invoices.module';
import { LocationsModule } from '../locations/locations.module';
import { TravelController } from './infrastructure/controllers/travel.controller';
import { CreateTravelUseCase } from './application/use-cases/create-travel.use-case';

@Module({
    imports: [
        ConfigModule,
        InvoiceModule, 
        LocationsModule,
    ],
    controllers: [
        TravelController
    ],
    providers: [
        CreateTravelUseCase
    ],
})
export class TravelsModule { }