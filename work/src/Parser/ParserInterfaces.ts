import Func from "../Scanner/Func";
import { Token_Type } from "../Scanner/Token_Type";
import TreeNode from "./treeNode";

export default interface ParserInterfaces {
  /**
   * 分析器所需的辅助子程序，获取终结符
   */
  FetchToken(): void; //获取记号
  MatchToken(token_Type: Token_Type): void; //匹配终结符
  SyntaxError(case_value: Number): void; //出错处理
  PrintSyntaxTree(root: TreeNode, indent: Number): void; //打印语法树

  /**
   * 主要产生式的递归子程序
   */
  Parser(file_name: string): void;
  Program(): void;
  Statement(): void;
  OriginStatement(): void;
  RotStatement(): void;
  ScaleStatement(): void;
  ForStatement(): void;
  ColorStatement(): void;
  Colors(): void;

  /**
   * 为了消除左递归与左因子，所以额外定义了以下几个函数
   */
  Expression(): TreeNode;
  Term(): TreeNode;
  Factor(): TreeNode;
  Component(): TreeNode;
  Atom(): TreeNode;

  /**
   * 构造语法树的节点
   */
  MakeTreeNode1(
    token_Type: Token_Type,
    left: TreeNode,
    right: TreeNode
  ): TreeNode; //二元运算
  // MakeTreeNode2(token_Type: Token_Type): TreeNode; //叶子结点，变量T
  MakeTreeNode3(token_Type: Token_Type, value: number): TreeNode; //叶子结点，常数
  MakeTreeNode4(
    token_Type: Token_Type,
    caseParmPtr: Func,
    value: TreeNode
  ): TreeNode; //函数以及函数地址

  /**
   * 测试用的
   */
  Enter(s: string): void;
  Exit(s: string): void;
  Match(s: string): void;
}
