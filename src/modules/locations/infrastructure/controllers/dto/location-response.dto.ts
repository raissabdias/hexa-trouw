import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../../../../../common/dto/api-response.dto';

class PhysicalPersonDto {
    @ApiProperty({ example: 76376 })
    id: number;

    @ApiProperty({ example: '79160675058' })
    cpf: string;
}

class LegalPersonDto {
    @ApiProperty({ example: 76324 })
    id: number;

    @ApiProperty({ example: '12345678000197' })
    cnpj: string;

    @ApiProperty({ example: 'TRANSPORTADORA TREVO 3 LTDA' })
    companyName: string;
}

class PersonDto {
    @ApiProperty({ example: 76324 })
    id: number;

    @ApiProperty({ example: 'TRANSPORTADORA TREVO 3 LTDA' })
    name: string;

    @ApiProperty({ example: null, nullable: true })
    number: string | null;

    @ApiProperty({ example: null, nullable: true })
    type: string | null;

    @ApiProperty({ type: PhysicalPersonDto, nullable: true })
    physicalPerson: PhysicalPersonDto | null;

    @ApiProperty({ type: LegalPersonDto, nullable: true })
    legalPerson: LegalPersonDto | null;

    @ApiProperty({ example: '12345678000197' })
    document: string;
}

class ReferenceDto {
    @ApiProperty({ example: 95109 })
    id: number;

    @ApiProperty({ example: 'TRANSPORTADORA TREVO 3 LTDA' })
    description: string;

    @ApiProperty({ example: '-23.5505000000' })
    latitude: string;

    @ApiProperty({ example: '-46.6333000000' })
    longitude: string;

    @ApiProperty({ example: null, nullable: true })
    typeCode: number | null;

    @ApiProperty({ example: null, nullable: true })
    systemUsed: string | null;

    @ApiProperty({ example: '500.00000' })
    radius: string;

    @ApiProperty({ example: 'Avenida das Nacoes Unidas' })
    address: string;

    @ApiProperty({ example: '12901' })
    number: string;

    @ApiProperty({ example: 'Brooklin Novo' })
    neighborhood: string;

    @ApiProperty({ example: 'São Paulo' })
    city: string;

    @ApiProperty({ example: 'SP' })
    state: string;

    @ApiProperty({ example: '04578000' })
    zipCode: string;
}

export class LocationDto {
    @ApiProperty({ example: 42510 })
    id: number;

    @ApiProperty({ example: 76324 })
    personId: number;

    @ApiProperty({ example: 95109 })
    referenceId: number;

    @ApiProperty({ example: 500 })
    radius: number;

    @ApiProperty({ example: true })
    isActive: boolean;

    @ApiProperty({ type: PersonDto })
    person: PersonDto;

    @ApiProperty({ type: ReferenceDto })
    reference: ReferenceDto;
}

export class LocationListResponseDto extends ApiResponseDto<LocationDto[]> {
    @ApiProperty({ type: [LocationDto] })
    declare data: LocationDto[];

    @ApiProperty({ example: { total: 8 } })
    declare meta: { total: number };
}

export class LocationSingleResponseDto extends ApiResponseDto<LocationDto> {
    @ApiProperty({ type: LocationDto })
    declare data: LocationDto;
}