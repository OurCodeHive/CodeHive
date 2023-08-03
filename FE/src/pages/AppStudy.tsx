import Lnb from "@/components/inc/Lnb";
import StudyView from "@/components/StudyGroup/view";
import StudyViewBgImg from '@/res/img/codehive_study_view_bg_img.png';

function AppStudy() {
  return (
    <div className="col-12 sub_wrap">
      <Lnb/>
      <StudyView />
      <div className="col-12 bg_wrap">
        <img src={StudyViewBgImg} alt="스터디 상세페이지 배경화면" />
      </div>
    </div>
  )
}

export default AppStudy;
