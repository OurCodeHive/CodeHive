import React from 'react';
import { StudyType } from '@/type/StudyType';
import StudyViewStyle from '@/res/css/module/StudyView.module.css';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import StudyViewEnterIcon from '@/res/img/study_view_enter_icon_img.png';
import StudyViewMemberIcon from '@/res/img/study_view_member_icon_img.png';
import StudyViewCalendarIcon from '@/res/img/study_view_calendar_icon_img.png';

const StudyViewInfo = ({Contents} : {Contents: StudyType}) => {
  const enterName = Contents.enterName ? Contents.enterName : "notFound";

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
              <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}>
                <div className={`col-12 ${StudyViewStyle.study_view_top_btn_inner}`}>
                  <img src={StudyViewMemberIcon} alt="멤버 아이콘" /><br/>
                  <span>멤버보기</span>
                </div>
              </div>
              <div className={`col-4 ${StudyViewStyle.study_view_top_btn}`}>
                <div className={`col-12 ${StudyViewStyle.study_view_top_btn_inner}`}>
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
