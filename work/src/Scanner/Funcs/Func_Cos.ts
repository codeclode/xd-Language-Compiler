import Func from "../Func";

export default class Func_Cos implements Func {
  calculate(num: number): number {
    return Math.cos(num);
  }
}
