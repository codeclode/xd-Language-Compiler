import Func from "../Func";

export default class Func_Tan implements Func {
  calculate(num: number): number {
    return Math.tan(num);
  }
}
