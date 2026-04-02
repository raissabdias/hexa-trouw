import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepo: UserRepositoryPort,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Authenticates a user by their login and password
     * @param login The login of the user
     * @param password The user's password in plain text
     */
    async execute(login: string, password: string) {
        const user = await this.userRepo.findByLogin(login);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const staticSalt = this.configService.get<string>('AUTH_STATIC_SALT');
        if (!staticSalt) {
            throw new Error('Auth salt is not defined in environment variables');
        }

        const credentialsToHash = `${staticSalt}${user.login}${password}`;
        const inputPasswordHash = createHash('sha1')
            .update(credentialsToHash)
            .digest('hex');

        if (inputPasswordHash !== user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { 
            sub: user.id, 
            username: user.login 
        };

        return {
            message: 'Login successful',
            data: {
                userId: user.id,
                login: user.login,
                accessToken: this.jwtService.sign(payload) 
            }
        };
    }
}