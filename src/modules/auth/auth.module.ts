import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { TypeOrmUserRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-user-repository.adapter';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
    ],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        {
            // Domain port token resolved by the TypeORM adapter implementation.
            provide: 'UserRepositoryPort',
            useClass: TypeOrmUserRepositoryAdapter,
        },
    ],
    exports: ['UserRepositoryPort'],
})
export class AuthModule {}