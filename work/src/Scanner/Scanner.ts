import Token from "./Token";
import Token_Table from "./Token_Table";
import { Token_Type } from "./token_Type";

export default class Scanner {
  static InputString: string | undefined | null = null;
  static stringBuffer: string = "";
  static now_pos: number = 0;
  static line_num: number = 0;

  static init_scanner(InputString: string | undefined | null): void {
    if (!InputString) {
      console.error("出错啦！！！出错行数：" + this.line_num);
    } else {
      console.log(InputString);
      this.now_pos = 0;
      this.line_num = 0;
      this.InputString = InputString;
      this.stringBuffer = "";
    }
  }

  static isLetter(read_char_from_string: number): boolean {
    return /[a-zA-Z]/.test(String.fromCharCode(read_char_from_string));
  }
  static isDigit(read_char_from_string: number): boolean {
    return /\d/.test(String.fromCharCode(read_char_from_string));
  }

  static getToken(): Token {
    let token = new Token(null, null, null, null);
    let read_char_from_string: number = -1;
    this.empty_token_buff();
    token.lexme = this.stringBuffer;
    while (true) {
      read_char_from_string = this.get_char();
      if (read_char_from_string === 65535) {
        token.tokenType = Token_Type.NONTOKEN;
        return token;
      }
      if (read_char_from_string === "\n".charCodeAt(0)) {
        this.line_num++;
      }
      if (!/\s/.test(String.fromCharCode(read_char_from_string))) {
        break;
      }
    }
    this.add_char_to_stringbuffer(read_char_from_string);
    if (this.isLetter(read_char_from_string)) {
      while (true) {
        // 最大化最多的字符
        read_char_from_string = this.get_char();
        if (
          this.isDigit(read_char_from_string) ||
          this.isLetter(read_char_from_string)
        ) {
          //
          this.add_char_to_stringbuffer(read_char_from_string);
        } else {
          break;
        }
      }
      this.back_char(read_char_from_string);
      token = this.Judge_key_token(this.stringBuffer!); //判断所给字符串是否在字符表中
      token.lexme = this.stringBuffer; //若字符串在字符表中，则将字符串赋予记号lexeme的属性

      return token;
    } else if (this.isDigit(read_char_from_string)) {
      // 如果是一个数字，则一定是一个常量
      while (true) {
        // 最大化匹配字符
        read_char_from_string = this.get_char();
        if (this.isDigit(read_char_from_string)) {
          this.add_char_to_stringbuffer(read_char_from_string);
        } else {
          break;
        }
      }
      if (String.fromCharCode(read_char_from_string) === ".") {
        // 常量可能为小数
        this.add_char_to_stringbuffer(read_char_from_string);
        while (true) {
          // 最大化匹配字符
          read_char_from_string = this.get_char();
          if (this.isDigit(read_char_from_string)) {
            this.add_char_to_stringbuffer(read_char_from_string);
          } else {
            break;
          }
        }
      }
      this.back_char(read_char_from_string);
      token.tokenType = Token_Type.CONST_ID;
      token.value = parseFloat(this.stringBuffer); // 将字符串小数变为十进制小数
      return token;
    } // 若不是字母和数字，则一定是符号
    else {
      switch (String.fromCharCode(read_char_from_string)) {
        case ",":
          token.tokenType = Token_Type.COMMA;
          break;
        case ";":
          token.tokenType = Token_Type.SEMICO;
          break;
        case "(":
          token.tokenType = Token_Type.L_BRACKET;
          break;
        case ")":
          token.tokenType = Token_Type.R_BRACKET;
          break;
        case "+":
          token.tokenType = Token_Type.PLUS;
          break;
        case "-":
          read_char_from_string = this.get_char();
          if (String.fromCharCode(read_char_from_string) === "-") {
            // 遇到注释 --
            while (
              String.fromCharCode(read_char_from_string) !== "\n" &&
              read_char_from_string != -1 &&
              read_char_from_string != 65535
            ) {
              // 最大匹配字符串
              read_char_from_string = this.get_char();
            }
            this.back_char(read_char_from_string);
            return this.getToken(); // 读完全部注释，从注释后接着读取与分析字符
          } else {
            this.back_char(read_char_from_string);
            token.tokenType = Token_Type.MINUS;
            break;
          }
        case "/":
          read_char_from_string = this.get_char();
          if (String.fromCharCode(read_char_from_string) === "/") {
            // 遇到注释 //
            while (
              String.fromCharCode(read_char_from_string) !== "\n" &&
              read_char_from_string != -1 &&
              read_char_from_string != 65535
            ) {
              // 最大匹配字符串
              read_char_from_string = this.get_char();
            }
            this.back_char(read_char_from_string);
            return this.getToken(); // 读完全部注释，从注释后接着读取与分析字符
          } else {
            this.back_char(read_char_from_string);
            token.tokenType = Token_Type.DIV;
            break;
          }
        case "*":
          read_char_from_string = this.get_char();
          if (String.fromCharCode(read_char_from_string) === "*") {
            // 匹配乘方
            token.tokenType = Token_Type.POWER;
            break;
          } // 匹配乘法
          else {
            this.back_char(read_char_from_string);
            token.tokenType = Token_Type.MUL;
            break;
          }
        default:
          token.tokenType = Token_Type.ERRTOKEN;
          break;
      }
      token.lexme = this.stringBuffer;
    }
    return token;
  }

  static Judge_key_token(string: string) {
    let err_token = new Token(null, null, null, null);
    for (let loop = 0; loop < Token_Table.token_table.length; loop++) {
      if (Token_Table.token_table[loop].lexme === string) {
        return Token_Table.token_table[loop];
      }
    }
    this.stringBuffer = "";
    err_token.tokenType = Token_Type.ERRTOKEN;
    return err_token;
  }

  static back_char(read_char_from_string: number): void {
    if (read_char_from_string !== -1) {
      this.now_pos--;
    }
  }

  static add_char_to_stringbuffer(read_char_from_string: number): void {
    this.stringBuffer += String.fromCharCode(read_char_from_string);
  }

  static get_char(): number {
    if (
      typeof this.InputString === "string" &&
      typeof this.now_pos === "number" &&
      this.now_pos < this.InputString.length
    ) {
      let ret: number = this.InputString.toUpperCase().charCodeAt(this.now_pos);
      this.now_pos++;
      return ret;
    } else if (
      this.InputString &&
      this.now_pos &&
      this.now_pos === this.InputString.length
    ) {
      return 65535;
    } else {
      console.error("出错啦" + this.line_num);
      return 0;
    }
  }

  static empty_token_buff(): void {
    this.stringBuffer = "";
  }
}
