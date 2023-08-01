import saveButton from "@/components/IDE/downlode";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import toast, { Toaster } from 'react-hot-toast';
import style from '@/res/css/module/IDEHeader.module.css';

interface IDEHeaderProps {
  id: string;
  code: string;
  language: string;
}

function IDEHeader(props: IDEHeaderProps) {
  // 마운트시 연결 언마운트 연결해제
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    }
  }, []);

  // 유저 정보 담는 임시 딕셔너리
  const dic: { [key: number]: string } = {
    1: "Hayoung",
    2: "MinSung",
  };

  // 로그인유저 정보
  const loginUser = useRecoilValue(userState);

  // 웹소켓
  const client = useRef<any>({});

  const [notice, setNotice] = useState<string>("게리맨더링 코드리뷰 중 입니다.");
  const navigate = useNavigate();

  // 공지변경 소켓 통신
  function changeNotice() {
    const value = window.prompt("공지사항을 입력해 주세요.");
    if (value === "" || value === null) {
      return;
    }
    const message = {
      userId: loginUser.userId,
      studyRoomId: props.id,
      notice: value,
    };
    publish(message);
  }

  // 문서
  function saveDocx() {
    const ns = new XMLSerializer();
    const korean = `<meta charset="utf-8"/>`;
    const html:any = document.querySelector(".ql-editor");
    const targetString = ns.serializeToString(html);
    return korean + targetString;
  }

  // 연결
  function connect() {
    client.current = new StompJs.Client({
      brokerURL: import.meta.env.VITE_CHAT,
      onConnect: () => {
        getNotice();
      },
    });
    client.current.activate();
  }

  // spring socket controller로 전송
  function publish(notice: { userId: number, studyRoomId: string, notice: string }) {
    if (!client.current.connected) {
      return;
    }
    client.current.publish({
      destination: '/pub/notice',
      body: JSON.stringify(notice),
    });
  }

  // 받은 공지 변경
  function getNotice() {
    client.current.subscribe('/sub/notice/' + props.id, (body:any) => {
      const json_body = JSON.parse(body.body);
      const message = json_body;
      setNotice(message.notice)
      notify(dic[message.userId]);
    });
  }

  // 연결 해제
  function disconnect() {
    client.current.deactivate();
  }

  // 현재시간 받아오기
  function presentTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${String(year).slice(-2)}-${month}-${day} `;
  }

  // 나가기
  function exit() {
    if (window.confirm("정말로 나가시겠습니까?")) {
      navigate('/');
    }
  }

  // 코드 저장 함수
  function saveCode() {
    const name = window.prompt("저장할 이름을 입력해 주세요");
    if (name === "" || name === null) {
      return;
    }

    let extension = ".py";
    if (props.language === "Java") {
      extension = ".java";
    }

    const fileName = presentTime() + name + extension;
    const output = props.code;

    const element = document.createElement('a');
    const file = new Blob([output], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // FireFox
    element.click();
  }

  return (
    <div className={style.background}>
      <Toaster position="top-right" />
      <div className={style.boxPadding}>
        <div className={style.boxSetting}>
          <button onClick={() => { saveButton(saveDocx(), "코드"); }}
            className={style.saveBtn}>문서저장</button>
          &nbsp;&nbsp;
          <button onClick={() => { saveCode(); }}
            className={style.saveBtn}>코드저장</button>
        </div>
        <h2 className={style.notice}>{notice}</h2>
        <div className={style.leftBtnBox}>
          <button onClick={() => { changeNotice(); }}
            className={style.saveBtn}>공지변경</button>
            &nbsp;&nbsp;
          <button onClick={() => { exit(); }}
            className={style.saveBtn}>나가기</button>
        </div>
      </div>
    </div>
  );
}

// 공지변경 알림 토스트메시지
function notify(name: string) {
  toast(name + '님이 공지를 변경하였습니다.', {
    duration: 2000,
    icon: '👏',
    style: {
      fontSize: "15px",
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


export default IDEHeader;