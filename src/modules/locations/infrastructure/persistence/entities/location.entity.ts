import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('lcal_local')
export class LocationEntity {
    @PrimaryColumn({ name: 'lcal_codigo' })
    id: number;

    @Column({ name: 'lcal_pess_oras_codigo' })
    personId: number;

    @Column({ name: 'lcal_refe_codigo' })
    referenceId: number;

    @Column({ name: 'lcal_raio' })
    radius: number;

    @Column({ name: 'lcal_ativo', default: 'S' })
    active: string;
}