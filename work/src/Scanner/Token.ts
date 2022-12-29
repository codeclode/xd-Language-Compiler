import Func from "./Func";
import { Token_Type } from "./Token_Type";
export default class Token {
  public tokenType: Token_Type | undefined | null;
  public lexme: String | string | undefined | null;
  public value: number | undefined | null;
  public func: Func | undefined | null;

  constructor(
    tokenType: Token_Type | undefined | null,
    lexme: String | string | undefined | null,
    value: number | undefined | null,
    func: Func | undefined | null
  ) {
    this.func = func;
    this.value = value;
    this.lexme = lexme; //lexeme
    this.tokenType = tokenType;
  }
}
