import { ApiProperty } from '@nestjs/swagger';

export class CreateRegionDto {
    @ApiProperty({ example: '#FF5733', description: 'Color in hexadecimal' })
    regi_cor: string;

    @ApiProperty({ example: 'Zona Sul - São Paulo', description: 'Name or description of the region' })
    regi_descricao: string;

    @ApiProperty({ example: ['04578000', '04578001'], description: 'List zip codes of the region' })
    ceps: string[];

    @ApiProperty({
        example: { total_clientes: 150, area_km2: 12.5 },
        description: 'Object JSON with the summary of the region'
    })
    resumo: any;
}