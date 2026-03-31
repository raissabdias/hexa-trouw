import { ApiProperty } from '@nestjs/swagger';

class TravelSummaryDto {
    @ApiProperty({ example: 947061 })
    totalDistance: number;

    @ApiProperty({ example: 35645 })
    totalDuration: number;

    @ApiProperty({ example: 512 })
    weightUsed: number;

    @ApiProperty({ example: 612 })
    weightCapacity: number;

    @ApiProperty({ example: 4212985 })
    volumeUsed: number;

    @ApiProperty({ example: 4213985 })
    volumeCapacity: number;
}

export class CreateTravelResponseDto {
    @ApiProperty({ example: 2437 })
    travelId: number;

    @ApiProperty({ type: TravelSummaryDto })
    summary: TravelSummaryDto;
}