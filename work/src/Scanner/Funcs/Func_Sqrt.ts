import Func from "../Func";

export default class Func_Sqrt implements Func {
  calculate(num: number): number {
    return Math.sqrt(num);
  }
}
