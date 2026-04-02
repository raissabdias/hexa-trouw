import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { InvoiceRepositoryPort } from '../../../domain/ports/invoice-repository.port';
import { Invoice } from '../../../domain/models/invoice.model';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@Injectable()
export class TypeOrmInvoiceRepositoryAdapter implements InvoiceRepositoryPort {
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
            relations: ['status', 'location', 'location.person', 'location.reference']
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
        companyId?: number,
        availableOnly: boolean = false
    ): Promise<{ data: Invoice[], total: number }> {
        const query = this.repository.createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.status', 'status')
            .leftJoinAndSelect('invoice.location', 'location')
            .leftJoinAndSelect('location.person', 'person')
            .leftJoinAndSelect('location.reference', 'reference')
            .where('invoice.companyId = :companyId', { companyId })
            .andWhere('invoice.active = :active', { active: 'S' });

        if (search) {
            query.andWhere(
                '(invoice.number ILIKE :search OR person.pess_nome ILIKE :search OR reference.refe_cidade ILIKE :search OR reference.refe_estado ILIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Filter available invoices by checking for the absence of related active travel records
        if (availableOnly) {
            query.andWhere((qb) => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from('tb_planejamento_rotas', 'travel')
                    .where('travel.id_pessoa_juridica = :companyId', { companyId })
                    .andWhere('travel.ativo = 1')
                    .andWhere(`travel.notas_fiscais @> CAST(invoice.nota_codigo AS TEXT)::jsonb`)
                    .getQuery();
                return `NOT EXISTS ${subQuery}`;
            });
        }

        const [entities, total] = await query
            .orderBy('invoice.id', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: entities.map(entity => InvoiceMapper.toDomain(entity)),
            total
        };
    }
}
