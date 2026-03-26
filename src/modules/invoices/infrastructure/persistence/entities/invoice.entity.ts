import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('nota_nota')
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

    @Column({ name: 'nota_ativo', default: 'S' })
    active: string;

    @Column({ name: 'nota_data_emissao', type: 'timestamp', nullable: true })
    issuedAt: Date;

    @Column({ name: 'nota_entrega_agendada', type: 'timestamp', nullable: true })
    scheduledDelivery: Date;

    @CreateDateColumn({ name: 'nota_data_cadastro' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'nota_data_alteracao' })
    updatedAt: Date;
}