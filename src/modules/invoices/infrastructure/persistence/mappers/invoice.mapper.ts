import { zip } from 'rxjs';
import { Invoice } from '../../../domain/models/invoice.model';
import { InvoiceEntity } from '../entities/invoice.entity';

export class InvoiceMapper {
    // Maps persistence entity data into the domain model.
    static toDomain(entity: InvoiceEntity): Invoice {
        const recipient = entity.location ? {
            name: entity.location.person?.name,
            address: {
                address: entity.location.reference?.address,
                number: entity.location.reference?.number,
                neighborhood: entity.location.reference?.neighborhood,
                zipCode: entity.location.reference?.zipCode,
                city: entity.location.reference?.city,
                state: entity.location.reference?.state,
                latitude: entity.location.reference?.latitude,
                longitude: entity.location.reference?.longitude,
            },
        } : undefined;

        return new Invoice(
            entity.id,
            entity.number,
            entity.series,
            entity.value ? Number(entity.value) : null,
            entity.weight ? Number(entity.weight) : null,
            entity.volume ? Number(entity.volume) : null,
            entity.recipientId,
            entity.companyId,
            entity.statusId,
            entity.active === 'S',
            entity.issuedAt,
            entity.scheduledDelivery,
            entity.createdAt,
            entity.updatedAt,
            entity.status?.description,
            recipient,
        );
    }

    // Maps domain model into persistence format expected by the database.
    static toPersistence(domain: Invoice): InvoiceEntity {
        const entity = new InvoiceEntity();

        if (domain.id) {
            entity.id = domain.id;
        }

        entity.number = domain.number;
        entity.series = domain.series as any;
        entity.value = domain.value as any;
        entity.weight = domain.weight as any;
        entity.volume = domain.volume as any;

        entity.recipientId = domain.recipientId;
        entity.companyId = domain.companyId;
        entity.statusId = domain.statusId; entity.status?.description,
            // Keep compatibility with existing CHAR flag convention.
            entity.active = domain.isActive ? 'S' : 'N';

        entity.issuedAt = domain.issuedAt as any;
        entity.scheduledDelivery = domain.scheduledDelivery as any;

        return entity;
    }
}