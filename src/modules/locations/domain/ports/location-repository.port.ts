import { Location } from '../models/location.model';

// Defines the persistence operations required by the domain layer
export interface LocationRepositoryPort {
    // Persists and returns the resulting aggregate state
    save(location: Location): Promise<Location>;

    findById(id: number): Promise<Location | null>;

    findByPersonId(personId: number): Promise<Location | null>; 

    findAll(page: number, limit: number, search?: string, companyId?: number): Promise<{ data: Location[], total: number }>;
}