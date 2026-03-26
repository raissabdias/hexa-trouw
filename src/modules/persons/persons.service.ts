import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { PersonEntity } from './infrastructure/persistence/entities/person.entity';
import { TrackedObjectEntity } from './infrastructure/persistence/entities/tracked-object.entity';
import { AssociationEntity } from './infrastructure/persistence/entities/association.entity';
import { LegalPersonEntity } from './infrastructure/persistence/entities/legal-person.entity';
import { PhysicalPersonEntity } from './infrastructure/persistence/entities/physical-person.entity';

@Injectable()
export class PersonsService {
    constructor(
        private dataSource: DataSource,
        private configService: ConfigService,
    ) { }

    async createPerson(name: string): Promise<number> {
        // A transaction guarantees tracked object and person are created atomically
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const trackedObj = queryRunner.manager.create(TrackedObjectEntity);
            const savedObj = await queryRunner.manager.save(trackedObj);

            const person = queryRunner.manager.create(PersonEntity, {
                id: savedObj.id,
                // Normalize for case-insensitive comparisons in legacy queries
                name: name.toUpperCase(),
            });
            await queryRunner.manager.save(person);

            await queryRunner.commitTransaction();
            return person.id;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async createFullPerson(data: { name: string; cpf?: string; cnpj?: string; companyName?: string }): Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Creates the root tracked object and reuses its id across related records
            const trackedObj = queryRunner.manager.create(TrackedObjectEntity, {
                statusId: '1', // Aqui garantimos o oras_eobj_codigo = 1
                imported: 'N'
            });
            const savedObj = await queryRunner.manager.save(trackedObj);
            const id = savedObj.id;

            const person = queryRunner.manager.create(PersonEntity, {
                id: id,
                // Keep normalized casing aligned with legacy query behavior.
                name: data.name.toUpperCase(),
            });
            await queryRunner.manager.save(person);

            const cleanCpf = data.cpf ? this.clearString(data.cpf) : undefined;
            const cleanCnpj = data.cnpj ? this.clearString(data.cnpj) : undefined;

            // Persist exactly one subtype: physical person (CPF) or legal person (CNPJ)
            if (cleanCpf) {
                await queryRunner.manager.save(PhysicalPersonEntity, { id: id, cpf: cleanCpf });
            } else if (cleanCnpj) {
                await queryRunner.manager.save(LegalPersonEntity, {
                    id: id,
                    cnpj: cleanCnpj,
                    // Fall back to the person name when no company name is provided
                    companyName: data.companyName || data.name,
                });
            }

            // Auto-associate the new person with the configured company scope
            const companyId = this.configService.get<number>('COMPANY_ID');
            await queryRunner.manager.save(AssociationEntity, {
                parentId: companyId,
                childId: id,
                // Domain-specific association type for location context
                type: 'lcal',
                active: 1
            });

            await queryRunner.commitTransaction();
            return id;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    // Utility to strip non-numeric characters for CPF/CNPJ normalization
    private clearString(str: string): string {
        return str.replace(/\D/g, '');
    }

    // Finds a person ID by their CPF or CNPJ, returning null if not found
    async findIdByDocument(doc: { cpf?: string; cnpj?: string }): Promise<number | null> {
        const cleanDoc = doc.cpf ? this.clearString(doc.cpf) : (doc.cnpj ? this.clearString(doc.cnpj) : null);

        if (!cleanDoc) return null;

        if (doc.cpf) {
            const person = await this.dataSource
                .getRepository(PhysicalPersonEntity)
                .findOneBy({ cpf: cleanDoc });
            return person ? person.id : null;
        } else {
            const person = await this.dataSource
                .getRepository(LegalPersonEntity)
                .findOneBy({ cnpj: cleanDoc });
            return person ? person.id : null;
        }
    }
}