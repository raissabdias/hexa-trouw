import { Controller, Post, Body, Get, ParseIntPipe, Param } from '@nestjs/common';
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
    async findAll() {
        return this.listLocationsUseCase.execute();
    }

    @Get(':personId')
    async findByPerson(@Param('personId', ParseIntPipe) personId: number) {
        // Delegate the search to the Use Case we created
        return await this.getLocationByPersonUseCase.execute(personId);
    }
}