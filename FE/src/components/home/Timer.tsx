import React, { useState, useEffect } from "react";
import style from '@/res/css/module/Timer.module.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRecoilState } from "recoil";
import {useTimerState} from "@/atom/TimerAtom";
import { useNavigate } from "react-router-dom";
const TimerApp: React.FC = () => {
  const { timer, setTimer, startTimer, stopTimer, resetTimer } = useTimerState();
  const [bar, setBar] = useState<number>(100);
  const navigate = useNavigate();

  // const calculateProgress = () => {
  //   const initialTotalSeconds =
  //     timer.initialHours * 3600 + timer.initialMinutes * 60 + timer.initialSeconds;
  //   const currentTotalSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
  //   // return ((initialTotalSeconds - currentTotalSeconds) / initialTotalSeconds) * 100;
  //   setBar(((initialTotalSeconds - currentTotalSeconds) / initialTotalSeconds) * 100);
  // };
  useEffect(()=>{
    const initialTotalSeconds =
      timer.initialHours * 3600 + timer.initialMinutes * 60 + timer.initialSeconds;
    const currentTotalSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
    setBar(((initialTotalSeconds - currentTotalSeconds) / initialTotalSeconds) * 100);
  }, [bar, timer])

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
              //   setTimer((prevTimer) => ({
              //   ...prevTimer,
              //   isRunning: false,
              // }));
              handleResetClick();
              alert("Timer has ended!");
            }
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer, setTimer, stopTimer, bar, resetTimer]);

const handleStartStopClick = () => {
    if (timer.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

const handleResetClick = () => {
    resetTimer();
    setBar(100);
  };

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, "0");
  };

  return (
    <>
    <div className={`col-12 ${style.timer_container}`}>
      <div className={`col-6 ${style.progress_bar_container}`}>
        <div className={`col-12 ${style.custom_progress_bar}`}>
        <CircularProgressbar 
          value={bar}
          
          text={`${formatTime(timer.hours)}:${formatTime(timer.minutes)}:${formatTime(timer.seconds)}`}
          styles={buildStyles({
            textSize : "1.4rem",
            textColor: "#fff",
            pathColor: "#1f95afaf",
            trailColor: "#9999995a",
            
          })}
          strokeWidth={5}
        />
        </div>
      </div>
      <div className={`col-6 ${style.controller}`}>
        <div className={style.subtitle_timer} >타이머로 공부 시간을 관리해보세요</div>
        <div className={style.timer_inputs}>
          <input
            type="number"
            min="0"
            value={timer.hours}
            onChange={(e) =>
              setTimer((prevTimer) => ({
                ...prevTimer,
                initialHours: parseInt(e.target.value, 10),
                hours: parseInt(e.target.value, 10),
              }))
            }
            disabled={timer.isRunning}
          />
          <span>hr</span>
          <input
            type="number"
            min="0"
            max="59"
            value={timer.minutes}
            onChange={(e) =>
              setTimer((prevTimer) => ({
                ...prevTimer,
                initialMinutes: parseInt(e.target.value, 10),
                minutes: parseInt(e.target.value, 10),
              }))
            }
            disabled={timer.isRunning}
          />
          <span>min</span>
          <input
            type="number"
            min="0"
            max="59"
            value={timer.seconds}
            onChange={(e) =>
              setTimer((prevTimer) => ({
                ...prevTimer,
                initialSeconds: parseInt(e.target.value, 10),
                seconds: parseInt(e.target.value, 10),
              }))
            }
            disabled={timer.isRunning}
          />
          <span>sec</span>
        </div>
        <div className={style.timer_buttons}>
          <button onClick={handleStartStopClick}>{timer.isRunning ? "Stop" : "Start"}</button>
          <button onClick={handleResetClick} disabled={timer.isRunning}>
            Reset
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default TimerApp;
