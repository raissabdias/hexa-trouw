import { Location } from '../../../domain/models/location.model';
import { LocationEntity } from '../entities/location.entity';

export class LocationMapper {
    // Maps persistence entity data into the domain model
    static toDomain(entity: LocationEntity): Location {
        return new Location(
            entity.id,
            entity.personId,
            entity.referenceId,
            entity.radius,
            // Legacy schema stores active state as 'S'/'N'.
            entity.active === 'S',
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