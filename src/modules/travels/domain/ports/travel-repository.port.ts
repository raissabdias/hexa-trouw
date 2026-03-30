import { TravelEntity } from '../../infrastructure/persistence/entities/travel.entity';

export interface TravelRepositoryPort {
    /**
     * Persists a travel entity to the database
     */
    save(travel: Partial<TravelEntity>): Promise<TravelEntity>;
}