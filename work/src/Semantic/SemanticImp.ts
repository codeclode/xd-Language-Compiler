import Draw from "./Draw";
import { Point } from "./Draw";
import parseImpl from "../Parser/ParseImpl";
import TreeNode from "../Parser/treeNode";
import Func from "../Scanner/Func";
import { Token_Type } from "../Scanner/Token_Type";

//延迟调用功能
function sleep(time: number) {
  return new Promise((reject) => {
    setTimeout(reject, 1000);
  });
}

export default class SemanticImp extends parseImpl {
  //语义;为什么要集成parse？其实就是方便共享输入字符串，反正就5条语句格式还这么死
  //F，而且解释器本来就是读一条干一条，直接super.xxx()然后开始画图
  public Oringin_x: number;
  public Oringin_y: number;
  public Scale_x: number;
  public Scale_y: number;
  public rot_angle: number;
  public draw: Draw;

  constructor(draw: Draw) {
    super();
    this.Oringin_x = 0;
    this.Oringin_y = 0;
    this.Scale_x = 1;
    this.Scale_y = 1;
    this.rot_angle = 0;
    this.draw = draw;
  }

  public GetTreeValue(root: TreeNode): number {
    //获取语法树上的值
    if (root == null) {
      return 0.0;
    }
    switch (root.OpCode) {
      //语法分析的时候已经生成语法树，现在只需要获取值
      case Token_Type.PLUS:
        return (
          this.GetTreeValue(root.case_operator.left as TreeNode) +
          this.GetTreeValue(root.case_operator.right as TreeNode)
        );
      case Token_Type.MINUS:
        return (
          this.GetTreeValue(root.case_operator.left as TreeNode) -
          this.GetTreeValue(root.case_operator.right as TreeNode)
        );
      case Token_Type.MUL:
        return (
          this.GetTreeValue(root.case_operator.left as TreeNode) *
          this.GetTreeValue(root.case_operator.right as TreeNode)
        );
      case Token_Type.DIV:
        return (
          this.GetTreeValue(root.case_operator.left as TreeNode) /
          this.GetTreeValue(root.case_operator.right as TreeNode)
        );
      case Token_Type.POWER:
        return Math.pow(
          this.GetTreeValue(root.case_operator.left as TreeNode),
          this.GetTreeValue(root.case_operator.left as TreeNode)
        );
      case Token_Type.FUNC:
        return (root.case_func.func as Func).calculate(
          this.GetTreeValue(root.case_func.child as TreeNode)
        );
      case Token_Type.CONST_ID:
        return root.case_const;
      case Token_Type.T:
        return root.case_parmPtr.getA();
      default:
        return 0.0;
    }
  }

  public CalCoord(hor_ptr: TreeNode, ver_ptr: TreeNode, point: Point): void {
    //计算点的坐标值：首先获取坐标值，然后进行坐标变换语句坐标映射到实际的坐标
    let x_val: number;
    let x_temp: number;
    let y_val: number;

    x_val = this.GetTreeValue(hor_ptr); //计算点的原始坐标
    y_val = this.GetTreeValue(ver_ptr);

    x_val *= this.Scale_x; //比列变换
    y_val *= this.Scale_y;

    x_temp =
      x_val * Math.cos(this.rot_angle) + y_val * Math.sin(this.rot_angle);
    y_val = y_val * Math.cos(this.rot_angle) - x_val * Math.sin(this.rot_angle);
    x_val = x_temp; //旋转变换

    x_val += this.Oringin_x; //平移变换
    y_val += this.Oringin_y;

    point.setX(x_val);
    point.setY(y_val);
  }

  public async DrawLoop(
    start_val: number,
    end_val: number,
    step_val: number,
    x_ptr: TreeNode,
    y_ptr: TreeNode
  ): Promise<void> {
    let x_val: number = 0;
    let y_val: number = 0;
    let point: Point = new Point(x_val, y_val);
    for (
      this.parameter.setA(start_val);
      this.parameter.getA() <= end_val;
      this.parameter.setA(this.parameter.getA() + step_val) //变量😙
    ) {
      this.CalCoord(x_ptr, y_ptr, point);
      // await sleep(this.draw.time);
      this.draw.draw(point, this.line_color);
    }
  }

  public OriginStatement(): void {
    super.OriginStatement();
    this.Oringin_x = this.GetTreeValue(this.x_ptr);
    this.Oringin_y = this.GetTreeValue(this.y_ptr);
  }

  public RotStatement(): void {
    super.RotStatement();
    this.rot_angle = this.GetTreeValue(this.angle_ptr);
  }

  public ScaleStatement(): void {
    super.ScaleStatement();
    this.Scale_x = this.GetTreeValue(this.x_ptr);
    this.Scale_y = this.GetTreeValue(this.y_ptr);
  }

  public ForStatement(): void {
    let start_val = 0;
    let end_val = 0;
    let step_val = 0;
    super.ForStatement();

    start_val = this.GetTreeValue(this.start_ptr);
    end_val = this.GetTreeValue(this.end_ptr);
    step_val = this.GetTreeValue(this.step_ptr);

    this.DrawLoop(start_val, end_val, step_val, this.x_ptr, this.y_ptr);
  }
}
