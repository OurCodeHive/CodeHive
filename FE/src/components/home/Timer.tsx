import React, { useState, useEffect } from "react";
import style from '@/res/css/module/Timer.module.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRecoilState } from "recoil";
import {useTimerState} from "@/atom/TimerAtom";
import { useNavigate } from "react-router-dom";
import { timerState } from "@/atom/TimerAtom";
const TimerApp: React.FC = () => {
//   const [realTimer, setRealTimer] = useRecoilState(timerState);
  const { timer, setTimer, startTimer, stopTimer, resetTimer } = useTimerState();
  const navigate = useNavigate();

//   useEffect(() => {
//     const storedTimerState = localStorage.getItem("timerState");
//     console.log(storedTimerState);
//     if (storedTimerState) {
//         setTimer(JSON.parse(storedTimerState));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("timerState", JSON.stringify(timer));
//   }, [timer]);

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

//   const handleStartStopClick = () => {
//     setRealTimer((prevTimer) => ({
//       ...prevTimer,
//       isRunning: !prevTimer.isRunning,
//     }));
//   };
const handleStartStopClick = () => {
    if (timer.isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

//   const handleResetClick = () => {
//     setRealTimer((prevTimer) => ({
//       ...prevTimer,
//       isRunning: false,
//       hours: prevTimer.initialHours,
//       minutes: prevTimer.initialMinutes,
//       seconds: prevTimer.initialSeconds,
//     }));
//   };
const handleResetClick = () => {
    resetTimer();
  };

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, "0");
  };

  return (
    <div className={style.timer_containe}>
      <h1>Timer</h1>
      <div className={style.progress_bar_container}>
        <CircularProgressbar
          value={
            (timer.initialHours * 3600 +
              timer.initialMinutes * 60 +
              timer.initialSeconds -
              (timer.hours * 3600 + timer.minutes * 60 + timer.seconds)) /
            (timer.initialHours * 3600 +
              timer.initialMinutes * 60 +
              timer.initialSeconds) *
            100
          }
          text={`${formatTime(timer.hours)}:${formatTime(timer.minutes)}:${formatTime(timer.seconds)}`}
          styles={buildStyles({
            textColor: "black",
            pathColor: "#007bff",
            trailColor: "#ddd",
          })}
        />
      </div>
      <div className={style.timer_inputs}>
        <input
          type="number"
          min="0"
          value={timer.hours}
          onChange={(e) =>
            setTimer((prevTimer) => ({
              ...prevTimer,
              hours: parseInt(e.target.value, 10),
            }))
          }
          disabled={timer.isRunning}
        />
        <span>h</span>
        <input
          type="number"
          min="0"
          max="59"
          value={timer.minutes}
          onChange={(e) =>
            setTimer((prevTimer) => ({
              ...prevTimer,
              minutes: parseInt(e.target.value, 10),
            }))
          }
          disabled={timer.isRunning}
        />
        <span>m</span>
        <input
          type="number"
          min="0"
          max="59"
          value={timer.seconds}
          onChange={(e) =>
            setTimer((prevTimer) => ({
              ...prevTimer,
              seconds: parseInt(e.target.value, 10),
            }))
          }
          disabled={timer.isRunning}
        />
        <span>s</span>
      </div>
      <div className={style.timer_buttons}>
        <button onClick={handleStartStopClick}>{timer.isRunning ? "Stop" : "Start"}</button>
        <button onClick={handleResetClick} disabled={timer.isRunning}>
          Reset
        </button>
      </div>
      <button onClick={()=>{navigate("/home")}}>home</button>
    </div>
  );
};

export default TimerApp;
