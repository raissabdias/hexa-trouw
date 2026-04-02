import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  ParseIntPipe,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { ListInvoicesUseCase } from '../../application/use-cases/list-invoices.use-case';
import { GetInvoiceByIdUseCase } from '../../application/use-cases/get-invoice-by-id.use-case';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import {
  InvoiceListResponseDto,
  InvoiceResponseDto,
  InvoiceSingleResponseDto,
} from './dto/invoice-response.dto';
import { ListInvoicesQueryDto } from './dto/list-invoices-query.dto';
import { CurrentCompanyId } from '../../../auth/infrastructure/decorators/current-company-id.decorator';

@ApiTags('Invoices')
@ApiBearerAuth('access-token')
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly listInvoicesUseCase: ListInvoicesUseCase,
    private readonly getInvoiceByIdUseCase: GetInvoiceByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({ type: CreateInvoiceDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() body: CreateInvoiceDto,
    @CurrentCompanyId() companyId?: number,
  ) {
    return await this.createInvoiceUseCase.execute(body, companyId);
  }

  @Get()
  @ApiOperation({
    summary: 'List invoices with pagination and optional search',
  })
  @ApiResponse({
    status: 200,
    type: InvoiceListResponseDto,
    description: 'Listed successfully',
  })
  async findAll(
    @Query() query: ListInvoicesQueryDto,
    @CurrentCompanyId() companyId?: number,
  ) {
    // Conversão manual de tipos para evitar dependência de class-transformer
    const formattedQuery = {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      search: query.search,
      availableOnly: query.availableOnly === 'true',
    };

    return await this.listInvoicesUseCase.execute(
      formattedQuery.page,
      formattedQuery.limit,
      formattedQuery.search,
      formattedQuery.availableOnly,
      companyId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({
    status: 200,
    type: InvoiceSingleResponseDto,
    description: 'Invoice found.',
  })
  @ApiResponse({ status: 404, description: 'Invoice not found.' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentCompanyId() companyId?: number,
  ) {
    return await this.getInvoiceByIdUseCase.execute(id, companyId);
  }
}
