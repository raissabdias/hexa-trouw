import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { InvoiceRepositoryPort } from '../../domain/ports/invoice-repository.port';
import { Invoice } from '../../domain/models/invoice.model';

@Injectable()
export class ListInvoicesUseCase {
    constructor(
        @Inject('InvoiceRepositoryPort')
        private readonly invoiceRepo: InvoiceRepositoryPort,
        private readonly configService: ConfigService,
    ) { }

    // Application service for listing invoices with pagination and optional search
    async execute(
        page: number = 1,
        limit: number = 10,
        search?: string
    ): Promise<{ data: Invoice[], total: number }> {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));
        return await this.invoiceRepo.findAll(page, limit, search, companyId);
    }
}