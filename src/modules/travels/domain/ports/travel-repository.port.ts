import { TravelEntity } from '../../infrastructure/persistence/entities/travel.entity';

export interface TravelRepositoryPort {
    /**
     * Persists a travel entity to the database
     */
    save(travel: Partial<TravelEntity>): Promise<TravelEntity>;

    /**
     * Finds a travel entity by its ID and company ID, ensuring it is active
     * @param id 
     * @param companyId 
     */
    findById(id: number, companyId: number): Promise<TravelEntity | null>;

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

    /**
     * Updates an existing travel entity with the provided data
     * @param id The ID of the travel entity to update
     * @param data 
     */
    update(id: number, data: Partial<TravelEntity>): Promise<void>;
}