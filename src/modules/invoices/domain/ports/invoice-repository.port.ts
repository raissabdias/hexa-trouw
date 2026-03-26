import { Invoice } from '../models/invoice.model';

export interface InvoiceRepositoryPort {
    save(invoice: Invoice): Promise<Invoice>;

    findById(id: number): Promise<Invoice | null>;
    
    findByNumber(number: string, companyId: number): Promise<Invoice | null>;
}