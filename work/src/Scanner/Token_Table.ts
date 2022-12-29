import Func_Cos from "./Funcs/Func_Cos";
import Func_Exp from "./Funcs/Func_Exp";
import Func_Ln from "./Funcs/Func_Ln";
import Func_Sin from "./Funcs/Func_Sin";
import Func_Sqrt from "./Funcs/Func_Sqrt";
import Func_Tan from "./Funcs/Func_Tan";
import Token from "./Token";
import { Token_Type } from "./Token_Type";

export default class Token_Table {
  //符号+-*/啥的不用写这里，直接在scanner里面硬编码
  static token_table: Array<Token> = [
    new Token(Token_Type.CONST_ID, "PI", 3.1415926535, null),
    new Token(Token_Type.CONST_ID, "E", 2.71828, null),
    new Token(Token_Type.T, "T", 0.0, null),
    new Token(Token_Type.ORIGIN, "ORIGIN", 0.0, null),
    new Token(Token_Type.SCALE, "SCALE", 0.0, null),
    new Token(Token_Type.ROT, "ROT", 0.0, null),
    new Token(Token_Type.IS, "IS", 0.0, null),
    new Token(Token_Type.FOR, "FOR", 0.0, null),
    new Token(Token_Type.FROM, "FROM", 0.0, null),
    new Token(Token_Type.TO, "TO", 0.0, null),
    new Token(Token_Type.STEP, "STEP", 0.0, null),
    new Token(Token_Type.DRAW, "DRAW", 0.0, null),
    new Token(Token_Type.FUNC, "COS", 0.0, new Func_Cos()),
    new Token(Token_Type.FUNC, "SIN", 0.0, new Func_Sin()),
    new Token(Token_Type.FUNC, "LN", 0.0, new Func_Ln()),
    new Token(Token_Type.FUNC, "EXP", 0.0, new Func_Exp()),
    new Token(Token_Type.FUNC, "SQRT", 0.0, new Func_Sqrt()),
    new Token(Token_Type.FUNC, "TAN", 0.0, new Func_Tan()),
    new Token(Token_Type.COLOR, "COLOR", 0.0, null),
    new Token(Token_Type.RED, "RED", 0.0, null),
    new Token(Token_Type.BLACK, "BLACK", 0.0, null),
    new Token(Token_Type.BLUE, "BLUE", 0.0, null),
  ];
}
