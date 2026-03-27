import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Operation successful' })
    message: string;

    data: T;

    @ApiProperty({ required: false })
    meta?: {
        total: number;
    };
}