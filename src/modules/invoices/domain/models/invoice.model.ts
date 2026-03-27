export class Invoice {
    constructor(
        public readonly id: number | null,
        public readonly number: string,
        public readonly series: string | null,
        public readonly value: number | null,
        public readonly weight: number | null,
        public readonly volume: number | null,
        public readonly recipientId: number,
        public readonly companyId: number,
        public readonly statusId: number,
        public readonly isActive: boolean,
        public readonly issuedAt: Date | null,
        public readonly scheduledDelivery: Date | null,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
        public readonly statusDescription?: string,
    ) { }
}