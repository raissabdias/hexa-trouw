import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../../../../../common/dto/api-response.dto';

export class InvoiceResponseDto {
    @ApiProperty({ example: 1, description: 'ID' })
    id: number;

    @ApiProperty({ example: '100101', description: 'Number' })
    number: string;

    @ApiProperty({ example: 'A', description: 'Series', nullable: true })
    series: string | null;

    @ApiProperty({ example: 1500.50, description: 'Total value of the invoice', nullable: true })
    value: number | null;

    @ApiProperty({ example: 10.5, description: 'Gross weight', nullable: true })
    weight: number | null;

    @ApiProperty({ example: 0.5, description: 'Volume', nullable: true })
    volume: number | null;

    @ApiProperty({ example: 55, description: 'Recipient ID' })
    recipientId: number;

    @ApiProperty({ example: 1, description: 'Company ID' })
    companyId: number;

    @ApiProperty({ example: 1, description: 'Current status code' })
    statusId: number;

    @ApiProperty({ example: 'Autorizada', description: 'Current status description', required: false })
    statusDescription?: string;

    @ApiProperty({ example: true, description: 'Indicates if the record is active' })
    isActive: boolean;

    @ApiProperty({ example: '2023-10-27T10:00:00Z', description: 'Issue date', nullable: true })
    issuedAt: Date | null;

    @ApiProperty({ example: '2023-11-01T18:00:00Z', description: 'Scheduled delivery date', nullable: true })
    scheduledDelivery: Date | null;

    @ApiProperty({ example: '2023-10-27T08:00:00Z', description: 'Creation date in the system' })
    createdAt: Date;

    @ApiProperty({ example: '2023-10-27T09:00:00Z', description: 'Last update date' })
    updatedAt: Date;

    recipient?: {
        name: string;
        address: {
            address: string;
            number: string;
            neighborhood: string;
            zipCode: string;
            city: string;
            state: string;
            latitude: number | null;
            longitude: number | null;
        }
    };
}

export class InvoiceListResponseDto extends ApiResponseDto<InvoiceResponseDto[]> {
    @ApiProperty({ type: [InvoiceResponseDto] })
    declare data: InvoiceResponseDto[];

    @ApiProperty()
    declare meta: { total: number };
}

export class InvoiceSingleResponseDto extends ApiResponseDto<InvoiceResponseDto> {
    @ApiProperty({ type: InvoiceResponseDto })
    declare data: InvoiceResponseDto;
}