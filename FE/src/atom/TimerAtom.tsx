
// import { atom } from "recoil";

// const timerState = atom({
//     key: "timerState",
//     default: {
//       initialHours: 0,
//       initialMinutes: 5,
//       initialSeconds: 0,
//       hours: 0,
//       minutes: 5,
//       seconds: 0,
//       isRunning: false,
//     },
//   });

//   export default timerState;

import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
interface TimerState {
    resetHours: number;
    resetMinutes: number;
    resetSeconds: number;
    initialHours: number;
    initialMinutes: number;
    initialSeconds: number;
    hours: number;
    minutes: number;
    seconds: number;
    isRunning: boolean;
  }

const timerState = atom<TimerState>({
  key: "timerState",
//   default: {
//     initialHours: 0,
//     initialMinutes: 5,
//     initialSeconds: 0,
//     hours: 0,
//     minutes: 5,
//     seconds: 0,
//     isRunning: false,
//   },
    default : getInitialTimerState(),
});

const saveTimerStateToLocalStorage = (timerState: TimerState) => {
  localStorage.setItem("timerState", JSON.stringify(timerState));
};

function getInitialTimerState(): TimerState {
    const storedTimerState = localStorage.getItem("timerState");
    if (storedTimerState) {
      return JSON.parse(storedTimerState) as TimerState;
      
    } else {
      // Set your initial timer state here
      return {
        resetHours: 0,
        resetMinutes: 0,
        resetSeconds: 0,
        initialHours: 0,
        initialMinutes: 0,
        initialSeconds: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isRunning: false,
      };
    }
  }

export const useTimerState = () => {
  const [timer, setTimer] = useRecoilState(timerState);

  const startTimer = () => {
    setTimer((prevTimer) => ({
      ...prevTimer,
      isRunning: true,
    }));
  };

  const stopTimer = () => {
    setTimer((prevTimer) => ({
      ...prevTimer,
      isRunning: false,
    }));
  };

  const resetTimer = () => {
    setTimer((prevTimer) => ({
      ...prevTimer,
      isRunning: false,
      initialHours: prevTimer.resetHours,
      initialMinutes: prevTimer.resetMinutes,
      initialSeconds: prevTimer.resetSeconds,
      hours: prevTimer.resetHours,
      minutes: prevTimer.resetMinutes,
      seconds: prevTimer.resetSeconds,
    }));
  };

  // Save the timer state to local storage whenever it changes
  useEffect(() => {
    saveTimerStateToLocalStorage(timer);
  }, [timer]);

  return { timer, setTimer, startTimer, stopTimer, resetTimer };
};
