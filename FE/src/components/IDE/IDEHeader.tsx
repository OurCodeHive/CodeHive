import saveButton from "@/components/IDE/downlode";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import * as StompJs from '@stomp/stompjs';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import toast, { Toaster } from 'react-hot-toast';
import style from '@/res/css/module/IDEHeader.module.css';
import ConfirmPopup from "@/utils/Popup/Confirm";
import { ContentsPopup } from "@/utils/Popup";
import NoticeChangeModal from "./NoticeChangeModal";
import DocumentListBtn from "../StudyGroup/document/list/ListBtn";


interface IDEHeaderProps {
  id: string;
  code: string;
  language: string;
  dic: any
}

function IDEHeader(props: IDEHeaderProps) {

  // 로그인유저 정보
  const loginUser = useRecoilValue(userState);
  const navigate = useNavigate();

  // 마운트시 연결 언마운트 연결해제
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    }
  }, []);
  
  const [popupStatus, setPopupStatus] = useState(false);
  const popupInfoExit = {
    PopupStatus: popupStatus,
    zIndex: 999,
    maxWidth: 400,
    PopupTitle: "<br>스터디를 종료하시겠습니까?",
    ClosePopupProp : () => setPopupStatus(false),
    ConfirmPopupProp : () => exit()
  }

  const [popupStatusNotice, setPopupStatusNotice] = useState(false);
  const popupInfoNotice = {
    PopupStatus : popupStatusNotice,
    zIndex : 9999,
    maxWidth: 800,
    ClosePopupProp : () => changePopupFlagNotice(false),
    PopupTitle : "공지사항 수정",
    PopupContents : <NoticeChangeModal notifyMaxLengthAlert={notifyMaxLengthAlert} studyRoomId={props.id} publish={publish} closePopup={() => changePopupFlagNotice(false)}/>,
  }

  const changePopupFlagNotice = (flag: boolean) => {
    setPopupStatusNotice(() => flag);
  };

  const [popupStatusFile, setPopupStatusFile] = useState(false);
  const popupInfoFile = {
    PopupStatus : popupStatusFile,
    zIndex : 9999,
    maxWidth: 800,
    ClosePopupProp : () => changePopupFlagFile(false),
    PopupTitle : "자료보기 수정",
    PopupContents : <DocumentListBtn studyinfoId={Number(props.id)} closePopup={() => setPopupStatusFile(false)} />,
  }

  const changePopupFlagFile = (flag: boolean) => {
    setPopupStatusFile(() => flag);
  };

  function exit() {
    navigate("/");
    location.reload();
  }


  // 웹소켓
  const client = useRef<any>({});

  const [notice, setNotice] = useState<string>("오늘 하루도 화이팅!!");


  // 공지변경 소켓 통신
  // function changeNotice() {
  //   const value = window.prompt("공지사항을 입력해 주세요.");
  //   if (value === "" || value === null) {
  //     return;
  //   }
  //   if (value.length > 50) {
  //     notifyMaxLengthAlert();
  //     return;
  //   }
  //   const message:any = {
  //     nickname: loginUser.nickname,
  //     userId: loginUser.userId,
  //     studyRoomId: props.id,
  //     notice: value,
  //   };
  //   publish(message);
  // }

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
    client.current.subscribe('/sub/notice/' + props.id, (body:StompJs.Message) => {
      const message = JSON.parse(body.body);
      setNotice(message.notice)
      notify(message.nickname);
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

  // 코드 저장 함수
  function saveCode() {

    let extension = ".py";
    if (props.language === "Java") {
      extension = ".java";
    }

    const fileName = presentTime() + extension;
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
      <ContentsPopup PopupInfo={popupInfoNotice} />
      <ContentsPopup PopupInfo={popupInfoFile} />
      <ConfirmPopup PopupInfo={popupInfoExit}/>
      <div className={style.boxPadding}>
        <div className={style.boxSetting}>
          <button onClick={() => { saveButton(saveDocx(), "자료"); }}
            className={style.saveBtn}>문서저장</button>
          &nbsp;&nbsp;
          <button onClick={() => { saveCode(); }}
            className={style.saveBtn}>코드저장</button>
          &nbsp;&nbsp;
          <button onClick={() => { setPopupStatusFile(true); }}
            className={style.saveBtn}>자료보기</button>
        </div>
        <h2 className={style.notice}>{notice}</h2>
        <div className={style.leftBtnBox}>
          <button onClick={() => { setPopupStatusNotice(true) }}
            className={style.saveBtn}>공지변경</button>
            &nbsp;&nbsp;
          <button onClick={() => { setPopupStatus(true); }}
            className={style.saveBtn}>나가기</button>
        </div>
      </div>
    </div>
  );
}

// 공지변경 알림 토스트메시지
function notify(name: string) {

  let sentence = name + '님이 공지를 변경하였습니다.';
  if (name == undefined) {
    sentence = '공지가 변경되었습니다.';
  }

  toast(sentence, {
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

// 공지변경 알림 토스트메시지
function notifyMaxLengthAlert() {

  let sentence = "최대 길이를 초과하였습니다.";
  toast(sentence, {
    duration: 2000,
    icon: '⚠️',
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