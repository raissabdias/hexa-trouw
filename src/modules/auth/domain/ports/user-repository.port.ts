import { UserEntity } from '../../infrastructure/persistence/entities/user.entity';

// Defines the persistence operation required by the auth domain.
export interface UserRepositoryPort {
    /**
     * Find a user by their login
     * @param login The login of the user to find
     * @returns A promise that resolves to the user entity if found, or null if not found
     */
    findByLogin(login: string): Promise<UserEntity | null>;
}