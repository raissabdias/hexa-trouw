import { ApiProperty } from '@nestjs/swagger';

class DeleteTravelDataDto {
    @ApiProperty({ example: 2444, description: 'ID of the removed travel plan' })
    id: number;
}

export class DeleteTravelResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Travel plan removed successfully' })
    message: string;

    @ApiProperty({ type: DeleteTravelDataDto })
    data: DeleteTravelDataDto;
}