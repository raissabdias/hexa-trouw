import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
    @ApiProperty({ description: 'Number', example: '123456' })
    number: string;

    @ApiProperty({ description: 'Series', example: '1', required: false })
    series?: string;

    @ApiProperty({ description: 'Total value', example: 1500.50 })
    value: number;

    @ApiProperty({ description: 'Gross weight', example: 10.5 })
    weight: number;

    @ApiProperty({ description: 'Volume', example: 0.125 })
    volume: number;

    @ApiProperty({ description: 'Recipient ID (Person)', example: 55 })
    recipientId: number;

    @ApiProperty({ description: 'Issued date (ISO)', example: '2023-10-27T10:00:00Z', required: false })
    issuedAt?: string;

    @ApiProperty({ description: 'Scheduled delivery (ISO)', example: '2023-11-01T18:00:00Z', required: false })
    scheduledDelivery?: string;
}