import { useState } from 'react';
import InviteConfirm from '@/components/StudyGroup/invite/Confirm';
import { AlertPopup } from '@/utils/Popup';
import { Link } from 'react-router-dom';

const InviteInput = ({refreshList, closePopup} : {refreshList: () => void, closePopup: (flag: boolean) => void}) => {

  const [userStudyId, setUserStudyId] = useState(-1);
  const [PopupTitle, setPopupTitle] = useState("잘못된 링크입니다. 다시 확인해주세요");
  const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
  const [AlertPopupClose, setAlertPopupClose] = useState(() => changeAlertPopupFlag);
  const [ConfirmPopupFlag, setConfirmPopupFlag] = useState(false);
  const AlertPopupInfo = {
    PopupStatus : AlertPopupFlag,
    zIndex : 10000,
    maxWidth: 440,
    ClosePopupProp : AlertPopupClose,
    PopupTitle : PopupTitle
 }
 function changeAlertPopupFlag() {
  setAlertPopupFlag(() => false);
 }

 function completeAlertPopupFlag() {
  setAlertPopupFlag(() => false);
  closePopup(false);
  refreshList();
 }
 
  function changePopupFlag(flag: boolean) {
    setConfirmPopupFlag(() => false);
    setAlertPopupClose(() => completeAlertPopupFlag);
    if(flag) setPopupTitle("수락 완료하였습니다"); //수락을 눌렀을 때
    else setPopupTitle("거절 완료하였습니다"); //거절을 눌렀을 때
      
    setAlertPopupFlag(() => true);
  }

  function checkLink(){
    const LinkInput = document.getElementById("InviteInput") as HTMLInputElement;
    const origin = window.location.origin + "/invite";
    if(LinkInput.value.indexOf(origin) != 0 || LinkInput.value.indexOf("userstudy_id") == -1){
      setPopupTitle("잘못된 링크입니다. 다시 확인해주세요");
      setAlertPopupClose(() => changeAlertPopupFlag);
      setAlertPopupFlag(() => true);
      return; 
    }
    const result = Number(LinkInput.value.substring(LinkInput.value.indexOf("userstudy_id") + 13, LinkInput.value.length).split("&")[0]);
    setUserStudyId(() => result);
    setConfirmPopupFlag(() => true);

  }

  function enter(e:React.KeyboardEvent<HTMLInputElement>):void {
      if(e.key === 'Enter') checkLink();
  }

  return (
    <div className="col-12">
        <div className="col-12 mb17 form_style_0_con">
          <div className="col-12 form_style_0">
            <div className="col-12 col-md-0 label_box">
              <label htmlFor="InviteInput">초대링크 입력</label>
            </div>
            <div className="col-12 col-md-0 input_box">
              <input type="text" className="input_style_0" id="InviteInput" onKeyDown={(e)=>{enter(e)}} />
            </div>
          </div>
        </div>
        <div className="col-12 tc btn_style_0_con">
            <button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={() => closePopup(false)}>취소</button>
            <button type="button" className="btn_style_0 bg_point0" onClick={() => checkLink()}>입력</button>
        </div>
        <InviteConfirm studyinfoId={userStudyId} PopupFlag={ConfirmPopupFlag} confirmPopup={changePopupFlag} />
        <AlertPopup PopupInfo={AlertPopupInfo} />
    </div>
  )
}

export default InviteInput;