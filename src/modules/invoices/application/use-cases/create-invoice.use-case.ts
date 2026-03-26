import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { InvoiceRepositoryPort } from '../../domain/ports/invoice-repository.port';
import { Invoice } from '../../domain/models/invoice.model';

@Injectable()
export class CreateInvoiceUseCase {
    constructor(
        @Inject('InvoiceRepositoryPort')
        private readonly invoiceRepo: InvoiceRepositoryPort,
        private readonly configService: ConfigService,
    ) {}

    async execute(data: any): Promise<Invoice> {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));

        // Validação básica de duplicidade
        const existing = await this.invoiceRepo.findByNumber(data.number, companyId);
        if (existing) {
            throw new ConflictException(`Invoice ${data.number} already exists.`);
        }

        const invoice = new Invoice(
            null,
            data.number,
            data.series,
            data.value,
            data.weight,
            data.volume,
            data.recipientId,
            companyId,
            1,
            true,
            data.issuedAt ? new Date(data.issuedAt) : null,
            data.scheduledDelivery ? new Date(data.scheduledDelivery) : null
        );

        return await this.invoiceRepo.save(invoice);
    }
}