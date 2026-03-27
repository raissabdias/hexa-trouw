import { Controller, Post, Body, Get, ParseIntPipe, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateLocationUseCase } from '../../application/use-cases/create-location.use-case';
import { ListLocationsUseCase } from '../../application/use-cases/list-locations.use-case';
import { GetLocationByPersonUseCase } from '../../application/use-cases/get-location-by-person.use-case';
import { CreateLocationDto } from './dto/create-location.dto';

@ApiTags('Locations')
@Controller('locations')
// HTTP adapter responsible for location write operations
export class LocationController {
    constructor(
        private readonly createLocationUseCase: CreateLocationUseCase,
        private readonly listLocationsUseCase: ListLocationsUseCase,
        private readonly getLocationByPersonUseCase: GetLocationByPersonUseCase,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new location' })
    @ApiBody({ type: CreateLocationDto })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateLocationDto) {
        // Delegate business logic to the application layer
        return await this.createLocationUseCase.execute(body);
    }

    @Get()
    @ApiOperation({ summary: 'List locations with pagination and optional search' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Listed successfully' })
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,

        @Query('search') search?: string,
    ) {
        return this.listLocationsUseCase.execute(page, limit, search);
    }

    @Get(':personId')
    @ApiOperation({ summary: 'Get location by person ID' })
    @ApiResponse({ status: 200, description: 'Location found.' })
    @ApiResponse({ status: 404, description: 'Location not found.' })
    async findByPerson(@Param('personId', ParseIntPipe) personId: number) {
        // Delegate the search to the Use Case we created
        return await this.getLocationByPersonUseCase.execute(personId);
    }
}