import LinkInputPopUp from "@/components/StudyGroup/invite/LinkInput";
import MessagePopUp from "@/components/StudyGroup/invite/Message";
import QuitStudyGroupButton from "@/components/StudyGroup/quit/QuitStudyGroup";
import { useState, useEffect } from "react";

const AppQuit = (props:any) => {
  return (
    <div className="col-12 sub_wrap">
      <QuitStudyGroupButton studyinfoId={props.studyinfoId}></QuitStudyGroupButton>
    </div>
  )
}

export default AppQuit;
