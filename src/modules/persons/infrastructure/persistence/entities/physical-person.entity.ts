import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pfis_pessoa_fisica')
export class PhysicalPersonEntity {
    @PrimaryColumn({ name: 'pfis_pess_oras_codigo' })
    id: number;

    @Column({ name: 'pfis_cpf' })
    cpf: string;
}