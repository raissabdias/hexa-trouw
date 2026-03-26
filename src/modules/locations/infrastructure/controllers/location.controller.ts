import { Controller, Post, Body } from '@nestjs/common';
import { CreateLocationUseCase } from '../../application/use-cases/create-location.use-case';

@Controller('locations')
// HTTP adapter responsible for location write operations
export class LocationController {
    constructor(private readonly createLocationUseCase: CreateLocationUseCase) { }

    @Post()
    async create(@Body() body: any) {
        // Delegate business logic to the application layer
        return await this.createLocationUseCase.execute(body);
    }
}