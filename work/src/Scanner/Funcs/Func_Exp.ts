import Func from "../Func";

export default class Func_Exp implements Func {
  calculate(num: number): number {
    return Math.exp(num);
  }
}
