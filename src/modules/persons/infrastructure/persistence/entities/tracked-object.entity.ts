import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('oras_objeto_rastreado')
export class TrackedObjectEntity {
    @PrimaryGeneratedColumn({ name: 'oras_codigo' })
    id: number;

    @Column({ name: 'oras_eobj_codigo', default: '1' })
    statusId: string;

    @Column({ name: 'oras_importado', default: 'N' })
    imported: string;
}