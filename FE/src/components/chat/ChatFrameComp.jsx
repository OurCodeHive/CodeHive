import ChatComp from "./ChatComp";
import { useRef, useState, useEffect } from 'react';
import style from "./ChatPage.module.css"
import * as StompJs from '@stomp/stompjs';
import axios from 'axios';

function ChatFrameComp(props) {

  const client = useRef({});
  const scrollRef = useRef();

  let [chatList, setChatList] = useState([]);
  let [chat, setChat] = useState("");

  function getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = "0" + (date.getMonth() + 1);
    let day = "0" + date.getDate();
    let hour = "0" + date.getHours();
    let minute = "0" + date.getMinutes();
    return String(year).substr(-2) + "-" + month.substr(-2) + "-" + day.substr(-2) + " "+ hour.substr(-2) + ":" + minute.substr(-2);
  }

  // 채팅 데이터, 현재 참여유저 받아오기 => 딕셔너리에 저장
  useEffect(() => {

    const studyInfoId = props.id;
    const url = "http://localhost:8080" + "/api/chat/" + studyInfoId;
    
    axios.get(url)
    .then((result) => {
      setChatList(result.data);
    })
    .then(() => {
      connect();
    })

    return () => {
      disconnect();
    }

  }, [])

  let dic = {
    1:"민성"
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior : 'smooth' });
  }, [chatList])
  
  function handleSubmit(event) {
    event.preventDefault();

    if (chat === "") {
      return
    }

    const newChat = {
      userId: 1,
      studyRoomId: props.id,
      message: chat,
      dateTime: getDate()
    }

    publish(newChat);
    setChat("");
  }

  function handleChange(event) {
    setChat(event.target.value);
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

  function publish(chat) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/chat',
      body: JSON.stringify(chat),
    });
    setChat('');
  };

  function subscribe() {
    client.current.subscribe('/sub/chat/' + props.id, (body) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      setChatList((chat_list) => [
        ...chat_list, message
      ]);
    });
  };
  
  function disconnect() {
    client.current.deactivate();
  };

  return(
    <>
      <div style={{
        position:"absolute",
        right:"3vh",
        top:"15vh",
        backgroundColor:"rgba(232, 215, 250, 0.717)",
        borderRadius:"10px 10px 10px 10px",
        height:"73vh",
        width:"50vh",
        display:"",
        paddingTop:"1vh",
        maxHeight:"73vh",
      }}
      >
        <div
          style={{
            height:"70vh",
            width:"50vh",
          }}
        >

          <div className={style.container} style={{
            flexDirection: "row",
            maxHeight:"63.5vh",
            width:"100%",
            overflowY: "auto"
          }}>
            {
              chatList.map((value, index) => {
                return(
                  <div key={index} style={{
                    paddingLeft:"1vh",
                    paddingRight:"1vh",
                  }}>
                    <div ref={scrollRef}></div>
                    <p
                      style={{
                        fontSize:"15px",
                        paddingLeft:"3px",
                      }}
                    >{dic[value.userId]}&nbsp;&nbsp;&nbsp;{value.dateTime}</p>
                    <p
                      style={{
                        fontSize:"15px",
                        backgroundColor:"skyblue",
                        width:"fit-content",
                        wordBreak:"break-all",
                        padding:"7px",
                        borderRadius:"10px"
                      }}
                    >{value.message}</p>
                  </div>
                )
              })
            }
          </div>
        </div>
         <div className={style.messages}>
          <form className={style.send} onSubmit={(event) => handleSubmit(event)}>
            <input className={style.input} placeholder="메시지를 입력하세요" type={'text'} onChange={handleChange} value={chat} />
            <button className={style.btn} type={'submit'}>
              <img src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/secondlife/send.png"
                className={style.sendImg}
              />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}


export default ChatFrameComp;