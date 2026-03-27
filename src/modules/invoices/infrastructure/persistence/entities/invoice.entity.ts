import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { InvoiceStatusEntity } from './invoice-status.entity';
import { LocationEntity } from '../../../../locations/infrastructure/persistence/entities/location.entity';

@Entity('nota_nota_fiscal')
export class InvoiceEntity {
    @PrimaryGeneratedColumn({ name: 'nota_codigo' })
    id: number;

    @Column({ name: 'nota_numero' })
    number: string;

    @Column({ name: 'nota_serie', nullable: true })
    series: string;

    @Column({ name: 'nota_valor', type: 'decimal', precision: 15, scale: 2, nullable: true })
    value: number;

    @Column({ name: 'nota_peso', type: 'decimal', precision: 15, scale: 3, nullable: true })
    weight: number;

    @Column({ name: 'nota_cubagem', type: 'decimal', precision: 15, scale: 4, nullable: true })
    volume: number;

    @Column({ name: 'nota_destinatario_pess_oras_codigo' })
    recipientId: number;

    @Column({ name: 'nota_pess_oras_codigo' })
    companyId: number;

    @Column({ name: 'nota_nfst_codigo', default: 1 })
    statusId: number;

    @ManyToOne(() => InvoiceStatusEntity)
    @JoinColumn({ name: 'nota_nfst_codigo' })
    status: InvoiceStatusEntity;

    @Column({ name: 'nota_ativo', default: 'S' })
    active: string;

    @Column({ name: 'nota_data_emissao', type: 'timestamp', nullable: true })
    issuedAt: Date;

    @Column({ name: 'nota_entrega_agendada', type: 'timestamp', nullable: true })
    scheduledDelivery: Date;

    @CreateDateColumn({ name: 'nota_data_cadastro' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'nota_data_atualizacao' })
    updatedAt: Date;

    @OneToOne(() => LocationEntity)
    @JoinColumn({ name: 'nota_destinatario_pess_oras_codigo', referencedColumnName: 'personId' })
    location: LocationEntity;
}