import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PersonsService } from '../../../persons/persons.service';
import { ReferenceEntity } from '../../infrastructure/persistence/entities/reference.entity';
import { Location } from '../../domain/models/location.model'; // Importe sua Model de Domínio
import type { LocationRepositoryPort } from '../../domain/ports/location-repository.port';

// Interface para organizar a entrada do Postman
interface CreateLocationInput {
    person: {
        name: string;
        cnpj?: string;
        cpf?: string;
    };
    address: {
        description?: string;
        latitude: number;
        longitude: number;
        street: string;
        number?: string;
        neighborhood?: string;
        city: string;
        state: string;
        zipCode?: string;
    };
    local: {
        radius: number;
    };
}

@Injectable()
// Application service for orchestrating the full location registration flow.
export class CreateLocationUseCase {
    constructor(
        @Inject('LocationRepositoryPort')
        private readonly locationRepo: LocationRepositoryPort,
        private readonly personsService: PersonsService,
        private readonly dataSource: DataSource,
    ) { }

    async execute(input: CreateLocationInput) {
        // Create or reuse a person, handling both physical and legal types
        const personId = await this.personsService.createFullPerson({
            name: input.person.name,
            cnpj: input.person.cnpj,
            cpf: input.person.cpf,
        });

        // Register the address as a reference entity
        const reference = await this.createReference(input);

        // Compose the domain model for the new location
        const locationDomain = new Location(
            null,
            personId,
            reference.id,
            input.local.radius,
            true
        );

        // Persist the new location and return a summary
        const savedLocation = await this.locationRepo.save(locationDomain);

        return {
            message: `Registered location successfully - ID ${personId}`,
            personId: personId,
            referenceId: reference.id,
            location: savedLocation
        };
    }

    // Helper to persist a new address reference, using person name as fallback description
    private async createReference(input: CreateLocationInput): Promise<ReferenceEntity> {
        const refRepo = this.dataSource.getRepository(ReferenceEntity);

        const newReference = refRepo.create({
            description: input.address.description || input.person.name.toUpperCase(),
            latitude: input.address.latitude,
            longitude: input.address.longitude,
            radius: input.local.radius,
            address: input.address.street,
            number: input.address.number,
            neighborhood: input.address.neighborhood,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode,
        });

        return await refRepo.save(newReference);
    }
}