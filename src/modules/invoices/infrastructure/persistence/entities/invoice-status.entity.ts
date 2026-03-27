import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('nfst_nota_status')
export class InvoiceStatusEntity {
    @PrimaryColumn({ name: 'nfst_codigo' })
    id: number;

    @Column({ name: 'nfst_descricao' })
    description: string;
}