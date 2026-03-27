import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { InvoiceRepositoryPort } from '../../domain/ports/invoice-repository.port';

@Injectable()
export class GetInvoiceByIdUseCase {
    constructor(
        @Inject('InvoiceRepositoryPort')
        private readonly invoiceRepo: InvoiceRepositoryPort,
        private readonly configService: ConfigService,
    ) {}

    async execute(id: number) {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));
        const invoice = await this.invoiceRepo.findById(id, companyId);

        if (!invoice) {
            throw new NotFoundException(`Invoice not found for ID ${id} and company ID ${companyId}`);
        }

        return invoice;
    }
}