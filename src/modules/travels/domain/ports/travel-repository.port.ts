import { TravelEntity } from '../../infrastructure/persistence/entities/travel.entity';

export interface TravelRepositoryPort {
    /**
     * Persists a travel entity to the database
     */
    save(travel: Partial<TravelEntity>): Promise<TravelEntity>;

    /**
     * Retrieves a paginated list of travel entities for a specific company
     * @param page The page number
     * @param limit The number of items per page
     * @param companyId The ID of the company
     */
    findAll(
        page: number,
        limit: number,
        companyId: number
    ): Promise<{ data: TravelEntity[], total: number }>;
}