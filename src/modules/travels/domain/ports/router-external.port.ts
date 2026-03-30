export interface RouterInvoiceInput {
    invoiceId: number;
    invoiceNumber: string;
    lat: string;
    lng: string;
    weight: number;
    volume: number;
    recipientPersonId: number;
}

export interface RouterResponse {
    sequence: {
        invoiceId: number;
        order: number;
        estimatedArrival: Date;
    }[];
    rawResponse: any;
}

export interface RouterExternalPort {
    /**
     * Calculates the optimal route for a travel based on the origin and a list of invoices
     * @param origin - The starting point of the travel, with latitude and longitude
     * @param invoices - A list of invoices that need to be included in the route, with their respective details
     * @param startDate - The scheduled date and time for the start of the travel, in ISO format
     * @param companyId - The ID of the company to which the travel belongs, used for any necessary context in the routing service
     * @returns A promise that resolves to a RouterResponse containing the routing information returned by the external service
     */
    calculateRoute(
        origin: { lat: string; lng: string },
        invoices: RouterInvoiceInput[],
        startDate: string,
        companyId: number
    ): Promise<RouterResponse>;
}