import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('refe_referencia')
export class ReferenceEntity {
    @PrimaryGeneratedColumn({ name: 'refe_codigo' })
    id: number;

    @Column({ name: 'refe_descricao' })
    description: string;

    @Column({ name: 'refe_latitude', type: 'numeric' })
    latitude: number;

    @Column({ name: 'refe_longitude', type: 'numeric' })
    longitude: number;

    @Column({ name: 'refe_cref_codigo', default: 25 })
    typeCode: number;

    @Column({ name: 'refe_utilizado_sistema', default: 'S' })
    systemUsed: string;

    @Column({ name: 'refe_raio', type: 'numeric' })
    radius: number;

    @Column({ name: 'refe_logradouro_descricao', nullable: true })
    address: string;

    @Column({ name: 'refe_logradouro_numero', nullable: true })
    number: string;

    @Column({ name: 'refe_bairro', nullable: true })
    neighborhood: string;

    @Column({ name: 'refe_cidade', nullable: true })
    city: string;

    @Column({ name: 'refe_estado', nullable: true })
    state: string;

    @Column({ name: 'refe_cep', nullable: true })
    zipCode: string;
}