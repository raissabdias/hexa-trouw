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

  async execute(id: number, userCompanyId?: number) {
    const envCompanyId = this.configService.get<string>('COMPANY_ID');
    const companyId = envCompanyId ? Number(envCompanyId) : userCompanyId;

    if (!companyId) {
      throw new NotFoundException(`Company ID is required`);
    }

    const invoice = await this.invoiceRepo.findById(id, companyId);

    if (!invoice) {
      throw new NotFoundException(
        `Invoice not found for ID ${id} and company ID ${companyId}`,
      );
    }

    return invoice;
  }
}
