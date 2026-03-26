import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateLocationUseCase } from '../../application/use-cases/create-location.use-case';
import { ListLocationsUseCase } from '../../application/use-cases/list-locations.use-case';

@Controller('locations')
// HTTP adapter responsible for location write operations
export class LocationController {
    constructor(
        private readonly createLocationUseCase: CreateLocationUseCase,
        private readonly listLocationsUseCase: ListLocationsUseCase,
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
}