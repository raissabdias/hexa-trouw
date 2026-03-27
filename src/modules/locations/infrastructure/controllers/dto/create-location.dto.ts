import { ApiProperty } from '@nestjs/swagger';

class PersonLocationDto {
    @ApiProperty({ description: 'Person name', example: 'JOAO SILVA' })
    name: string;

    @ApiProperty({ description: 'CNPJ (numbers only)', example: '12345678000199', required: false })
    cnpj?: string;

    @ApiProperty({ description: 'CPF (numbers only)', example: '12345678901', required: false })
    cpf?: string;
}

class AddressLocationDto {
    @ApiProperty({ description: 'Custom description', example: 'CENTRAL OFFICE', required: false })
    description?: string;

    @ApiProperty({ description: 'Latitude', example: -23.550520 })
    latitude: number;

    @ApiProperty({ description: 'Longitude', example: -46.633308 })
    longitude: number;

    @ApiProperty({ description: 'Street name', example: 'Avenida Paulista' })
    street: string;

    @ApiProperty({ description: 'Number', example: '1000', required: false })
    number?: string;

    @ApiProperty({ description: 'Neighborhood', example: 'Bela Vista', required: false })
    neighborhood?: string;

    @ApiProperty({ description: 'City', example: 'São Paulo' })
    city: string;

    @ApiProperty({ description: 'State (UF)', example: 'SP' })
    state: string;

    @ApiProperty({ description: 'ZIP code (numbers only)', example: '01310100', required: false })
    zipCode?: string;
}

class LocalConfigDto {
    @ApiProperty({ description: 'Radius in meters', example: 500 })
    radius: number;
}

export class CreateLocationDto {
    @ApiProperty({ type: PersonLocationDto })
    person: PersonLocationDto;

    @ApiProperty({ type: AddressLocationDto })
    address: AddressLocationDto;

    @ApiProperty({ type: LocalConfigDto })
    local: LocalConfigDto;
}