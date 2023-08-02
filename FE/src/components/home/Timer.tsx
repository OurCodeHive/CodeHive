import React, { Component } from 'react'
import style from "@/res/css/module/Timer.module.css"

  const Timer = () => {
      return (
        <>
        <div className={style.container_timer}>
          <div>Timer</div>
          <div className={`${style.circle_container} ${style.center}`}>
              <div className={style.semicircle}></div>
              <div className={style.semicircle}></div>
              <div className={style.semicircle}></div>
              <div className={style.outermost_circle}></div>
          </div>
        </div>
        </>
      )
  }


export default Timer
