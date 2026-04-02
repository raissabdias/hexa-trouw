import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RegionEntity } from './infrastructure/persistence/entities/region.entity';
import { RegionController } from './infrastructure/controllers/region.controller';
import { CreateRegionUseCase } from './application/use-cases/create-region.use-case';
import { TypeOrmRegionRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-region-repository.adapter';

@Module({
    imports: [
        TypeOrmModule.forFeature([RegionEntity]),
        ConfigModule,
    ],
    controllers: [RegionController],
    providers: [
        CreateRegionUseCase,
        {
            provide: 'RegionRepositoryPort',
            useClass: TypeOrmRegionRepositoryAdapter,
        },
    ],
    exports: [CreateRegionUseCase],
})
export class RegionsModule { }