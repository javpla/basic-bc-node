export class Transaction {
  constructor(private readonly _from: string, private readonly _to: string, private readonly _amount: number) { }

  public get from(): string {
    return this._from;
  }
  public get to(): string {
    return this._to;
  }
  public get amount(): number {
    return this._amount;
  }
}