import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeOrmUserRepositoryAdapter implements UserRepositoryPort {
    constructor(
        @InjectRepository(UserEntity)
        private readonly repository: Repository<UserEntity>,
    ) {}

    async findByLogin(login: string): Promise<UserEntity | null> {
        // Login is unique, so this query returns at most one user.
        return await this.repository.createQueryBuilder('user')
            .where('LOWER(user.login) = LOWER(:login)', { login })
            .getOne();
    }
}