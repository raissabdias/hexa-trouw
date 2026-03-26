export class Location {
    // Domain model remains persistence-agnostic
    constructor(
        public readonly id: number | null,
        public readonly personId: number,
        public readonly referenceId: number,
        public readonly radius: number,
        public readonly isActive: boolean,
        public readonly person?: any,
        public readonly reference?: any,
    ) { }

    // Radius must be non-negative to represent a valid geofence boundary
    public isValidRadius(): boolean {
        return this.radius >= 0;
    }
}