import { useState } from 'react';
import { userState } from '@/atom/UserAtom';
import { useRecoilValue } from 'recoil';


function NoticeChangeModal({closePopup, publish, studyRoomId, notifyMaxLengthAlert}:{closePopup: () => void, publish:any, studyRoomId:string, notifyMaxLengthAlert:any}) {
  // 로그인 유저 정보
  const loginUser = useRecoilValue(userState);
  const [notice, setNotice] = useState("");

  function handleNotice(event: any) {
    if (event.target.value.length > 100) {
      return
    }
    setNotice(event.target.value);
  }

  function changeNotice() {
    // const value = window.prompt("공지사항을 입력해 주세요.");
    const value = notice;
    if (value === "" || value === null) {
      closePopup();
      return;
    }
    if (value.length > 50) {
      notifyMaxLengthAlert();
      return;
    }
    const message:any = {
      nickname: loginUser.nickname,
      userId: loginUser.userId,
      studyRoomId: studyRoomId,
      notice: value,
    };
    publish(message);
    closePopup();
  }

  return (
    <div className="col-12">
      <h1 style={{
        textAlign:"center"
      }}>공지사항을 입력해 주세요.</h1>
      <br></br>
      <input
        type="text" id="studyInsertTitle" className="input_style_0"
        placeholder="공지사항을 입력해주세요"
        value={notice} onChange={handleNotice}/>
      <br></br>
      <br></br>
      <div className="col-12 tc btn_style_0_con">
        <button className="btn_style_0 mr15 bg_point0" onClick={() => {
          changeNotice();
        }}>변경</button>
         <button className="btn_style_0 bg_a2a2a2"  onClick={() => {
          closePopup();
        }}>취소</button>
      </div>
    </div>
  )
}


export default NoticeChangeModal;