import LinkInputPopUp from "@/components/StudyGroup/invite/LinkInput";
import MessagePopUp from "@/components/StudyGroup/invite/Message";
import QuitStudyGroupButton from "@/components/StudyGroup/quit/QuitStudyGroup";
import StudyGroupUserList from "@/components/StudyGroup/quit/StudyGroupUser";
import { useState, useEffect } from "react";

const AppQuit = ({studyinfoId} : {studyinfoId : number}) => {
  return (
    <div className="col-12 sub_wrap">
      <QuitStudyGroupButton studyinfoId={studyinfoId}></QuitStudyGroupButton>
      <StudyGroupUserList studyinfoId={studyinfoId} page={0} size={10}></StudyGroupUserList>
    </div>
  )
}

export default AppQuit;

// 음... Button을 누르면 바로 요청을 쏘려했는데... 순서가 안맞는다.
// 1. 버튼을 누르면 아래의 창을 띄우자.
//     스터디 탈퇴 시, 자료를 공유받을 수 없습니다. 그럼에도 탈퇴하시겠습니까? (예 / 아니오)
// 2. "예" 누르면 요청을 보낸다.
//    back에서는 방장을 체크하는 로직이 되어있고, 방장이면 return false
//                                             방장이 아니면 return true
//    스터디 그룹의 회원들 목록을 관리하는 중간테이블(user_study)에서 물리적으로 삭제한다.