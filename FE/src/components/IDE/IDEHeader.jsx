import saveButton from "@/components/IDE/downlode";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import * as StompJs from '@stomp/stompjs';


function IDEHeader(props) {

  const client = useRef({});
  let [notice, setNotice] = useState("게리맨더링 코드리뷰 중 입니다.");
  
  const navigate = useNavigate();

  function changeNotice() {
    let value = window.prompt("공지사항을 입력해 주세요.");
    if (value === "") {
      return
    }
    if (value === null) {
      return
    }
    const message = {
      userId:1,
      studyRoomId:1,
      notice: value,
    }
    publish(message);
  }

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    }
  }, [])

  function saveMemo() {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8"/>`;
    let html = document.querySelector(".ql-editor");
    let targetString = ns.serializeToString(html);
    return korean + targetString;
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

  function publish(notice) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/notice',
      body: JSON.stringify(notice),
    });
  };

  function subscribe() {
    client.current.subscribe('/sub/notice/' + props.id, (body) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      setNotice(message.notice)
    });
  };
  
  function disconnect() {
    client.current.deactivate();
  };

  return(
    <div style={{
      backgroundColor:"#222226",
      height:"6vh",
    }}>
      <div style={{
        padding: "10px 10px 10px 10px",
        display:"flex",
        // width:"100vh",
        color:"wheat",
      }}>
        <div style={{
          position:"absolute",
        }}>
        <button onClick={() => {
          saveButton(saveMemo(), "코드");
        }}
          style={{
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
        >문서저장</button>&nbsp;&nbsp;
        <button onClick={() => {
          props.saveCode();
        }}
          style={{
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
        >코드저장</button>
        </div>

        <h2
          style={{
            // backgroundColor:"black",
            margin:"auto"
          }}
        >{notice}</h2>
        <div style={{
          position:"absolute",
          right:"1vh",
        }}>
          <button 
            onClick={() => {
              changeNotice();
            }}
          style={{
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
          }}>공지변경</button>&nbsp;&nbsp;
          <button onClick={() =>{
            if (window.confirm("정말로 나가시겠습니까?")) {
              navigate('/');
            } else {
              return
            }
          }}
            style={{
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
          >나가기</button>
        </div>
      </div>
    </div>
  )
}


export default IDEHeader;