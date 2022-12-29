export default class CaseParmPtr {
  private num: number = 0.0;

  constructor(a: number) {
    this.num = a;
  }

  public getA(): number {
    return this.num;
  }

  public setA(a: number): void {
    this.num = a;
  }
}
