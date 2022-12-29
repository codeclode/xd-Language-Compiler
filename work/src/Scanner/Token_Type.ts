enum Token_Type {
  ORIGIN, //1设置绘画原点
  SCALE, //2缩放
  ROT, //3旋转
  IS, //类似=
  TO, //5 和for、from、step配合
  STEP, //6 步长
  DRAW, //7 绘画命令
  FOR, //8
  FROM, //保留字9
  T, //参数10
  SEMICO, //11;分号
  L_BRACKET, //12(
  R_BRACKET, //13)
  COMMA, //分隔符14,逗号
  PLUS, //15+
  MINUS, //16-
  MUL, //17*
  DIV, //18/
  POWER, //运算符19**乘方
  FUNC, //函数(调用)20
  CONST_ID, //常数21
  NONTOKEN, //空记号(源程序结束)22
  ERRTOKEN, //出错记号(非法输入)23
  COLOR, //24
  RED, //25画图颜色
  BLACK, //26
  BLUE,
}

export { Token_Type };
