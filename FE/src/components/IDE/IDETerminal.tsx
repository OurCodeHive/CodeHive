import { useState, useRef, useEffect, ChangeEvent } from "react";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import toast, { Toaster } from 'react-hot-toast';
import style from "@/res/css/module/IDETerminal.module.css";
import { language } from "@codemirror/language";

interface IDETerminalProps {
  id: string;
  code: string;
  up: () => void;
  down: () => void;
  language: string;
}

function IDETerminal(props: IDETerminalProps) {
  // 유저 정보 담는 임시 딕셔너리
  const dic: { [key: number]: string } = {
    1: "Hayoung",
    2: "MinSung"
  };

  // 로그인 유저 정보
  const loginUser = useRecoilValue(userState);

  // 웹소켓
  const client = useRef<any>({});

  const [openConsole, setOpenConsole] = useState<boolean>(true);
  const [isConsole, setIsConsole] = useState<string>("6vh");
  const [input, setInput] = useState<string>("1234");
  const [consoleState, setConsoleState] = useState<string>("Input");
  const [inputColor, setInputColor] = useState<string>("wheat");
  const [resultColor, setResultColor] = useState<string>("gray");
  const [compileResult, setCompileResult] = useState<string>("");
  const [consoleResultColor, setConsoleResultColor] = useState<string>("wheat");
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // input 변경
  function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
    setInput(event.target.value);
  }

  // 마운트시 연결 언마운트 연결해제
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  // 연결
  function connect() {
    client.current = new StompJs.Client({
      brokerURL: import.meta.env.VITE_CHAT,
      onConnect: () => {
        // 제출했다고 공지
        noticeSubmit();
        // 결과 왔다고 공지
        submitCodeAndInput();
      },
    });
    client.current.activate();
  }

  // 제출 했다고 알리기
  function submit() {
    const message = {
      userId: loginUser.userId,
      studyRoomId: props.id,
    };
    publish(message);
  }

  // 제출 했다고 알리기
  function publish(userInfo: { userId: number; studyRoomId: string }) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/submit',
      body: JSON.stringify(userInfo),
    });
  }

  // 코드실행
  function runCode() {
    const codeAndInput = {
      language: props.language,
      userId: loginUser.userId,
      studyRoomId: props.id,
      code: props.code,
      input: input,
    };
    runCodeAndInput(codeAndInput);
  }

  // code, input 제출하기
  function runCodeAndInput(codeAndInput: { userId: number; studyRoomId: string; code: string; input: string }) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/run',
      body: JSON.stringify(codeAndInput),
    });
  }

  // 결과 받기
  function submitCodeAndInput() {
    client.current.subscribe('/sub/run/' + props.id, (body:any) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      runNotice(dic[message.userId]);
      setIsConsole("20vh");
      setConsoleState("Result");
      setInputColor("gray");
      setResultColor("wheat");
      setInputColor("gray");
      setIsRunning(false);
      props.up();
      // 성공인 경우
      if (message.state) {
        setResultColor("green");
        setConsoleResultColor("green");
        setCompileResult(message.output);
        // 실패인 경우
      } else {
        setResultColor("red");
        setConsoleResultColor("red");
        setCompileResult(message.output);
      }
    });
  }

  // 제출알림받고 제출 기다리기
  function noticeSubmit() {
    client.current.subscribe('/sub/submit/' + props.id, (body:any) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      notify(dic[message.userId]);
      setIsRunning(true);
    });
  }

  // 연결 해제
  function disconnect() {
    client.current.deactivate();
  }

  // 콘솔 토글
  function switchConsole() {
    setOpenConsole(!openConsole);
    if (openConsole) {
      setIsConsole("20vh");
      props.up();
    } else {
      setIsConsole("6vh");
      props.down();
    }
  }

  // input 클릭
  function selectInput() {
    setConsoleState("Input");
    setInputColor("wheat");
    setResultColor("gray");
  }

  // result 클릭
  function selectResult() {
    setConsoleState("Result");
    setInputColor("gray");
    setResultColor("wheat");
  }

  function submitAndRun() {
    if (isRunning) {
      runningCode();
      return;
    }
    submit();
    runCode();
  }

  return (
    <div className={style.consoleBox} style={{ height: isConsole }}>
      <Toaster position="top-right" />
      <button onClick={() => { switchConsole() }} className={style.consoleBtn}>Console</button>
      {
        isConsole === "6vh" ? null :
          <>
            <p onClick={() => { selectInput() }} className={style.inputText} style={{ color: inputColor }}>
              Input
            </p>
            <p
              onClick={() => { selectResult() }}
              className={style.resultText}
              style={{ color: resultColor }}>
              Result
            </p>
            {
              consoleState === "Input" ?
                // input
                <textarea
                  className={style.inputTextArea}
                  onChange={(event) => {
                    handleInput(event);
                  }}
                  value={input}
                ></textarea> :
                // result
                <textarea
                  readOnly
                  className={style.inputTextArea}
                  style={{ color: consoleResultColor }}
                  onChange={(event) => {
                    handleInput(event);
                  }}
                  value={compileResult}
                ></textarea>
            }
          </>
      }
      {
        openConsole ? null :
          consoleState === "Input" ?
            <button onClick={() => {
              submitAndRun();
            }}
              className={style.runBtn}
            >run</button> : null
      }
    </div>
  );
}

// 코드 제출 toast
function notify(name: string) {

  let sentence = name + '님이 코드를 제출하였습니다.';
  if (name == undefined) {
    sentence = "코드가 제출되었습니다.";
  }

  toast(sentence, {
    duration: 2000,
    icon: '💻',
    style: {
      fontSize: "14px",
      width: "60vh"
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

// 결과 확인 notice
function runNotice(name: string) {

  let sentence = name + '님이 제출한 코드가 실행되었습니다.';
  if (name == undefined) {
    sentence = "코드가 실행되었습니다.";
  }

  toast(
    sentence, 
    {
      duration: 2000,
      icon: '💻',
      style: 
        {
          fontSize: "14px",
          width: "60vh",
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

function runningCode() {

  let sentence = "이미 실행중인 코드가 있습니다.";

  toast(
    sentence, 
    {
      duration: 2000,
      icon: '💻',
      style: 
        {
          fontSize: "14px",
          width: "60vh",
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

export default IDETerminal;