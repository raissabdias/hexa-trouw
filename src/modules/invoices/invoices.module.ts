import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { InvoiceEntity } from './infrastructure/persistence/entities/invoice.entity';
import { TypeOrmInvoiceRepository } from './infrastructure/persistence/repositories/typeorm-invoice.repository';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { ListInvoicesUseCase } from './application/use-cases/list-invoices.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([InvoiceEntity]),
        ConfigModule,
    ],
    controllers: [InvoiceController],
    providers: [
        CreateInvoiceUseCase,
        ListInvoicesUseCase,
        {
            provide: 'InvoiceRepositoryPort',
            useClass: TypeOrmInvoiceRepository,
        },
    ],
})
export class InvoiceModule { }