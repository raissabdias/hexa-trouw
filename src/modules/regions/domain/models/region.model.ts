export class Region {
  constructor(
    public readonly id: number | null,
    public readonly companyId: number,
    public readonly color: string,
    public readonly description: string,
    public readonly ceps: string[],
    public readonly summary: any,
    public readonly isActive: boolean
  ) {}

  // Must have a description and at least one CEP
  isValid(): boolean {
    return this.description.length > 0 && this.ceps.length >= 1;
  }
}