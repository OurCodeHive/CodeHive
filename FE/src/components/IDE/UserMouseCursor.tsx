import { useEffect, useState, useRef } from "react";
import * as StompJs from '@stomp/stompjs';

function UserMouseCursor(props:any) {

  const client = useRef<any>({});

  let [x, setX] = useState(0);
  let [y, setY] = useState(0);

  let [myX, setMyX] = useState(0);
  let [myY, setMyY] = useState(0);

  let [yourX, setYourX] = useState(0);
  let [yourY, setYourY] = useState(0);

  let [check, setCheck] = useState(true);

  const mouseFunc = (e:any) => {
    let x = e.clientX;
    let y = e.clientY;
    setX(x);
    setY(y);
    const spot = {
      userId: props.userId,
      studyRoomId: props.id,
      x: x,
      y: y,
    }
    if (check) {
      emitMoveCursor(spot)
    }
  };

  // websocket 연결
  function connect() {
    client.current = new StompJs.Client({
      brokerURL: import.meta.env.VITE_CHAT,
      onConnect: () => {
        getCursorSpot();
      },
    });
    client.current.activate();
  }

  // 내위치 알리기
  function emitMoveCursor(spot:any) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/cursor',
      body: JSON.stringify(spot),
    });
  }

  // 언마운드 될때 연결 해제
  function disconnect() {
    client.current.deactivate();
  }


  // 상대위치 받기
  function getCursorSpot() {
    client.current.subscribe('/sub/cursor/' + 1, (body:StompJs.Message) => {
      const message = JSON.parse(body.body);
      console.log(message)
      if (message.userId !== props.userId) {
        setYourX(message.x);
        setYourY(message.y);
      } else {
        setMyX(message.x);
        setMyY(message.y);
      }
    });
  }

  useEffect(() => {
    connect()
    setInterval(() => setCheck(!check), 1000);
    window.addEventListener("mousemove", mouseFunc);
    return () => {
      window.removeEventListener("mousemove", mouseFunc);
      disconnect();
    }
  },[])

  
  return(
    <>
      {/* <img 
        src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/cursor.png"
        id="cursor"
        style={{
          zIndex:"999",
          position: "absolute",
          left:myX + "px",
          top:myY + "px"
        }}
      ></img> */}
      <img 
        src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/cursor.png"
        id="cursor"
        style={{
          zIndex:"999",
          position: "absolute",
          left:yourX + "px",
          top:yourY + "px"
        }}
      ></img>
    </>
  )
}


export default UserMouseCursor