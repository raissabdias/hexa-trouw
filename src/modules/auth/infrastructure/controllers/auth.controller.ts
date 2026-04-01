import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate user with login and MD5 password' })
    @ApiOkResponse({ description: 'User authenticated successfully' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    async login(@Body() body: LoginDto) {
        return await this.loginUseCase.execute(body.login, body.password);
    }
}