import {
  Controller,
  Post,
  Body,
  Get,
  ParseIntPipe,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateRegionUseCase } from '../../application/use-cases/create-region.use-case';
import { ListRegionsUseCase } from '../../application/use-cases/list-regions.use-case';
import { GetRegionByIdUseCase } from '../../application/use-cases/get-region-by-id.use-case';
import { CreateRegionDto } from './dto/create-region.dto';

@ApiTags('Regions')
@ApiBearerAuth('access-token')
@Controller('regions')
export class RegionController {
  constructor(
    private readonly createRegionUseCase: CreateRegionUseCase,
    private readonly listRegionsUseCase: ListRegionsUseCase,
    private readonly getRegionByIdUseCase: GetRegionByIdUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new region' })
  @ApiCreatedResponse({ description: 'ID of the new region' })
  async create(@Body() body: CreateRegionDto) {
    return await this.createRegionUseCase.execute({
      color: body.regi_cor,
      description: body.regi_descricao,
      ceps: body.ceps || [],
      summary: body.resumo || {},
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all regions' })
  @ApiResponse({ status: 200, description: 'List of regions' })
  async findAll() {
    return this.listRegionsUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get region by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Region found' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.getRegionByIdUseCase.execute(id);
  }
}
