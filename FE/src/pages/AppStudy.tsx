import Lnb from "@/components/inc/Lnb";
import StudyView from "@/components/StudyGroup/view";
import StudyViewBgImg from '@/res/img/codehive_study_view_bg_img.png';

function AppStudy() {
  return (
    <div className="col-12 sub_wrap">
      <div className="col-12 sub_con" style={{backgroundImage: `url(${StudyViewBgImg})`}}>
        <Lnb/>
        <StudyView />
      </div>
    </div>
  )
}

export default AppStudy;
