import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListInvoicesQueryDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    page?: string;

    @ApiPropertyOptional({ example: 10, default: 10 })
    limit?: string;

    @ApiPropertyOptional()
    search?: string;

    @ApiPropertyOptional({ 
        description: 'Return only available invoices. Set to "true" to filter only available invoices',
        example: 'false',
        default: 'false'
    })
    availableOnly?: string;
}