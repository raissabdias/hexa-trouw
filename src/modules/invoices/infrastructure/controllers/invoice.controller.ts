import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';

@Controller('invoices')
export class InvoiceController {
    constructor(private readonly createInvoiceUseCase: CreateInvoiceUseCase) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: any) {
        return await this.createInvoiceUseCase.execute(body);
    }
}