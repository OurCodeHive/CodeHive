import { useState, useRef, useEffect } from "react";
import * as StompJs from '@stomp/stompjs';

function IDETerminal(props) {

  const client = useRef({});

  let [openConsole, setOpenConsole] = useState(true);
  let [isConsole, setIsConsole] = useState("6vh");
  let [input, setInput] = useState("");
  let [consoleState, setConsoleState] = useState("Input");
  let [inputColor, setInputColor] = useState("wheat");
  let [resultColor, setResultColor] = useState("gray");
  let [compileResult, setCompileResult] = useState("5");
  
  function handleInput(event) {
    setInput(event.target.value);
  }

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    }
  }, [])

  function compileCode() {
    let code = props.code;
    const message = {
      userId: 1,
      studyRoomId: 1,
      code: code,
      input: input,
    }
    publish(message);
    console.log(message);
  }

  function connect() {
    client.current = new StompJs.Client({
      brokerURL: import.meta.env.VITE_CHAT,
      onConnect: () => {
        subscribe();
      },
    });
    client.current.activate();
  };

  function publish(codeAndInput) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/compile',
      body: JSON.stringify(codeAndInput),
    });
  };

  function subscribe() {
    client.current.subscribe('/sub/compile/' + props.id, (body) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      setCompileResult(message.result);
      setOpenConsole(true);
      setIsConsole("20vh");
      setConsoleState("Result");
      setInputColor("gray");
      setResultColor("wheat");
    });
  };
  
  function disconnect() {
    client.current.deactivate();
  };


  return(
    <div style={{
      position:"absolute",
      backgroundColor:"#262626",
      borderRadius:"10px 10px 0px 0px",
      width:"60%",
      left:"25%",
      bottom:"0px",
      height: isConsole,
      color:"wheat"
    }}>
      <button onClick={() => {
        setOpenConsole(!openConsole);
        if (openConsole) {
          setIsConsole("20vh");
          props.up();
        } else {
          setIsConsole("6vh");
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
        isConsole === "6vh"? null: 
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
        consoleState === "Input"?
        <button onClick={() => {
          compileCode();
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
        >run</button>: null
      }
      
    </div>
  )
}


export default IDETerminal