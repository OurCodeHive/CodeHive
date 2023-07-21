// import React from 'react';
import style from "../res/css/module/AppWelcome.module.css"

import video from '../res/video/Welcome.mp4'
// import "../res/video/Welcome.mp4"
function Welcome() {
    return (
        <>
        {/* <div className={style.frame}>
            <img src="../public/contents/CodeHive_Logo.png" alt="" />
            <img className={style.text_logo} src="../public/contents/CodeHiveMainTextLogo.png" alt="" />
            <img src="../public/contents/MainText.png" alt="" />
            <img src="../public/contents/ScrollText.png" alt="" />

        </div> */}
        
        <video className={style.video} autoPlay muted>
            <source src={video} type="video/mp4"/>
        </video>
        {/* <h1>hello</h1> */}
        <div></div>
        <button className={style.enter_login}>here!</button>
        
        {/* <img src="../public/contents/CodeHiveMainPic.png" alt="" /> */}
        </>
    );
}

export default Welcome;