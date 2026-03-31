import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
    @ApiProperty({ example: '-20.805137' })
    latitude: string;

    @ApiProperty({ example: '-49.3730712' })
    longitude: string;

    @ApiProperty({ example: 'Avenida das Nacoes Unidas' })
    street: string;

    @ApiProperty({ example: '12901' })
    number: string;

    @ApiProperty({ example: 'Brooklin Novo' })
    neighborhood: string;

    @ApiProperty({ example: 'São Paulo' })
    city: string;

    @ApiProperty({ example: 'SP' })
    state: string;

    @ApiProperty({ example: '04578000' })
    zipCode: string;
}

class TravelPointDto {
    @ApiProperty({ example: 42510 })
    locationId: number;

    @ApiProperty({ example: 1 })
    sequence: number;

    @ApiProperty({ example: 4, description: '4 = Origin, 3 = Delivery' })
    stopTypeId: number;

    @ApiProperty({ example: 'CLIENTE EXEMPLO' })
    name: string;

    @ApiProperty({ type: AddressDto })
    address: AddressDto;
}

export class TravelListItemDto {
    @ApiProperty({ example: 2437 })
    id: number;

    @ApiProperty({ example: 5 })
    invoiceQuantity: number;

    @ApiProperty({ example: 3 })
    locationQuantity: number;

    @ApiProperty({ example: 512.5 })
    totalWeight: number;

    @ApiProperty({ example: 4.21 })
    totalVolume: number;

    @ApiProperty({ example: '2026-03-31T10:00:00Z' })
    startDate: Date;

    @ApiProperty({ example: '2026-03-31T18:00:00Z' })
    endDate: Date;

    @ApiProperty({ example: 947061 })
    totalDistance: number;

    @ApiProperty({ example: 15500.50 })
    totalValue: number;

    @ApiProperty({ 
        example: 'blue', 
        description: 'Hexadecimal or name of the route color' 
    })
    color: string;

    @ApiProperty({ 
        example: ["BGpts-sB5l6_...", "Az_sXj2..."], 
        description: 'Array of encoded polylines for map segments' 
    })
    polyline: string[];

    @ApiProperty({ type: TravelPointDto })
    origin: TravelPointDto;

    @ApiProperty({ type: [TravelPointDto] })
    travelPoints: TravelPointDto[];
}

export class ListTravelsResponseDto {
    @ApiProperty({ type: [TravelListItemDto] })
    data: TravelListItemDto[];

    @ApiProperty({ example: 100 })
    total: number;
}