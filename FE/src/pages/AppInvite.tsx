

// 1. (수락버튼) handleAccept라는 요청함수 만들어 둠.
//     1-1. http://localhost:8080/ 형태니까 꼭! 실서버로 변경
// 2. (거절버튼) 요청함수 안만들었음.
// 3.  async 필요.
// 4. Message의 "닫기" 누르면 URL이 invite로 유지되어있음. 여기도 redirct?
// 5. useState나 Recoil에 유저 정보를 넣어줘야하는데 이건 모르겠음.
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import InviteConfirm from '@/components/StudyGroup/invite/Confirm';
import StudyViewBgImg from '@/res/img/codehive_study_view_bg_img.png';
import { AlertPopup } from '@/utils/Popup';

const AppInvite = () => {
  const navigate = useNavigate();

  function notUser(flag: boolean){
    changeAlertPopupFlag(false);
    navigate("/login");
  }
  const [ConfirmPopupFlag, setConfirmPopupFlag] = useState(true);
  // const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
  // 

  // const AlertPopupInfo = {
  //   PopupStatus : AlertPopupFlag,
  //   zIndex : 10000,
  //   maxWidth: 440,
  //   ClosePopupProp : notUser(false),
  //   PopupTitle : "비회원 접근입니다"
  // }

  // const userId = useRecoilValue(userState).userId;
  // if(userId == -1){
  //   setAlertPopupFlag(() => true);
  //   setConfirmPopupFlag(() => false);
  // }
  
  function changeAlertPopupFlag(flag: boolean){
    setAlertPopupFlag(() => flag);
  }

  
  const userStudyId = Number(new URLSearchParams(location.search).get("userstudy_id"));

  console.log(userStudyId);

  function changePopupFlag(flag: boolean) {
      setConfirmPopupFlag(() => false);
  }

  return (
    <div className="col-12 sub_wrap">
      <div className="col-12 sub_con" style={{backgroundImage: `url(${StudyViewBgImg})`, height: '100%'}}>
        <div className="col-12 sub_contents">
          <InviteConfirm studyinfoId={userStudyId} PopupFlag={ConfirmPopupFlag} closePopup={changePopupFlag} confirmPopup={changePopupFlag} />
        </div>
      </div>
    </div>
  )
}

export default AppInvite;
