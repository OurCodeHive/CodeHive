import { useTimerState } from "@/atom/TimerAtom";
import Lnb from "@/components/inc/Lnb";
import StudyView from "@/components/StudyGroup/view";
import StudyViewBgImg from '@/res/img/codehive_study_view_bg_img.png';
import { useEffect } from "react";

function AppStudy() {
  const { timer, setTimer} = useTimerState();
    useEffect(() => {
        let interval: NodeJS.Timeout;
    
        if (timer.isRunning) {
          interval = setInterval(() => {
            if (timer.seconds > 0) {
                setTimer((prevTimer) => ({
                ...prevTimer,
                seconds: prevTimer.seconds - 1,
              }));
            } else {
              if (timer.minutes > 0) {
                setTimer((prevTimer) => ({
                  ...prevTimer,
                  minutes: prevTimer.minutes - 1,
                  seconds: 59,
                }));
              } else {
                if (timer.hours > 0) {
                    setTimer((prevTimer) => ({
                    ...prevTimer,
                    hours: prevTimer.hours - 1,
                    minutes: 59,
                    seconds: 59,
                  }));
                } else {
                    setTimer((prevTimer) => ({
                    ...prevTimer,
                    isRunning: false,
                  }));
                  alert("Timer has ended!");
                }
              }
            }
          }, 1000);
        }
    
        return () => clearInterval(interval);
      }, [timer, setTimer]);
  return (
    <div className="col-12 sub_wrap">
      <div className="col-12 sub_con" style={{backgroundImage: `url(${StudyViewBgImg})`}}>
        <div className="col-12 sub_contents" style={{backgroundColor: "#ffffffa0"}}>
          <Lnb/>
          <StudyView />
        </div>
      </div>
    </div>
  )
}

export default AppStudy;
