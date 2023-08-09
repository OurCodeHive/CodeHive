import { useState } from 'react';
import { StudyType } from '@/type/StudyType';
import { CheckUserId } from '@/atom/UserAtom';
import StudyViewStyle from '@/res/css/module/StudyView.module.css';
import SettingIcon from '@/res/img/30x30_setting_icon.png';
import StudyQuitIcon from '@/res/img/logout.png';


const StudyViewMenu = ({Contents} : {Contents: StudyType}) => {
  const leaderFlag:boolean = CheckUserId(Contents?.users_id as number);
  const [PopupFlag, setPopupFlag] = useState(false);

  const AlertPopupInfo = {
    PopupStatus : PopupFlag,
    zIndex : 9999,
    maxWidth: 440,
    PopupTitle : "",
    ClosePopuProp : () => changePopupFlag(false),
  }

  const changePopupFlag = (flag: boolean) => {
      setPopupFlag(() => flag);
  };

  return (
    <ul className={`col-12 tr ${StudyViewStyle.study_view_menu_con}`}>
      {
        leaderFlag ?
        <li>
          <div>
            <img src={SettingIcon} alt="세팅 아이콘"/><br/>
            스터디 변경
          </div>
        </li>
        : null
      }
      <li>
        <div>
          <img src={StudyQuitIcon} alt="나가기 아이콘"/><br/>
          나가기
        </div>
      </li>
      <li>
        <div>
          <img src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/30X30_mypage.png" alt="마이페이지 아이콘"/><br/>
          마이페이지
        </div>
      </li>
    </ul>
  )
}

export default StudyViewMenu;
