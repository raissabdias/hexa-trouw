import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateRegionUseCase } from '../../application/use-cases/create-region.use-case';
import { CreateRegionDto } from './dto/create-region.dto';

@ApiTags('Regions')
@ApiBearerAuth('access-token')
@Controller('regions')
export class RegionController {
    constructor(private readonly createRegionUseCase: CreateRegionUseCase) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register a new region' })
    @ApiCreatedResponse({ description: 'ID of the new region' })
    async create(
        @Body() body: CreateRegionDto
    ) {
        return await this.createRegionUseCase.execute({
            color: body.regi_cor,
            description: body.regi_descricao,
            ceps: body.ceps || [],
            summary: body.resumo || {},
        });
    }
}