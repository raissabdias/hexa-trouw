import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('UserRepositoryPort')
        private readonly userRepo: UserRepositoryPort,
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

        const inputPasswordHash = createHash('md5')
            .update(password)
            .digest('hex');

        if (inputPasswordHash !== user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            userId: user.id,
            login: user.login,
            personId: user.personId,
            message: 'Login successful'
        };
    }
}