import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
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

    async findById(id: number, companyId: number): Promise<Invoice | null> {
        const entity = await this.repository.findOne({ 
            where: { id, companyId, active: 'S' },
            relations: ['status']
        });
        return entity ? InvoiceMapper.toDomain(entity) : null;
    }

    async findByNumber(number: string, companyId: number): Promise<Invoice | null> {
        const entity = await this.repository.findOne({
            where: { number, companyId, active: 'S' },
            relations: ['status']
        });
        return entity ? InvoiceMapper.toDomain(entity) : null;
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        companyId?: number
    ): Promise<{ data: Invoice[], total: number }> {
        const skip = (page - 1) * limit;

        let whereCondition: any = { 
            companyId: companyId, 
            active: 'S'
        };

        if (search) {
            whereCondition = {
                number: ILike(`%${search}%`),
                companyId: companyId, 
                active: 'S'
            };
        }

        const [entities, total] = await this.repository.findAndCount({
            where: whereCondition,
            relations: ['status'],
            skip: skip,
            take: limit,
            order: { id: 'DESC' }
        });

        const invoices = entities.map(entity => InvoiceMapper.toDomain(entity));

        return {
            data: invoices,
            total: total
        };
    }
}