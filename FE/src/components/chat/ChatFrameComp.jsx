import ChatComp from "./ChatComp";
import { useRef, useState, useEffect } from 'react';
import style from "./ChatPage.module.css"
import * as StompJs from '@stomp/stompjs';

function ChatFrameComp() {

  function getDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = "0" + (date.getMonth() + 1);
    let day = "0" + date.getDate();
    let hour = "0" + date.getHours();
    let minute = "0" + date.getMinutes();
    return String(year).substr(-2) + "-" + month.substr(-2) + "-" + day.substr(-2) + " "+ hour.substr(-2) + ":" + minute.substr(-2);
  }

  // 채팅 데이터 받아오기
  useEffect(() => {

  }, [])

  let temp = [
    {
      userName:"민성",
      message:"안녕",
      sendTime:"23-07-24 04:23"
    },
  ]

  let [chatList, setChatList] = useState(temp);
  let [chat, setChat] = useState("");
  
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior : 'smooth' });
  }, [chatList])
  
  function handleSubmit(event) {
    event.preventDefault();
    if (chat === "") {
      return
    }

    const newChat = {
      userName: "민성", // 실제로 pk받아서 스터디원이랑 조회 해야함 => 백에서
      message: chat,
      sendTime: getDate()
    }

    const temp = [...chatList, newChat];
    setChatList(temp);
    setChat("");
  }

  function handleChange(event) {

    setChat(event.target.value);
  }
  
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
            maxHeight:"65vh",
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
                    >{value.userName}&nbsp;&nbsp;&nbsp;{value.sendTime}</p>
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