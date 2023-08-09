import { useRef, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import style from "@/res/css/module/ChatPage.module.css";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { ChatMessage } from '@/type/ChatType';
import { getChatList, getStudyUserList } from '@/api/chat';
import { useNavigate } from "react-router-dom";


interface Props {
  id: string;
  chatRedPoint?: boolean;
  setChatRedPoint?: (arg: boolean) => void;
  setIsShow?: (arg: boolean) => void;
}

function ChatFrameComp(props: Props) {

  const navigate = useNavigate();

  const loginUser = useRecoilValue(userState);
  const client = useRef<any>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [chat, setChat] = useState<string>("");
  const [dic, setDic] = useState<{ [userId: number]: string }>("");

  function getDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${String(year).slice(-2)}-${month}-${day} ${hour}:${minute}`;
  }

  async function fetchChatData() {
		await getChatList(props.id, ({data}) => {
      setChatList(data);
    },
    (err) => {console.log(err)});
	}

  async function fetchStudyUserList() {

    await getStudyUserList(props.id, ({data}) => {
      const userList = data.studyUserList;
      const temp: { [userId: number]: string } = {}

      for (const item of userList) {
        temp[item.userId] = item.nickName;
      }

      if (props.setIsShow) {
        props.setIsShow(true);
      }

      setDic(temp);
    },
    (err) => {
      navigate("/notFound");
    })
  }

  // 채팅 데이터, 현재 참여유저 받아오기 => 딕셔너리에 저장
  useEffect(() => {
    fetchStudyUserList();
    fetchChatData();
    connect();
    return () => {
      disconnect();
    };
  }, []);

  // 스크롤
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior : 'smooth' });
  }, [chatList]);
  
  // 채팅 보내기
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (chat === "") {
      return;
    }

    const newChat: ChatMessage = {
      userId: loginUser.userId,
      studyRoomId: props.id,
      message: chat,
      dateTime: getDate()
    };

    publish(newChat);
    setChat("");
  }

  // chat 입력시 값 변경
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length > 300) {
      return
    }
    setChat(event.target.value);
  }
  
  // websocket 연결
  function connect() {
    client.current = new StompJs.Client({
      brokerURL: import.meta.env.VITE_CHAT,
      onConnect: () => {
        getMessage();
      },
    });
    client.current.activate();
  }

  // 메시지 발송
  function publish(chat: ChatMessage) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/chat',
      body: JSON.stringify(chat),
    });
    setChat('');
  }

  // 메시지 받기
  function getMessage() {
    client.current.subscribe('/sub/chat/' + props.id, (body:StompJs.Message) => {
      const message = JSON.parse(body.body) as ChatMessage;
      setChatList((chat_list) => [...chat_list, message]);
      if (props.setChatRedPoint) {
        props.setChatRedPoint(true);
      }
    });
  }
  
  // 언마운드 될때 연결 해제
  function disconnect() {
    client.current.deactivate();
  }

  return (
    <>
      <div className={style.backGround}>
        <div className={style.boxSize}>
          <div className={style.container}>
            {
              chatList.map((value, index) => {
                return (
                  <div key={index} className={style.boxPadding}>
                    <div ref={scrollRef}></div>
                    {
                      value.userId === loginUser.userId ?
                      <>
                        <p className={style.talkItem}>
                          {dic[value.userId]}&nbsp;&nbsp;&nbsp;{value.dateTime}
                        </p>
                        <p className={style.talkDetailItem}>{value.message}</p>
                      </>
                      :
                      <>
                        <p className={style.talkItem}>
                          {dic[value.userId]}&nbsp;&nbsp;&nbsp;{value.dateTime}
                        </p>
                        <p className={style.talkDetailItem}>{value.message}</p>
                      </>
                    }
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
