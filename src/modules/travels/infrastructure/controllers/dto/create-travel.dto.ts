import { ApiProperty } from '@nestjs/swagger';

export class CreateTravelDto {
    @ApiProperty({ 
        example: [251886, 248677], 
        description: 'List of invoice IDs associated with the travel' 
    })
    public readonly invoiceIds: number[];

    @ApiProperty({ 
        example: 42510, 
        description: 'ID of the person who will serve as the starting point' 
    })
    public readonly originPersonId: number;

    @ApiProperty({ 
        example: '2026-04-01T08:00:00Z', 
        description: 'Scheduled date and time for the start of the travel' 
    })
    public readonly startDate: string;
}