import React from 'react';
import style from "../res/css/module/AppWelcome.module.css"

function Welcome() {
    return (
        <>
        {/* <div className={style.frame}>
            <img src="../public/contents/CodeHive_Logo.png" alt="" />
            <img className={style.text_logo} src="../public/contents/CodeHiveMainTextLogo.png" alt="" />
            <img src="../public/contents/MainText.png" alt="" />
            <img src="../public/contents/ScrollText.png" alt="" />

        </div> */}
        <h2>hello</h2>
        <video className={style.video} autoPlay muted>
            <source src="../res/video/Welcome.mp4" type="video/mp4"/>
        </video>
        <button>here!</button>
        
        {/* <img src="../public/contents/CodeHiveMainPic.png" alt="" /> */}
        </>
    );
}

export default Welcome;