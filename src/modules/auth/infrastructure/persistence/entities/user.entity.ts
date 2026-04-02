import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('usua_usuario')
export class UserEntity {
    @PrimaryColumn({ name: 'usua_pfis_pess_oras_codigo' })
    id: number;

    @Column({ name: 'usua_login', unique: true })
    login: string;

    @Column({ name: 'usua_senha_md5' })
    passwordHash: string;
    
    @Column({ name: 'usua_pess_oras_codigo' })
    companyId: number;
}