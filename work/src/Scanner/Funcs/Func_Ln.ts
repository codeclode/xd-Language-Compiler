import Func from "../Func";

export default class Func_Ln implements Func {
  calculate(num: number): number {
    return Math.log10(num);
  }
}
