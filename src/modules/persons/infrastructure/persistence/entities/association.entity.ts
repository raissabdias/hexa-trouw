import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('asob_associacao_objetos')
export class AssociationEntity {
    @PrimaryGeneratedColumn({ name: 'asob_codigo' })
    id: number;

    @Column({ name: 'asob_oras_codigo_pai' })
    parentId: number;

    @Column({ name: 'asob_oras_codigo_filho' })
    childId: number;

    @Column({ name: 'asob_tipo_objeto_relacionado', default: 'lcal' })
    type: string;

    @Column({ name: 'asob_ativo', default: 1 })
    active: number;
}