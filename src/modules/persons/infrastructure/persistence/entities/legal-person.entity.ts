import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('pjur_pessoa_juridica')
export class LegalPersonEntity {
    @PrimaryColumn({ name: 'pjur_pess_oras_codigo' })
    id: number;

    @Column({ name: 'pjur_cnpj' })
    cnpj: string;

    @Column({ name: 'pjur_razao_social' })
    companyName: string;
}