import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { CreateTravelDto } from './dto/create-travel.dto';
import { CreateTravelUseCase } from '../../application/use-cases/create-travel.use-case';
import { CreateTravelResponseDto } from './dto/create-travel-response.dto';
import { NotFoundResponseDto } from '../../../../common/dto/not-found-response.dto';

@ApiTags('Travels')
@Controller('travels')
export class TravelController {
    constructor(
        private readonly createTravelUseCase: CreateTravelUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cria um novo planejamento de viagem' })
    @ApiOkResponse({ 
        description: 'Viagem criada com sucesso',
        type: CreateTravelResponseDto 
    })
    @ApiNotFoundResponse({ 
        description: 'Fatura ou Localização de origem não encontrada',
        type: NotFoundResponseDto 
    })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateTravelDto) {
        return await this.createTravelUseCase.execute(body);
    }
}