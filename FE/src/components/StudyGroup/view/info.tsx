import { useState } from 'react';
import { StudyType } from '@/type/StudyType';
import StudyViewStyle from '@/res/css/page/StudyView.module.css';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import StudyViewEnterIcon from '@/res/img/study_view_enter_icon_img.png';
import StudyViewMemberIcon from '@/res/img/study_view_member_icon_img.png';
import StudyViewCalendarIcon from '@/res/img/study_view_calendar_icon_img.png';
import MemberList from '../MemberList';
import { ContentsPopup } from "@/utils/Popup";

const StudyViewInfo = ({Contents, LeaderFlag} : {Contents: StudyType, LeaderFlag: boolean}) => {
  const enterName = Contents.enterName ? Contents.enterName : "notFound";


    // 멤버 보기
    const [memberPopupFlag, setmemberPopupFlag] = useState(false);
    const changememberPopupFlag = (flag: boolean) => { setmemberPopupFlag(() => flag) }
    const memberPopUpInfo = {
      PopupStatus : memberPopupFlag,
      zIndex : 9999,
      maxWidth: 800,
      ClosePopupProp : () => changememberPopupFlag(false),
      PopupTitle : "일정 보기",
      PopupContents : <MemberList ClosePopupProp={() => changememberPopupFlag(false)}/>,
    }

  return (
    <div className={`col-12 ${StudyViewStyle.study_view_top_content_con}`}>
          <div className={`col-12 ${StudyViewStyle.study_view_top_profile_img}`}></div>
          <div className={`col-12 ${StudyViewStyle.study_view_top_btn_wrap}`}>
            <div className={`col-12 ${StudyViewStyle.study_view_top_btn_con}`}>
              <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}>
                <a href={`/ide/${enterName}`} className={`col-12 ${StudyViewStyle.study_view_top_btn_inner} bg_point0`}>
                  <img src={StudyViewEnterIcon} alt="화살표 아이콘" /><br/>
                  <span>입장하기</span>
                </a>
              </div>
              {LeaderFlag
                ? 
                <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}
                onClick={() => changememberPopupFlag(true)}
                >
                  <ContentsPopup PopupInfo={memberPopUpInfo}/>
                  <div className={`col-12 ${StudyViewStyle.study_view_top_btn_inner}`}>
                    <img src={StudyViewMemberIcon} alt="멤버 아이콘" /><br/>
                    <span>멤버보기</span>
                  </div>
                </div>
                : null
              }
              <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}>
                    <div onClick={console.log} className={`col-12 ${StudyViewStyle.study_view_top_btn_inner}`}>
                      <img src={StudyViewCalendarIcon} alt="시계 아이콘" /><br/>
                      <span>일정보기</span>
                    </div>
                  </div>
            </div>
          </div>
          <div className={`col-12 ${StudyViewStyle.study_view_top_info_con}`}>
            <div className="col-12 title">{Contents?.title}</div>
            <div className="col-12 desc">{Contents?.endAt} ~ {Contents?.endAt}</div>
            <div className="col-12 sub_title"><CustomEditorResult param={Contents?.description as string}/></div>
          </div>
        </div>
  )
}

export default StudyViewInfo;
