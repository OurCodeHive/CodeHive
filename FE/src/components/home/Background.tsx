import React, { useEffect } from 'react';
import homePicture from '@/res/img/home_background.jpg';
import style from '@/res/css/module/Home.module.css'
import Intro from './Intro';
import Comedy from './Comedy';
import Schedule from './Schedule';
import Lnb from '../inc/Lnb';
import Timer from './Timer';
import {useTimerState} from "@/atom/TimerAtom";
import CalendarApp from './Calendar';
import toast, { Toaster } from 'react-hot-toast';



function Background(){
    const { timer, setTimer, startTimer, stopTimer, resetTimer } = useTimerState();
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
                  // alert("Timer has ended!");
                  timerFinish()
                }
              }
            }
          }, 1000);
        }
    
        return () => clearInterval(interval);
      }, [timer, setTimer]);
    return (
        // <div className={style.dash_background}>
            <div className={style.home_background}>
                <div className={style.home_filter}>
                <Toaster position="top-right" />
                    <Lnb></Lnb>
                    <Intro></Intro>
                    <div className={style.first_divisor}> 
                      <Comedy></Comedy>
                      <Timer></Timer>
                      <div>flex test</div>
                    </div >
                    <div className={style.first_divisor}>
                      <div>flex test</div>
                      <CalendarApp></CalendarApp>
                      <Schedule></Schedule>
                    </div>

                </div>
             </div>
        // </div>
    );
}


// 타이머
function timerFinish() {

  let sentence = "타이머가 종료되었습니다.";
  toast(sentence, {
    duration: 5000,
    icon: '⏰',
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

export default Background;