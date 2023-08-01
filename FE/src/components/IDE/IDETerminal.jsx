import { useState, useRef, useEffect } from "react";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

function notify(name) {
  toast(name + '님이 코드를 제출하였습니다.', {
    duration: 2000,
    icon: '💻',
    style: {
      fontSize:"14px",
      width:"60vh"
    },
    iconTheme: {
      primary: '#000',
      secondary: '#fff',
    },
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  }); 
}

function runNotice(name) {
  toast(
    name + 
    '님이 제출한 코드가 실행되었습니다.', {
    duration: 2000,
    icon: '💻',
    style: {
      fontSize:"14px",
      width:"60vh",
    },
    iconTheme: {
      primary: '#000',
      secondary: '#fff',
    },
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  }); 
}

function IDETerminal(props) {

  let dic = {
    1:"Hayoung",
    2:"MinSung"
  }

  let loginUser = useRecoilValue(userState);

  const client = useRef({});

  let [openConsole, setOpenConsole] = useState(true);
  let [isConsole, setIsConsole] = useState("6vh");
  let [input, setInput] = useState("1234");
  let [consoleState, setConsoleState] = useState("Input");
  let [inputColor, setInputColor] = useState("wheat");
  let [resultColor, setResultColor] = useState("gray");
  let [compileResult, setCompileResult] = useState("");
  let [consoleResultColor, setConsoleResultColor] = useState("wheat");
  
  function handleInput(event) {
    setInput(event.target.value);

  }

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    }
  }, [])

  function connect() {
    client.current = new StompJs.Client({
      brokerURL: import.meta.env.VITE_CHAT,
      onConnect: () => {
        noticeSubmit();
        submitCodeAndInput();
      },
    });
    client.current.activate();
  };
  
  // 제출 했다고 알리기
  function submit() {
    const message = {
      userId: loginUser.userId,
      studyRoomId: props.id,
    }
    publish(message);
  }

  // 제출 했다고 알리기
  function publish(userInfo) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/submit',
      body: JSON.stringify(userInfo),
    });
  };


  const runCode = () => { 
    const codeAndInput = {
      userId: loginUser.userId,
      studyRoomId: props.id,
      code: props.code,
      input: input,
    }
    // console.log(input)
    // console.log(codeAndInput2);
    runCodeAndInput(codeAndInput);
  };

  function test() {
    const data = {
      code: props.code,
      input: input,
      name: "ddd"
    }
    const url = "https://5vh8fjhuzg.execute-api.ap-northeast-2.amazonaws.com/run/code";
    axios.post(url, data)
    .then((res) => {
      alert(res)
    })
  }

  // code, input 제출하기
  function runCodeAndInput(codeAndInput) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/run',
      body: JSON.stringify(codeAndInput),
    });
  }

  // code, 
  function submitCodeAndInput() {
    client.current.subscribe('/sub/run/' + props.id, (body) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      runNotice(dic[message.userId]);
      // setOpenConsole(true);
      setIsConsole("20vh");
      setConsoleState("Result");
      setInputColor("gray");
      setResultColor("wheat");
      setInputColor("gray");
      props.up();
      if (message.state) { 
        setResultColor("green");
        setConsoleResultColor("green");
        setCompileResult(message.output);
      } else {
        setResultColor("red");
        setConsoleResultColor("red")
        setCompileResult(message.output);
      }
    });
  }

  // 제출알림받고 제출 기다리기
  function noticeSubmit() {
    client.current.subscribe('/sub/submit/' + props.id, (body) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      // setCompileResult(message.result);
      notify(dic[message.userId]);
      // runCode();
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
      <Toaster
        position="top-right"
      />
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
            color:consoleResultColor,
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
            // color:"wheat",
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
          // alert(props.code);
          // alert(input)
          submit();
          runCode();
          // test();
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
