import React, { Component } from 'react'
import {useState} from 'react-router-dom'
import style from "@/res/css/module/Timer.module.css"

  const Timer = () => {
    let [show1, setShow1] = useState<boolean>(false);
    const hr = 0;
    const min = 0;
    const sec = 0;

    const hours = hr*3600000;
    const minutes = min*60000;
    const seconds = sec*1000;
    const setTime = hours + minutes + seconds;
    const startTime = Date.now();
    const futureTime = startTime + setTime;

    const timerLoop = setInterval(countDownTimer);
    function countDownTimer(){
      const currentTime = Date.now();
      const remainingTime = futureTime - currentTime;
      const angle = (remainingTime / setTime)*360;


    }
    function temp(){
      

      
    }

      return (
        <>
        <div className={style.container_timer}>
          <div>Timer</div>
          <div className={`${style.circle_container} ${style.center}`}>
              <div style={show1? {display : "none"}:{} } className={style.semicircle}></div>
              <div className={style.semicircle}></div>
              <div className={style.semicircle}></div>
              <div className={style.outermost_circle}></div>
          </div>
        </div>
        </>
      )
  }


export default Timer
