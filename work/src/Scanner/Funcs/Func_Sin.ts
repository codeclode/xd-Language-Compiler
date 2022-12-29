import Func from "../Func";

export default class Func_Sin implements Func {
  calculate(num: number): number {
    return Math.sin(num);
  }
}
