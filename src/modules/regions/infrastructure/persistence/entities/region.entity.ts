import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('regi_regiao')
export class RegionEntity {
    @PrimaryGeneratedColumn({ name: 'regi_codigo' })
    id: number;

    @Column({ name: 'regi_pess_oras_codigo' })
    companyId: number;

    @Column({ name: 'regi_cor' })
    color: string;

    @Column({ name: 'regi_descricao' })
    description: string;

    @Column({ name: 'regi_ceps', type: 'jsonb', nullable: true })
    ceps: string[];

    @Column({ name: 'regi_resumo', type: 'jsonb', nullable: true })
    summary: any;

    @Column({ name: 'regi_ativo', default: 1 })
    isActive: number;
}