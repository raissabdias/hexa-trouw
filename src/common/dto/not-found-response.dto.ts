import { ApiProperty } from '@nestjs/swagger';

export class NotFoundResponseDto {
    @ApiProperty({ example: false })
    success: boolean;

    @ApiProperty({ example: 404 })
    statusCode: number;

    @ApiProperty({ example: '2026-03-31T12:49:23.335Z' })
    timestamp: string;

    @ApiProperty({ example: '/travels' })
    path: string;

    @ApiProperty({ example: 'Invoice 2521198 not found.' })
    message: string;

    @ApiProperty({ example: 'NotFoundException' })
    error: string;
}