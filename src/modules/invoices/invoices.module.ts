import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvoiceEntity } from './infrastructure/persistence/entities/invoice.entity';
import { TypeOrmInvoiceRepository } from './infrastructure/persistence/repositories/typeorm-invoice.repository';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { ListInvoicesUseCase } from './application/use-cases/list-invoices.use-case';
import { GetInvoiceByIdUseCase } from './application/use-cases/get-invoice-by-id.use-case';
import { InvoiceStatusEntity } from './infrastructure/persistence/entities/invoice-status.entity';
import { ReferenceEntity } from '../locations/infrastructure/persistence/entities/reference.entity';
import { LocationEntity } from '../locations/infrastructure/persistence/entities/location.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvoiceEntity,
            InvoiceStatusEntity, 
            LocationEntity, 
            ReferenceEntity
        ]),
        ConfigModule,
    ],
    controllers: [InvoiceController],
    providers: [
        CreateInvoiceUseCase,
        ListInvoicesUseCase,
        GetInvoiceByIdUseCase,
        {
            provide: 'InvoiceRepositoryPort',
            useClass: TypeOrmInvoiceRepository,
        },
    ],
})
export class InvoiceModule { }