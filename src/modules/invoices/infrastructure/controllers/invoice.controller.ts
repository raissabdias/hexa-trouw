import { Controller, Post, Body, HttpCode, HttpStatus, Get, ParseIntPipe, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { ListInvoicesUseCase } from '../../application/use-cases/list-invoices.use-case';
import { GetInvoiceByIdUseCase } from '../../application/use-cases/get-invoice-by-id.use-case';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
    constructor(
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly listInvoicesUseCase: ListInvoicesUseCase,
        private readonly getInvoiceByIdUseCase: GetInvoiceByIdUseCase,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create a new invoice' })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: any) {
        return await this.createInvoiceUseCase.execute(body);
    }

    @Get()
    @ApiOperation({ summary: 'List invoices with pagination and optional search' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Listed successfully' })
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
        @Query('search') search?: string,
    ) {
        return await this.listInvoicesUseCase.execute(page, limit, search);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get invoice by ID' })
    @ApiResponse({ status: 200, description: 'Invoice found.' })
    @ApiResponse({ status: 404, description: 'Invoice not found.' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.getInvoiceByIdUseCase.execute(id);
    }
}