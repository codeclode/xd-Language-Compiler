import Func from "../Scanner/Func";
import { Token_Type } from "../Scanner/Token_Type";
import CaseParmPtr from "./CaseParmPtr";

class CaseOperator {
  public left: TreeNode | null = null;
  public right: TreeNode | null = null;
}

class CaseFunc {
  public child: TreeNode | null = null;
  public func: Func | null = null;
}

export default class TreeNode {
  public OpCode: Token_Type | null = null; // 记号(算符)种类
  public case_operator: CaseOperator; //二元运算
  public case_func: CaseFunc; //1个孩子，默认为函数调用
  public case_const: number = 0.0; //常量
  public case_parmPtr: CaseParmPtr = new CaseParmPtr(0); //参数T，默认初始值为0；

  constructor() {
    this.case_operator = new CaseOperator();
    this.case_func = new CaseFunc();
  }
}
