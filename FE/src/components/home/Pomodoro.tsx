import React from 'react';
import { CircularProgressbar, buildStyles} from 'react-circular-progressbar'
import style from "@/res/css/module/Pomodoro.module.css"
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import {useState, useEffect} from 'react';
import 'react-circular-progressbar/dist/styles.css';
const Pomodoro = () => {
    let [isPaused, setIsPaused] = useState(true);
    let [secondsLeft, setSecondsLeft] = useState(0);
    let [hours, setHours] = useState("00");
    let [minutes, setMinutes] = useState("00");
    let [seconds, setSeconds] = useState("00");

    function tick(){
        setSecondsLeft(secondsLeft - 1);
    }
    
    useEffect(()=>{
        initTimer();

        setInterval(()=>{
            if(isPaused){
                return;
            }
            if(secondsLeft === 0){
                //0초 남았으면 뭘해야하지?
            }
            tick();
        }, 1000)
    },[])
    
    function initTimer(){
        //전체 몇초 남았는지
        setSecondsLeft(minutes*60)
    }
    const totalSeconds = minutes*60
    const percentage = Math.round(secondsLeft / totalSeconds)
    return (
        <div>
            <div>timer</div>
            <div className={style.container_timer}>
            <CircularProgressbar value={60} text={`${hours}:${minutes}:${seconds}`} styles={buildStyles({
                textColor:"black",
                pathColor:"white",
                trailColor:"#999",
            })}></CircularProgressbar>
            <div style={{marginTop:"10px"}}>
                {
                    isPaused? 
                    <PlayButton></PlayButton>
                    :
                    <PauseButton></PauseButton>
                }
                
            </div>
            <div style={{marginTop:"10px"}}>
            </div>
                
            </div>
        </div>
    );
};

export default Pomodoro;