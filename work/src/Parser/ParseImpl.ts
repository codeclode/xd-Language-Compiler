import Func from "../Scanner/Func";
import Scanner from "../Scanner/Scanner";
import Token from "../Scanner/Token";
import { Token_Type } from "../Scanner/Token_Type";
import Token_Table from "../Scanner/Token_Table";
import ParserInterfaces from "./ParserInterfaces";
import TreeNode from "./treeNode";
import CaseParmPtr from "./CaseParmPtr";

export default class ParserImp implements ParserInterfaces {
  public parameter: CaseParmPtr = new CaseParmPtr(0.0); //参数T默认值为0
  public line_color: string = (
    document.getElementById("color") as HTMLInputElement
  ).value;
  token: Token | null = null;
  success: boolean = true;
  public start_ptr: TreeNode = new TreeNode(); //for语句中的5个Expression
  public end_ptr: TreeNode = new TreeNode();
  public step_ptr: TreeNode = new TreeNode();
  public x_ptr: TreeNode = new TreeNode();
  public y_ptr: TreeNode = new TreeNode();
  public angle_ptr: TreeNode = new TreeNode();

  scanner: Scanner | null = null;
  constructor() {
    this.scanner = new Scanner();
  }

  public Parser(InputString: string): void {
    //程序入口
    this.Enter("parser");
    Scanner.init_scanner(InputString);
    this.FetchToken(); //获取记号
    this.Program();
    this.Exit("parser");
  }

  public FetchToken(): void {
    //获取记号
    this.token = Scanner.getToken();
    if (this.token.tokenType == Token_Type.ERRTOKEN) {
      this.SyntaxError(1); //非法记号
    }
  }

  public MatchToken(token_type: Token_Type | null | undefined): void {
    //匹配终结符
    //比如scale 后面只能跟is，如果不是就报错
    if (this.token!.tokenType != token_type) {
      this.SyntaxError(2); //不是预期记号
    }
    if (
      token_type === Token_Type.SEMICO &&
      this.token!.tokenType != token_type
    ) {
      alert("你忘了加分号了");
      this.success = false;
    }
    this.FetchToken();
  }

  public SyntaxError(case_value: Number): void {
    //打印错误信息
    switch (case_value) {
      case 1:
        console.error(
          "Line: " +
            Scanner.line_num +
            " " +
            "非法记号" +
            " " +
            this.token?.lexme
        ); //Scanner.line_num，用于记录出错的行数
        break;
      case 2:
        console.error(
          "Line: " +
            Scanner.line_num +
            " " +
            this.token?.lexme +
            " " +
            "不是预期记号"
        );
        break;
    }
  }

  public PrintSyntaxTree(root: TreeNode, height: number): void {
    //打印语法树，浏览器效果不佳😡
    for (let a = 1; a <= height; a++) {
      console.table("-");
    }
    switch (root.OpCode) {
      case Token_Type.PLUS:
        console.log("+");
        break;
      case Token_Type.MINUS:
        console.log("-");
        break;
      case Token_Type.MUL:
        console.log("*");
        break;
      case Token_Type.DIV:
        console.log("/");
        break;
      case Token_Type.POWER:
        console.log("**");
        break;
      case Token_Type.FUNC:
        console.log("func");
        //            	console.log(root.case_func.func);
        break;
      case Token_Type.CONST_ID:
        console.log(root.case_const);
        break;
      case Token_Type.T:
        console.log("T");
        break;
      default:
        console.log("非法节点");
    }

    if (root.OpCode == Token_Type.CONST_ID || root.OpCode == Token_Type.T) {
      return;
    }

    if (root.OpCode == Token_Type.FUNC) {
      this.PrintSyntaxTree(root.case_func.child!, height + 1);
    } else {
      this.PrintSyntaxTree(root.case_operator.left!, height + 1);
      this.PrintSyntaxTree(root.case_operator.right!, height + 1);
    }

    return;
  }

  /**
   * 进入递归下降分析
   */

  public Program(): void {
    this.Enter("program");
    while (this.token!.tokenType != Token_Type.NONTOKEN && this.success) {
      this.Statement();
      this.MatchToken(Token_Type.SEMICO); //一条语句结束一定要有分号结尾。。。
    }
    this.Exit("program");
  }

