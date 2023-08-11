import style from "@/res/css/module/UserVideo.module.css";
import { useEffect, useState, useRef } from "react";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';


function JoinUserMouse({ userIdList, studyRoomId }:{ userIdList:number[], studyRoomId:any }) {

  const loginUser = useRecoilValue(userState);

  const n = userIdList.length
  const client = useRef<any>({});
  const initialCoordinateList = Array.from({ length: 10 }, () => [0, 0]);
  const [coordinate, setCoordinate] = useState(initialCoordinateList);
  console.log(coordinate)
  let [x, setX] = useState(0);
  let [y, setY] = useState(0);

  let [check, setCheck] = useState(true);

  const mouseFunc = (e:any) => {
    let x = e.clientX;
    let y = e.clientY;
    setX(x);
    setY(y);
    const spot = {
      userId: loginUser.userId,
      studyRoomId: studyRoomId,
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
    client.current.subscribe('/sub/cursor/' + studyRoomId, (body:StompJs.Message) => {
      const message = JSON.parse(body.body);
      console.log(message)
      // if (message.userId !== props.userId) {
      //   setYourX(message.x);
      //   setYourY(message.y);
      // } else {
      //   setMyX(message.x);
      //   setMyY(message.y);
      // }
    });
  }

  useEffect(() => {
    connect()
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@22")
    console.log(studyRoomId)
    setInterval(() => setCheck(!check), 1000);
    window.addEventListener("mousemove", mouseFunc);
    return () => {
      window.removeEventListener("mousemove", mouseFunc);
      disconnect();
    }
  },[])


  return (
    <>
      <div>
        {
          userIdList.map((item:number, index:number) => {
            return (
              <div key={item}>
                <img
                  src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/cursor.png"
                  id="cursor"
                  style={{
                    zIndex: "999",
                    position: "absolute",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    pointerEvents: 'none',
                    left: coordinate[index][0] + "px",
                    top: coordinate[index][1] + "px"
                  }}
                ></img>
              </div>
            )
          })
        }
      </div>
    </>
  )
}


export default JoinUserMouse;