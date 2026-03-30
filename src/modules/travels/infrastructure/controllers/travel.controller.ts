import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTravelDto } from './dto/create-travel.dto';

@ApiTags('Travels')
@Controller('travels')
export class TravelController {
    constructor() {}

    @Post()
    @ApiOperation({ summary: 'Creates a new travel based on invoices and origin' })
    @ApiResponse({ 
        status: 201, 
        description: 'Travel processed and created successfully.' 
    })
    @ApiResponse({ 
        status: 400, 
        description: 'Invalid input data or invoices not found.' 
    })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() body: CreateTravelDto) {
        return {
            success: true,
            message: 'Travel request received',
            data: body
        };
    }
}