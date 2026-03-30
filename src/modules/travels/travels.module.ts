import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from '../invoices/invoices.module';
import { LocationsModule } from '../locations/locations.module';
import { TravelController } from './infrastructure/controllers/travel.controller';

@Module({
    imports: [
        ConfigModule,
        InvoiceModule, 
        LocationsModule,
    ],
    controllers: [
        TravelController
    ],
    providers: [],
})
export class TravelsModule { }