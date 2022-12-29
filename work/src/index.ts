import Draw from "./Semantic/Draw";
import SemanticImp from "./Semantic/SemanticImp";

let InputString = `
rot is 0;
origin is (50,400);
//scale is (2,1);
for T from 0 to 300 step 1 draw (t,0);
for T from 0 to 100 step 30 draw (0,-t);
for T from 0 to 120 step 1 draw (t,-t);
//scale is (2,0.1);
//for T from 0 to 55 step 10 draw (t,-(t*t));
scale is (10,22);
origin is (400,400);
rot is 30;
for T from 0 to 60 step 1 draw (t,sqrt(t));
scale is (20,0.1);
color is red;
for T from 0 to 8 step 0.1 draw (t,+exp(t));
scale is (2,20);
for T from 0 to 300 step 1 draw (t,-ln(t));
`;

(document.getElementById("compileButton") as HTMLButtonElement).onclick =
  () => {
    let inputString: string = (
      document.getElementById("codeInput") as HTMLInputElement
    ).value;
    (document.getElementById("c") as HTMLCanvasElement)
      .getContext("2d")
      ?.clearRect(0, 0, 1000, 1000);

    let semanticImp = new SemanticImp(new Draw());
    semanticImp.Parser(inputString);
  };
