import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from "@/res/css/module/AppWelcome.module.css"
import video from '@/res/video/welcome_resized2.mp4'
// import "../res/video/Welcome.mp4"
function Welcome() {
    const navigate = useNavigate();
    return (
        <div className={style.welcome_page}>
            <video className={style.video} autoPlay muted><source src={video} type="video/mp4"/></video>
            <button onClick={()=>navigate("/login")} className={style.enter_login}></button>
        </div>
    );
}

export default Welcome;