  public Statement(): void {
    this.Enter("statement");
    switch (this.token?.tokenType) {
      //我们只需要看一个语句的第一句就知道要干什么
      //设置颜色--color is xxx
      //设置源点ORIGIN is xxx
      //设置缩放scale is xxx
      //旋转 Rot is xxx
      //循环绘制点 for T from x to xxx step x draw xxx;这个最麻烦
      //你张开那个死人口我就知道你要干什么😄
      //不过这里调的不是这里的函数哦，是SemanticImpl的
      case Token_Type.ORIGIN:
        this.OriginStatement();
        break;
      case Token_Type.SCALE:
        this.ScaleStatement();
        break;
      case Token_Type.ROT:
        this.RotStatement();
        break;
      case Token_Type.FOR:
        this.ForStatement();
        break;
      case Token_Type.COLOR:
        this.ColorStatement();
        break;
      default:
        console.log("不存在该类型语句");
        //			SyntaxError(2);
        break;
    }
    this.Exit("statement");
  }

  public ColorStatement(): void {
    this.Enter("color_statement");
    this.MatchToken(Token_Type.COLOR);
    this.MatchToken(Token_Type.IS);
    this.Colors();
    this.Exit("color_statement");
  }

  public Colors(): void {
    this.Enter("colors");
    console.log("color setter");
    if (this.token?.tokenType == Token_Type.RED) {
      this.line_color = "red";
    } else if (this.token?.tokenType == Token_Type.BLACK) {
      this.line_color = "black";
    } else if (this.token?.tokenType == Token_Type.BLUE) {
      this.line_color = "blue";
    } else {
      this.SyntaxError(2);
    }
    this.MatchToken(this.token!.tokenType);
    this.Exit("color");
  }

  public OriginStatement(): void {
    //匹配origin语句，需要两个参数x，y
    this.Enter("origin_statement");
    this.Match("ORIGIN");
    this.MatchToken(Token_Type.ORIGIN);
    this.Match("IS");
    this.MatchToken(Token_Type.IS);
    this.Match("(");
    this.MatchToken(Token_Type.L_BRACKET);
    this.x_ptr = this.Expression();
    this.Match(",");
    this.MatchToken(Token_Type.COMMA);
    this.y_ptr = this.Expression();
    this.Match(")");
    this.MatchToken(Token_Type.R_BRACKET);
    this.Exit("origin_statement");
  }

  public RotStatement(): void {
    //匹配rot语句，一个参数angle
    this.Enter("rot_statement");
    this.Match("ROT");
    this.MatchToken(Token_Type.ROT);
    this.Match("IS");
    this.MatchToken(Token_Type.IS);
    this.angle_ptr = this.Expression();
    this.Exit("rot_statement");
  }

  public ScaleStatement(): void {
    //匹配scale语句，两个参数x，y
    this.Enter("scale_statement");
    this.Match("SCALE");
    this.MatchToken(Token_Type.SCALE);
    this.Match("IS");
    this.MatchToken(Token_Type.IS);
    this.Match("(");
    this.MatchToken(Token_Type.L_BRACKET);
    this.x_ptr = this.Expression();
    this.Match(",");
    this.MatchToken(Token_Type.COMMA);
    this.y_ptr = this.Expression();
    this.Match(")");
    this.MatchToken(Token_Type.R_BRACKET);
    this.Exit("scale_statement");
  }

  public ForStatement(): void {
    //匹配for语句
    this.Enter("for_statment");
    this.Match("FOR");
    this.MatchToken(Token_Type.FOR);
    this.Match("T");
    this.MatchToken(Token_Type.T);
    this.Match("FROM");
    this.MatchToken(Token_Type.FROM);
    this.start_ptr = this.Expression();
    this.Match("TO");
    this.MatchToken(Token_Type.TO);
    this.end_ptr = this.Expression();
    this.Match("STEP");
    this.MatchToken(Token_Type.STEP);
    this.step_ptr = this.Expression();
    this.Match("DRAW");
    this.MatchToken(Token_Type.DRAW);
    this.Match("(");
    this.MatchToken(Token_Type.L_BRACKET);
    this.x_ptr = this.Expression();
    this.Match(",");
    this.MatchToken(Token_Type.COMMA);
    this.y_ptr = this.Expression();
    this.Match(")");
    this.MatchToken(Token_Type.R_BRACKET);
    this.Exit("for_statement");
  }

  public Expression(): TreeNode {
    //最麻烦的地方，不仅要求常数的输入，要求可以实现计算值
    //匹配expression,Expression 	→ Term   { ( PLUS | MINUS ) Term }加减
    let left: TreeNode;
    let right: TreeNode;
    let token_type: Token_Type;
    //左值、右值、操作

    this.Enter("expression");
    left = this.Term();
    while (
      this.token?.tokenType == Token_Type.PLUS ||
      this.token?.tokenType == Token_Type.MINUS
    ) {
      token_type = this.token?.tokenType;
      this.MatchToken(token_type);
      right = this.Term();
      left = this.MakeTreeNode1(token_type, left, right);
    }
    this.PrintSyntaxTree(left, 1);
    this.Exit("expression");
    return left;
  }

