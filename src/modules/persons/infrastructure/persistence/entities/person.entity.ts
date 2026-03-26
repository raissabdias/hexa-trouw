import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { TrackedObjectEntity } from './tracked-object.entity';
import { LegalPersonEntity } from './legal-person.entity';
import { PhysicalPersonEntity } from './physical-person.entity';

@Entity('pess_pessoa')
export class PersonEntity {
    @PrimaryColumn({ name: 'pess_oras_codigo' })
    id: number;

    @Column({ name: 'pess_nome' })
    name: string;

    @Column({ name: 'pess_numero', nullable: true })
    number: string;

    @Column({ name: 'pess_tipo', default: 'F' })
    type: string;

    @OneToOne(() => TrackedObjectEntity)
    @JoinColumn({ name: 'pess_oras_codigo' })
    trackedObject: TrackedObjectEntity;

    @OneToOne(() => PhysicalPersonEntity, (pf) => pf.id)
    @JoinColumn({ name: 'pess_oras_codigo' })
    physicalPerson: PhysicalPersonEntity;

    @OneToOne(() => LegalPersonEntity, (pj) => pj.id)
    @JoinColumn({ name: 'pess_oras_codigo' })
    legalPerson: LegalPersonEntity;
}