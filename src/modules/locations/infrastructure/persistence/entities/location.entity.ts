import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PersonEntity } from '../../../../persons/infrastructure/persistence/entities/person.entity';
import { ReferenceEntity } from './reference.entity';

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

    @ManyToOne(() => PersonEntity)
    @JoinColumn({ name: 'lcal_pess_oras_codigo' })
    person: PersonEntity;

    @ManyToOne(() => ReferenceEntity)
    @JoinColumn({ name: 'lcal_refe_codigo' })
    reference: ReferenceEntity;
}