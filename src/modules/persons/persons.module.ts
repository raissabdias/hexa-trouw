import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from './infrastructure/persistence/entities/person.entity';
import { TrackedObjectEntity } from './infrastructure/persistence/entities/tracked-object.entity';
import { PersonsService } from './persons.service';

@Module({
    imports: [TypeOrmModule.forFeature([PersonEntity, TrackedObjectEntity])],
    providers: [PersonsService],
    exports: [PersonsService], // Importante para o LocationsModule enxergar!
})
export class PersonsModule { }