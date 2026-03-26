import { Location } from '../../../domain/models/location.model';
import { LocationEntity } from '../entities/location.entity';

export class LocationMapper {
    // Maps persistence entity data into the domain model
    static toDomain(entity: LocationEntity): Location {
        const document = entity.person?.physicalPerson?.cpf ||
            entity.person?.legalPerson?.cnpj ||
            null;

        const personData = entity.person ? {
            ...entity.person,
            document: document
        } : undefined;

        return new Location(
            entity.id,
            entity.personId,
            entity.referenceId,
            Number(entity.radius),
            entity.active === 'S',
            personData,
            entity.reference
        );
    }

    // Maps domain model into persistence format expected by the database
    static toPersistence(domain: Location): LocationEntity {
        const entity = new LocationEntity();

        if (domain.id) {
            entity.id = domain.id;
        }

        entity.personId = domain.personId;
        entity.referenceId = domain.referenceId;
        entity.radius = domain.radius;
        // Keep compatibility with existing CHAR flag convention
        entity.active = domain.isActive ? 'S' : 'N';

        return entity;
    }
}