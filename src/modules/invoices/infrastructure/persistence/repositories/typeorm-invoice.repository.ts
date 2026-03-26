import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceRepositoryPort } from '../../../domain/ports/invoice-repository.port';
import { Invoice } from '../../../domain/models/invoice.model';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@Injectable()
export class TypeOrmInvoiceRepository implements InvoiceRepositoryPort {
    constructor(
        @InjectRepository(InvoiceEntity)
        private readonly repository: Repository<InvoiceEntity>,
    ) { }

    async save(invoice: Invoice): Promise<Invoice> {
        const entity = InvoiceMapper.toPersistence(invoice);
        const savedEntity = await this.repository.save(entity);
        return InvoiceMapper.toDomain(savedEntity);
    }

    async findById(id: number): Promise<Invoice | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? InvoiceMapper.toDomain(entity) : null;
    }

    async findByNumber(number: string, companyId: number): Promise<Invoice | null> {
        const entity = await this.repository.findOne({
            where: { number, companyId, active: 'S' }
        });
        return entity ? InvoiceMapper.toDomain(entity) : null;
    }
}