import { ApiProperty } from '@nestjs/swagger';

class LoginDataDto {
    @ApiProperty({ example: 12595, description: 'User unique ID (personId)' })
    userId: number;

    @ApiProperty({ example: 'JOHNDOE', description: 'User login name' })
    login: string;
    
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
    accessToken: string;
}

export class LoginResponseDto {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: 'Login successful' })
    message: string;

    @ApiProperty({ type: LoginDataDto })
    data: LoginDataDto;
}