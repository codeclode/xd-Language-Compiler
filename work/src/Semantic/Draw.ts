function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export default class Draw {
  public size: number = 0;
  public time: number = 0.0;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.context = (document.getElementById("c") as any).getContext("2d");
    this.setsize(
      parseFloat((document.getElementById("size") as HTMLInputElement).value),
      parseFloat(
        (document.getElementById("delayTime") as HTMLInputElement).value
      )
    );
    this.context.fillStyle = (
      document.getElementById("color") as HTMLInputElement
    ).value;
  }

  public setsize(size: number, time: number): void {
    //设置点的大小以及绘图速度
    this.size = size;
    this.time = time;
  }

  public drawPoint(x: number, y: number): void {
    this.context.beginPath(); // 开启路径
    this.context.arc(x, y, this.size, 0, Math.PI * 2, false);
    this.context.fill();
  }
  public drawPointWith(x: number, y: number, color: string): void {
    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    this.drawPoint(x, y);
  }

  public draw(point: Point, color: string): void {
    this.drawPointWith(point.getX(), point.getY(), color);
  }
}

export class Point {
  public x: number = 0.0;
  public y: number = 0.0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  public getX(): number {
    return this.x;
  }
  public setX(x: number): void {
    this.x = x;
  }
  public getY(): number {
    return this.y;
  }
  public setY(y: number): void {
    this.y = y;
  }
}