  public Term(): TreeNode {
    //匹配term,Term       	→ Factor { ( MUL  | DIV ) Factor }乘除
    let left: TreeNode;
    let right: TreeNode;
    let token_type: Token_Type;

    left = this.Factor();
    while (
      this.token?.tokenType == Token_Type.MUL ||
      this.token?.tokenType == Token_Type.DIV
    ) {
      token_type = this.token?.tokenType;
      this.MatchToken(token_type);
      right = this.Factor();
      left = this.MakeTreeNode1(token_type, left, right);
    }
    return left;
  }

  public Factor(): TreeNode {
    //Factor  	→ ( PLUS | MINUS ) Factor | Component  这里的加减是正负号（一元正负）
    let left: TreeNode;
    let right: TreeNode;

    if (this.token?.tokenType == Token_Type.PLUS) {
      this.MatchToken(Token_Type.PLUS); //只要是加号我就一直递归匹配
      right = this.Factor();
    } else if (this.token?.tokenType == Token_Type.MINUS) {
      this.MatchToken(Token_Type.MINUS); //取负操作，左值是0
      right = this.Factor();
      left = new TreeNode();
      left.OpCode = Token_Type.CONST_ID;
      left.case_const = 0;
      right = this.MakeTreeNode1(Token_Type.MINUS, left, right);
    } else {
      right = this.Component(); //终于匹配到数字辣😊
    }
    return right;
  }

  public Component(): TreeNode {
    //Component 	→ Atom [ POWER Component ]（乘方）
    let left: TreeNode;
    let right: TreeNode;

    left = this.Atom(); //搞到一个原子操作
    if (this.token?.tokenType == Token_Type.POWER) {
      //出现乘方
      this.MatchToken(Token_Type.POWER);
      right = this.Component(); // 递归调用component以实现POWER的右结合性质,还得读一个数来获得是几次方
      left = this.MakeTreeNode1(Token_Type.POWER, left, right);
    }
    return left;
  }

  public Atom(): TreeNode {
    let t: null | Token = this.token;
    let t_ptr: TreeNode = new TreeNode();
    let tmp: TreeNode = new TreeNode();

    switch (this.token?.tokenType) {
      case Token_Type.CONST_ID: //常数，好好好🤭
        this.MatchToken(Token_Type.CONST_ID); //直接获取常数字符
        t_ptr = this.MakeTreeNode3(
          Token_Type.CONST_ID,
          (t as Token).value as number
        ); //生成一个常数树结点
        break;
      case Token_Type.T: //🤯一个T（变量）
        this.MatchToken(Token_Type.T);
        t_ptr = this.MakeTreeNode3(Token_Type.T, (t as Token).value as number); //生成变量树节点
        break;
      case Token_Type.FUNC:
        this.MatchToken(Token_Type.FUNC);
        this.MatchToken(Token_Type.L_BRACKET);
        tmp = this.Expression(); //往后看一个结点（因为本程序里的Func都只接收一个参数）
        t_ptr = this.MakeTreeNode4(
          Token_Type.FUNC,
          (t as Token).func as Func,
          tmp
        );
        this.MatchToken(Token_Type.R_BRACKET);
        break;
      default:
        this.SyntaxError(2);
        break;
    }
    return t_ptr;
  }

  public MakeTreeNode1(
    token_Type: Token_Type,
    left: TreeNode,
    right: TreeNode
  ): TreeNode {
    //三元数式的
    let t: TreeNode = new TreeNode();
    t.OpCode = token_Type;

    t.case_operator.left = left;
    t.case_operator.right = right;
    return t;
  }

  // public MakeTreeNode2(token_Type: Token_Type): TreeNode {
  //   //
  //   let t: TreeNode = new TreeNode();
  //   t.OpCode = token_Type;
  //   t.case_parmPtr = this.parameter;
  //   return t;
  // }

  public MakeTreeNode3(token_Type: Token_Type, value: number): TreeNode {
    //一个变量或常量树结点
    let t: TreeNode = new TreeNode();
    t.OpCode = token_Type;

    if (token_Type == Token_Type.CONST_ID) {
      t.case_const = value;
    } else {
      t.case_parmPtr = this.parameter;
    }
    return t;
  }

  public MakeTreeNode4(
    //一个带有参数的函数
    token_Type: Token_Type,
    caseParmPtr: Func,
    value: TreeNode
  ): TreeNode {
    let t: TreeNode = new TreeNode();
    t.OpCode = token_Type;

    t.case_func!.func = caseParmPtr;
    t.case_func!.child = value;
    return t;
  }

  public Enter(s: string): void {
    console.log("Enter " + s);
  }

  public Exit(s: string): void {
    console.log("Exit " + s);
  }

  public Match(s: string): void {
    console.log("MatchToken " + s);
  }
}
