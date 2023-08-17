import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import InviteConfirm from '@/components/StudyGroup/invite/Confirm';
import StudyViewBgImg from '@/res/img/codehive_study_view_bg_img.png';
import { AlertPopup } from '@/utils/Popup';

const AppInvite = () => {
  const navigate = useNavigate();

  function notUser(flag: boolean): void {
    changeAlertPopupFlag(false);
    navigate("/login");
  }

  function goHome(flag: boolean): void {
    changeAlertPopupFlag(false);
    navigate("/home");
  }

  const [PopupTitle, setPopupTitle] = useState("비회원입니다<br/>로그인 후 다시 시도해주세요");
  const [AlertPopupClose, setAlertPopupClose] = useState(() => notUser);
  const [ConfirmPopupFlag, setConfirmPopupFlag] = useState(true);
  const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
  const AlertPopupInfo = {
     PopupStatus : AlertPopupFlag,
     zIndex : 10000,
     maxWidth: 440,
     ClosePopupProp : AlertPopupClose,
     PopupTitle : PopupTitle
  }
  const userId = useRecoilValue(userState).userId;
  const userStudyId = Number(new URLSearchParams(location.search).get("userstudy_id"));
  useEffect(() => {
    if(userId == -1){
      setConfirmPopupFlag(() => false);
      changeAlertPopupFlag(true);
    }
  }, []);
  
  function changeAlertPopupFlag(flag: boolean){
    setAlertPopupFlag(() => flag);
  }

  function changePopupFlag(flag: boolean) {
      setConfirmPopupFlag(() => false);
      setAlertPopupClose(() => goHome);
      if(flag) setPopupTitle("수락 완료하였습니다"); //수락을 눌렀을 때
      else setPopupTitle("거절 완료하였습니다"); //거절을 눌렀을 때
      
      setAlertPopupFlag(() => true);
  }

  return (
    <div className="col-12 sub_wrap">
      <div className="col-12 sub_con" style={{backgroundImage: `url(${StudyViewBgImg})`, height: '100%'}}>
        <div className="col-12 sub_contents">
          <InviteConfirm studyinfoId={userStudyId} PopupFlag={ConfirmPopupFlag} confirmPopup={changePopupFlag} />
        </div>
      </div>
      <AlertPopup PopupInfo={AlertPopupInfo} />
    </div>
  )
}

export default AppInvite;
