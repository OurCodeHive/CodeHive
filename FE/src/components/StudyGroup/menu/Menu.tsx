import { useState } from 'react';
import { StudyType } from '@/type/StudyType';
import { studyQuit } from '@/api/study';
import { useRecoilValue } from 'recoil';
import { userState, CheckUserId } from '@/atom/UserAtom';
import StudyViewStyle from '@/res/css/page/StudyView.module.css';
import SettingIcon from '@/res/img/30x30_setting_icon.png';
import StudyQuitIcon from '@/res/img/logout.png';
import myPageIcon from '@/res/img/30X30_mypage.png';
import { AlertPopup, ConfirmPopup, ContentsPopup } from "@/utils/Popup";
import UpdateStudyInfo from '../update/UpdateStudyInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import { authHttp } from '@/api/http';
import toast, { Toaster } from 'react-hot-toast';


const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const StudyViewMenu = ({Contents, fetchData} : {Contents?: StudyType, fetchData?:any}) => {
  const navigate = useNavigate();
  const userId = useRecoilValue(userState).userId;
  const leaderFlag:boolean = CheckUserId(Contents?.users_id as number);
  const location = useLocation();
  const isHome = location.pathname === "/home";
  const [PopupFlag, setPopupFlag] = useState(false);

  const changePopupFlag = (flag: boolean) => {
      setPopupFlag(() => flag);
  };
  const [PopupTitle, setPopupTitle] = useState("");
  const [AlertPopupClose, setAlertPopupClose] = useState(() => changePopupFlag);

  const AlertPopupInfo = {
    PopupStatus : PopupFlag,
    zIndex : 9999,
    maxWidth: 440,
    PopupTitle : PopupTitle,
    ClosePopupProp : AlertPopupClose,
  }

  const [popupStatus, setPopupStatus] = useState(false);
  const popupInfoLogout = {
    PopupStatus: popupStatus,
    zIndex: 999,
    maxWidth: 400,
    PopupTitle: "<br>로그아웃 하시겠습니까?",
    ClosePopupProp : () => setPopupStatus(false),
    ConfirmPopupProp : () => doLogout()
  }

  // 스터디 수정
  const [updatePopupFlag, setupdatePopupFlag] = useState(false);
  const StudyUpdate = {
    studyinfoId : studyinfoId,
    title : Contents?.title + "",
    profile : Contents?.profileImage + "",
    startAt : Contents?.startAt + "",
    endAt : Contents?.endAt + "",
    description : Contents?.description + "",
  }
  const studyUpdateChangePopupFlag = (flag: boolean) => { setupdatePopupFlag(() => flag) }
  const updatePopUpInfo = {
    PopupStatus : updatePopupFlag,
    zIndex : 9999,
    maxWidth: 800,
    ClosePopupProp : () => studyUpdateChangePopupFlag(false),
    PopupTitle : "스터디 수정",
    PopupContents : <UpdateStudyInfo fetchData={fetchData} studyUpdate={StudyUpdate} closePopup={() => studyUpdateChangePopupFlag(false)}/>,
    ConfirmPopupProp : () => studyUpdateChangePopupFlag(false),
  }
  function doLogout() {
    const aT = localStorage.getItem("accessToken");
    console.log(aT);
    const data = {
        accessToken : aT,
    }
    authHttp.post('/logout',data).then(()=>{
      // notifyLogout()  
      localStorage.removeItem("accessToken");
        localStorage.removeItem("expireAt");
        localStorage.removeItem("timerState");
        sessionStorage.removeItem("sessionStorage");
        navigate("/login");
    }).catch((err)=>{
        console.log(err);
        navigate("/login");
    })
}

//스터디 나가기
const [leavePopupFlag, setLeavePopupFlag] = useState(false);
const ChangeLeavePopupFlag = (flag: boolean) => { setLeavePopupFlag(() => flag) }
type leaveResultProps = {
  isLeave : boolean
}
function goHome(flag: boolean): void {
  changePopupFlag(false);
  navigate("/home");
}
const ConfirmLeavePopup = async () => {
  console.log(Contents!.studyinfoId)
  const param = {
    studyinfoId : Contents!.studyinfoId,
    userId : userId
  }
  await studyQuit(param, ({data} : { data : leaveResultProps }) => {
    const result = data.isLeave;
    if(result){
       setPopupTitle(() => "스터디를 성공적으로 탈퇴하였습니다.");
       setAlertPopupClose(() => goHome);
    } else setPopupTitle(() => "다른 스터디원에게 방장을 위임하셔야 탈퇴할 수 있습니다.");
    changePopupFlag(true);
  }, (error) => console.log(error));
}
const leavePopupInfo = {
  PopupStatus : leavePopupFlag,
  PopupTitle : "스터디를 나가시겠습니까?",
  zIndex : 9999,
  maxWidth: 440,
  ClosePopupProp : () => ChangeLeavePopupFlag(false),
  ConfirmPopupProp : () => void ConfirmLeavePopup()
}

  return (
    <ul className={`col-12 tr ${StudyViewStyle.study_view_menu_con}`}>
      {
        leaderFlag ?
        <li>
          <div>
            <img src={SettingIcon} alt="세팅 아이콘"
              onClick={() => studyUpdateChangePopupFlag(true)}
            /><br/>
            스터디 변경
          </div>
          <ContentsPopup PopupInfo={updatePopUpInfo} />
        </li>
        : null
      }
      {
        isHome?
        <li>
          <div onClick={() => { setPopupStatus(true) }}>
            <img src={StudyQuitIcon} alt="로그아웃 아이콘"/><br/>
            로그아웃
          </div>
          <Toaster position="top-right" />
          <ConfirmPopup PopupInfo={popupInfoLogout}/>
        </li>
        :
        <li>
          <div onClick={() => ChangeLeavePopupFlag(true)}>
            <img src={StudyQuitIcon} alt="나가기 아이콘"/><br/>
            나가기
          </div>
          <ConfirmPopup PopupInfo={leavePopupInfo} />
          <AlertPopup PopupInfo={AlertPopupInfo}/>
        </li>
      }
      {/* <li>
        <div>
          <img src={myPageIcon} alt="마이페이지 아이콘"/><br/>
          마이페이지
        </div>
      </li> */}
    </ul>
  )
}

function notifyLogout() {

  let sentence = "로그아웃 되었습니다.";
  toast(sentence, {
    duration: 2000,
    icon: '🙋‍♂️',
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

export default StudyViewMenu;
