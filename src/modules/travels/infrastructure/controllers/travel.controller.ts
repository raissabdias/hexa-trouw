import { Controller, Post, Body, HttpStatus, HttpCode, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiNotFoundResponse, ApiQuery } from '@nestjs/swagger';
import { CreateTravelDto } from './dto/create-travel.dto';
import { CreateTravelUseCase } from '../../application/use-cases/create-travel.use-case';
import { CreateTravelResponseDto } from './dto/create-travel-response.dto';
import { NotFoundResponseDto } from '../../../../common/dto/not-found-response.dto';
import { ListTravelsResponseDto } from './dto/list-travels-response.dto';
import { ListTravelsUseCase } from '../../application/use-cases/list-travels.use-case';

@ApiTags('Travels')
@Controller('travels')
export class TravelController {
    constructor(
        private readonly createTravelUseCase: CreateTravelUseCase,
        private readonly listTravelsUseCase: ListTravelsUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Create a new travel plan' })
    @ApiOkResponse({ 
        description: 'Travel plan created successfully',
        type: CreateTravelResponseDto 
    })
    @ApiNotFoundResponse({ 
        description: 'Invoice or origin location not found',
        type: NotFoundResponseDto 
    })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateTravelDto) {
        return await this.createTravelUseCase.execute(body);
    }

    @Get()
    @ApiOperation({ summary: 'List all travel plans' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Current page (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiOkResponse({ 
        description: 'Travels listed successfully',
        type: ListTravelsResponseDto 
    })
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ): Promise<ListTravelsResponseDto> {
        return await this.listTravelsUseCase.execute(page, limit);
    }
}