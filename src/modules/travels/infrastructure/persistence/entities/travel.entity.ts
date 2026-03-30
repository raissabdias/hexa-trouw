import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tb_planejamento_rotas')
export class TravelEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'id_pessoa_juridica' })
    companyId: number;

    @Column({ name: 'id_regiao', nullable: true })
    regionId: number;

    @Column({ name: 'id_origem' })
    originId: number;

    @Column({ name: 'notas_fiscais', type: 'text' })
    invoiceIdsJson: string; //

    @Column({ name: 'peso_disponivel', type: 'float' })
    weightCapacity: number;

    @Column({ name: 'peso_ocupado', type: 'float' })
    weightUsed: number;

    @Column({ name: 'cubagem_disponivel', type: 'float' })
    volumeCapacity: number;

    @Column({ name: 'cubagem_ocupada', type: 'float' })
    volumeUsed: number;

    @Column({ name: 'data_inicio', type: 'timestamp' })
    startDate: Date;

    @Column({ name: 'data_fim', type: 'timestamp' })
    endDate: Date;

    @Column({ name: 'km_prevista', type: 'float' })
    totalDistance: number;

    @Column({ name: 'detalhe', type: 'text' })
    detailsJson: string;

    @Column({ name: 'pontos_viagem', type: 'text' })
    travelPointsJson: string;

    @Column({ name: 'cor', length: 50 })
    color: string;

    @Column({ name: 'ativo', default: 1 })
    active: number;

    @Column({ name: 'rota_codificada', type: 'text', nullable: true })
    polyline: string;

    @Column({ name: 'api', length: 100, nullable: true })
    apiName: string;

    @Column({ name: 'valor_total', type: 'float', default: 0 })
    totalValue: number; // Soma do valor das NFs

    @CreateDateColumn({ name: 'data_criacao' })
    createdAt: Date;
}