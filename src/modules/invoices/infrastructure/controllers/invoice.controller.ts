import { Controller, Post, Body, HttpCode, HttpStatus, Get, ParseIntPipe, Query, Param } from '@nestjs/common';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { ListInvoicesUseCase } from '../../application/use-cases/list-invoices.use-case';
import { GetInvoiceByIdUseCase } from '../../application/use-cases/get-invoice-by-id.use-case';

@Controller('invoices')
export class InvoiceController {
    constructor(
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly listInvoicesUseCase: ListInvoicesUseCase,
        private readonly getInvoiceByIdUseCase: GetInvoiceByIdUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: any) {
        return await this.createInvoiceUseCase.execute(body);
    }

    @Get()
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
        @Query('search') search?: string,
    ) {
        return await this.listInvoicesUseCase.execute(page, limit, search);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.getInvoiceByIdUseCase.execute(id);
    }
}