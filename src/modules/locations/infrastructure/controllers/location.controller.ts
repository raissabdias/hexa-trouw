import { Controller, Post, Body, Get, ParseIntPipe, Param, Query } from '@nestjs/common';
import { CreateLocationUseCase } from '../../application/use-cases/create-location.use-case';
import { ListLocationsUseCase } from '../../application/use-cases/list-locations.use-case';
import { GetLocationByPersonUseCase } from '../../application/use-cases/get-location-by-person.use-case';

@Controller('locations')
// HTTP adapter responsible for location write operations
export class LocationController {
    constructor(
        private readonly createLocationUseCase: CreateLocationUseCase,
        private readonly listLocationsUseCase: ListLocationsUseCase,
        private readonly getLocationByPersonUseCase: GetLocationByPersonUseCase,
    ) {}

    @Post()
    async create(@Body() body: any) {
        // Delegate business logic to the application layer
        return await this.createLocationUseCase.execute(body);
    }

    @Get()
    async findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
        @Query('search') search?: string,
    ) {
        console.log(`Buscando página ${page} com limite ${limit}`); // Adicione este log!
        return this.listLocationsUseCase.execute(page, limit, search);
    }

    @Get(':personId')
    async findByPerson(@Param('personId', ParseIntPipe) personId: number) {
        // Delegate the search to the Use Case we created
        return await this.getLocationByPersonUseCase.execute(personId);
    }
}