import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TravelRepositoryPort } from '../../domain/ports/travel-repository.port';

@Injectable()
export class DeleteTravelUseCase {
    constructor(
        @Inject('TravelRepositoryPort')
        private readonly travelRepo: TravelRepositoryPort,
        private readonly configService: ConfigService,
    ) {}

    async execute(id: number) {
        const companyId = Number(this.configService.get<string>('COMPANY_ID'));
        
        const travel = await this.travelRepo.findById(id, companyId);
        
        if (!travel) {
            throw new NotFoundException(`Travel plan with ID ${id} not found.`);
        }

        await this.travelRepo.update(id, { active: 0 });

        return {
            message: 'Travel plan removed successfully',
            data: { id }
        };
    }
}