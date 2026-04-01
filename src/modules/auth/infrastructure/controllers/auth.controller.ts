import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from '../../../../common/decorators/is-public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly loginUseCase: LoginUseCase) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Authenticate user with login and MD5 password' })
    @ApiOkResponse({ 
        description: 'User authenticated successfully',
        type: LoginResponseDto 
    })
    @ApiUnauthorizedResponse({ 
        description: 'Invalid credentials',
        schema: {
            example: {
                success: false,
                statusCode: 401,
                message: 'Invalid credentials',
                error: 'Unauthorized'
            }
        }
    })
    async login(@Body() body: LoginDto) {
        return await this.loginUseCase.execute(body.login, body.password);
    }
}