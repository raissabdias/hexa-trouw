import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'admin', description: 'User login' })
    login: string;

    @ApiProperty({ example: '123456', description: 'Plain text password' })
    password: string;
}