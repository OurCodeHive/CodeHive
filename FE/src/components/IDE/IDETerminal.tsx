import { useState } from "react";

function IDETerminal(props: any) {

  let [openConsole, setOpenConsole] = useState(true);
  let [console, setConsole] = useState("6vh");
  let [input, setInput] = useState("");
  let [consoleState, setConsoleState] = useState("Input");
  let [inputColor, setInputColor] = useState("wheat");
  let [resultColor, setResultColor] = useState("gray");
  let [compileResult] = useState("5");
  // let [compileResult, setCompileResult] = useState("5");

  // function handleInput(event :React.ChangeEvent<HTMLInputElement>) {
  //   setInput(event.target.value);
  // }
  
  function handleInput(event :any) {
    setInput(event.target.value);
  }

  return(
    <div style={{
      position:"absolute",
      backgroundColor:"#262626",
      borderRadius:"10px 10px 0px 0px",
      width:"60%",
      left:"25%",
      bottom:"0px",
      height: console,
      color:"wheat"
    }}>
      <button onClick={() => {
        setOpenConsole(!openConsole);
        if (openConsole) {
          setConsole("20vh");
          props.up();
        } else {
          setConsole("6vh");
          props.down();
        }
      }}
        style={{
          position:"absolute",
          left:"1vh",
          bottom:"1vh",
          backgroundColor:"#423423",
          borderRadius:"4px",
          border:"1px solid #423423",
          display:"inline-block",
          cursor:"pointer",
          color:"#ffffff",
          // font-family:Arial,
          fontSize:"14px",
          padding:"3px",
          textDecoration:"none",
          textShadow:"0px 1px 0px #2f6627",   
        }}
      >Console</button>

      {
        console === "6vh"? null: 
        <>
          <p 
            onClick={() => {
              setConsoleState("Input");
              setInputColor("wheat");
              setResultColor("gray");
            }}
            style={{
            padding:"10px",
            paddingLeft:"18px",
            fontSize:"16px",
            color:inputColor,
          }}>
            Input
          </p>
          <p 
            onClick={() => {
              setConsoleState("Result");
              setInputColor("gray");
              setResultColor("wheat");
            }}
            style={{
            padding:"10px",
            paddingLeft:"15px",
            fontSize:"16px",
            color:resultColor,
          }}>
            Result
          </p>
          {
            consoleState === "Input"?
            // 인풋       
            <textarea
            style={{
              position:"absolute",
              // marginTop:"1vh",
              height: "18vh",
              top:"1vh",
              width:"85.5%",
              left:"10vh",
              marginLeft:"1vh",
              backgroundColor:"#222326",
              border: "solid 2px #6272A4",
              borderRadius: "5px",
              color:"wheat",
              padding: "10px",
              outline: "none",
              resize:"none",
            }}
            // onChange={handleInput}
            onChange={(event) => {
              handleInput(event);
            }}
            value={input}
          ></textarea> :
          // 결과
          <textarea readOnly
          style={{
            position:"absolute",
            height: "18vh",
            top:"1vh",
            width:"85.5%",
            left:"10vh",
            marginLeft:"1vh",
            backgroundColor:"#222326",
            border: "solid 2px #6242A4",
            // border:"solid 2px #222326",
            borderRadius: "5px",
            color:"wheat",
            padding: "10px",
            outline: "none",
            resize:"none",
          }}
          // onChange={handleInput}
          onChange={(event) => {
            handleInput(event);
          }}
          value={compileResult}
        ></textarea>
          }
        </>
      }
      {
        openConsole? 
        null
        :
        <button onClick={() => {
          let code = props.code;
          const submit = {
            input: input,
            code: code,
          }
          alert(JSON.stringify(submit));
          setConsoleState("Result");
          setInputColor("gray");
          setResultColor("wheat");
        }}
          style={{
            position:"absolute",
            right:"1vh",
            top:"1vh",
            width:"40px",
            backgroundColor:"#225904",
            borderRadius:"4px",
            border:"1px solid #225904",
            display:"inline-block",
            cursor:"pointer",
            color:"#ffffff",
            // font-family:Arial,
            fontSize:"15px",
            padding:"3px",
            textDecoration:"none",
            textShadow:"0px 1px 0px #2f6627",     
          }}
        >run</button>
      }
      
    </div>
  )
}


export default IDETerminal