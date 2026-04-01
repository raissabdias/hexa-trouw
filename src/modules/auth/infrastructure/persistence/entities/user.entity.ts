import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usua_usuario')
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'usua_codigo' })
    id: number;

    @Column({ name: 'usua_login', unique: true })
    login: string;

    @Column({ name: 'usua_senha_md5' })
    passwordHash: string;

    @Column({ name: 'usua_pfis_pess_oras_codigo' })
    personId: number;
}