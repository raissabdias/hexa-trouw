import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { TypeOrmUserRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-user-repository.adapter';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { 
                    expiresIn: (configService.get<string>('JWT_EXPIRATION') || '24h') as any,
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        JwtStrategy,
        {
            provide: 'UserRepositoryPort',
            useClass: TypeOrmUserRepositoryAdapter,
        },
    ],
    exports: ['UserRepositoryPort'],
})
export class AuthModule {}