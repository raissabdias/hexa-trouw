import { Injectable, Inject } from '@nestjs/common';
import { Location } from '../../domain/models/location.model';
import { PersonsService } from '../../../persons/persons.service';
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';

@Injectable()
// Application service responsible for creating a new active location
export class CreateLocationUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
        private readonly personsService: PersonsService,
    ) { }

    async execute(data: {
        personName: string;
        cpf?: string;
        cnpj?: string;
        referenceId: number;
        radius: number
    }): Promise<Location> {
        // Create a new person first
        const newPersonId = await this.personsService.createFullPerson({
            name: data.personName,
            cpf: data.cpf,
            cnpj: data.cnpj
        });

        console.log(`Pessoa criada com sucesso! ID: ${newPersonId}`);

        // New locations start as active by default
        const newLocation = new Location(
            null,
            newPersonId,
            data.referenceId,
            data.radius,
            true, // lcal_ativo = 'S'
        );

        // Enforce domain invariant before persisting
        if (!newLocation.isValidRadius()) {
            throw new Error('O raio do local deve ser positivo');
        }

        return await this.locationRepo.save(newLocation);
    }
}