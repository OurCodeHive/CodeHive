import { useEffect, useState, useRef, useLayoutEffect, useMemo } from "react";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue} from 'recoil';
import { userState } from '@/atom/UserAtom';



function JoinUserMouse({ userIdList, studyRoomId, userMouseList}:{ userIdList:number[], studyRoomId:any, userMouseList:any}) {

  const loginUser = useRecoilValue(userState); 
  const client = useRef<any>({});
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [userMouseInfo, setUserMouseInfo] = useState<any>(userMouseList);
  const [check, setCheck] = useState(true);

  useEffect(() => {
    const temp = [];
    for (let userId of userIdList) {
      if (userId !== loginUser.userId) {
        temp.push(userId);
      }
    }
  }, [])
  

  // 커서위치 
  const mouseFunc = (e:any) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      if (currentX > 1500 || currentY > 695) {
        return
      }
      setX(currentX);
      setY(currentY);
  };

  // 0.1초마다 커서 위치 전송
  useEffect(() => {
    const interval = setInterval(() => {
      setCheck(prevCheck => !prevCheck);
      const spot = {
        userId: loginUser.userId,
        studyRoomId: studyRoomId,
        x: x,
        y: y,
      }
      emitMoveCursor(spot)
    }, 100);
    return () => {
      clearInterval(interval); // 컴포넌트가 언마운트될 때 타이머 해제
    };
  }, [check]);

  // websocket 연결
  async function connect() {
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
  async function getCursorSpot() {
    client.current.subscribe('/sub/cursor/' + studyRoomId, (body:StompJs.Message) => {
      const message = JSON.parse(body.body);
      const temp = {...userMouseInfo}
      temp[message.userId] = [message.x, message.y]
      setUserMouseInfo(temp);
    });
  }

  useEffect(() => {
    // 소켓 연결
    connect();
    return () => {
      disconnect();
    }
  }, [userMouseInfo])

  useEffect(() => {
    const temp = {...userMouseList};
    setUserMouseInfo(temp);
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", mouseFunc);
    return () => {
      window.removeEventListener("mousemove", mouseFunc);
    }
  },[])

  return (
    <>
      <div>
        {
          userIdList.map((item:number, index:number) => {
            return (
              <div key={item + "12"}>
                {
                  item == loginUser.userId? 
                  null
                  :
                  <>
                  {
                    userMouseInfo[item] == undefined?
                    null
                    :
                    <div key={item + "123"}
                      style={{
                        zIndex: "999",
                        position: "absolute",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        pointerEvents: 'none',
                        left: userMouseInfo[item][0] + "px",
                        top: userMouseInfo[item][1] + "px"
                      }}
                    >👈</div>
                  }
                  </>
                }
              </div>
            )
          })
        }
      </div>
    </>
  )
}


export default JoinUserMouse;