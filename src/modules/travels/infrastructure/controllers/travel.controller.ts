import { Controller, Post, Body, HttpStatus, HttpCode, Get, Query, ParseIntPipe, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiNotFoundResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTravelDto } from './dto/create-travel.dto';
import { CreateTravelUseCase } from '../../application/use-cases/create-travel.use-case';
import { CreateTravelResponseDto } from './dto/create-travel-response.dto';
import { NotFoundResponseDto } from '../../../../common/dto/not-found-response.dto';
import { ListTravelsResponseDto } from './dto/list-travels-response.dto';
import { ListTravelsUseCase } from '../../application/use-cases/list-travels.use-case';
import { DeleteTravelUseCase } from '../../application/use-cases/delete-travel.use-case';
import { DeleteTravelResponseDto } from './dto/delete-travel-response.dto';
import { GetTravelByIdUseCase } from '../../application/use-cases/get-travel-by-id.use-case';

@ApiTags('Travels')
@ApiBearerAuth('access-token')
@Controller('travels')
export class TravelController {
    constructor(
        private readonly createTravelUseCase: CreateTravelUseCase,
        private readonly listTravelsUseCase: ListTravelsUseCase,
        private readonly deleteTravelUseCase: DeleteTravelUseCase,
        private readonly getTravelByIdUseCase: GetTravelByIdUseCase,
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

    @Delete(':id')
    @ApiOperation({ summary: 'Deactivate a travel plan (Soft Delete)' })
    @ApiOkResponse({ 
        description: 'Travel plan deactivated successfully',
        type: DeleteTravelResponseDto 
    })
    @ApiNotFoundResponse({ 
        description: 'Travel plan not found',
        type: NotFoundResponseDto 
    })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.deleteTravelUseCase.execute(id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get detailed travel plan by ID' })
    @ApiOkResponse({ description: 'Travel plan details retrieved successfully' })
    @ApiNotFoundResponse({ description: 'Travel plan not found' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        return await this.getTravelByIdUseCase.execute(id);
    }
}