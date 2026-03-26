import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PersonEntity } from './infrastructure/persistence/entities/person.entity';
import { TrackedObjectEntity } from './infrastructure/persistence/entities/tracked-object.entity';

@Injectable()
export class PersonsService {
    constructor(private dataSource: DataSource) { }

    async createPerson(name: string): Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const trackedObj = queryRunner.manager.create(TrackedObjectEntity);
            const savedObj = await queryRunner.manager.save(trackedObj);

            const person = queryRunner.manager.create(PersonEntity, {
                id: savedObj.id,
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
}