import { Invoice } from '../models/invoice.model';

// Defines the persistence operations required by the domain layer for invoices.
export interface InvoiceRepositoryPort {
    // Persists and returns the resulting aggregate state.
    save(invoice: Invoice): Promise<Invoice>;

    findById(id: number): Promise<Invoice | null>;

    // Find by unique invoice number within a company context.
    findByNumber(number: string, companyId: number): Promise<Invoice | null>;

    // Supports pagination and optional search for invoices.
    findAll(
        page: number,
        limit: number,
        search?: string
    ): Promise<{ data: Invoice[], total: number }>;
}