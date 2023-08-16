import { useState } from 'react';
import { StudyType } from '@/type/StudyType';
import StudyViewStyle from '@/res/css/page/StudyView.module.css';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import StudyViewEnterIcon from '@/res/img/study_view_enter_icon_img.png';
import StudyViewMemberIcon from '@/res/img/study_view_member_icon_img.png';
import StudyViewCalendarIcon from '@/res/img/study_view_calendar_icon_img.png';
import StudyUserList from '../member/list/List';
import { ContentsPopup } from "@/utils/Popup";
import CalendarCRUD from './calendar/CalendarCRUD';


const StudyViewInfo = ({Contents, LeaderFlag} : {Contents: StudyType, LeaderFlag: boolean}) => {
  const enterName = Contents.enterName ? Contents.enterName : "notFound";


    // 멤버 보기
    const [memberPopupFlag, setmemberPopupFlag] = useState(false);
    const changeMemberPopupFlag = (flag: boolean) => { setmemberPopupFlag(() => flag) }
    const memberPopUpInfo = {
      PopupStatus : memberPopupFlag,
      zIndex : 9999,
      maxWidth: 600,
      ClosePopupProp : () => changeMemberPopupFlag(false),
      PopupTitle : "멤버 보기",
      PopupContents : <StudyUserList studyinfoId={Contents.studyinfoId} closePop={() => changeMemberPopupFlag(false)} />,
    }

    // 일정 보기(닫는 함수 프롭스로 넘기기)
    const [calendarPopupFlag, setCalendarPopupFlag] = useState(false);
    const changeCalderPopupFlag = (flag: boolean) => { setCalendarPopupFlag(() => flag) }
    const calendarPopUpInfo = {
      PopupStatus : calendarPopupFlag,
      zIndex : 9999,
      maxWidth: 800,
      ClosePopupProp : () => changeCalderPopupFlag(false),
      PopupTitle : "일정 보기",
      PopupContents : <CalendarCRUD ClosePopupProp={() => setCalendarPopupFlag(false)}/>,
    }

  return (
    <div className={`col-12 mb30 mt50 ${StudyViewStyle.study_view_top_content_con}`}>
          <div className="col-12" style={{flex:"1.2"}}>
            <div className={`col-12 ${StudyViewStyle.study_view_top_profile_img}`}><img src={Contents.profileImage} alt="프로필 이미지"/></div>
          </div>
          <div className={`col-12 ${StudyViewStyle.study_view_top_btn_wrap}`}>
            <div className={`col-12 ${StudyViewStyle.study_view_top_btn_con}`}>
              <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}>
                <a href={`/ide/${enterName}`} className={`col-12 ${StudyViewStyle.study_view_top_btn_inner} ${StudyViewStyle.study_view_top_btn_inner_enter}`}>
                  <img src={StudyViewEnterIcon} alt="화살표 아이콘" /><br/>
                  <span>입장하기</span>
                </a>
              </div>
              {LeaderFlag
                ? 
                <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}
                onClick={() => changeMemberPopupFlag(true)}
                >
                  <ContentsPopup PopupInfo={memberPopUpInfo}/>
                  <div className={`col-12 ${StudyViewStyle.study_view_top_btn_inner}`}>
                    <img src={StudyViewMemberIcon} alt="멤버 아이콘" /><br/>
                    <span>멤버보기</span>
                  </div>
                </div>
                : null
              }
              <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}
                onClick={() => {
                  setCalendarPopupFlag(true)
                }} >
                  <ContentsPopup PopupInfo={calendarPopUpInfo}/>
                <div onClick={console.log} className={`col-12 ${StudyViewStyle.study_view_top_btn_inner}`}>
                  <img src={StudyViewCalendarIcon} alt="시계 아이콘" /><br/>
                  <span>일정보기</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`col-12 ${StudyViewStyle.study_view_top_info_con}`}>
            <div className="col-12 title">{Contents?.title}</div>
            <div className="col-12 desc">{Contents?.startAt} ~ {Contents?.endAt}</div>
            <div className="col-12 sub_title"><CustomEditorResult param={Contents?.description as string}/></div>
          </div>
        </div>
  )
}

export default StudyViewInfo;
