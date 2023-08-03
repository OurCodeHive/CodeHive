import React from 'react';
import homePicture from '@/res/img/home_background.jpg';
import style from '@/res/css/module/Home.module.css'
import Intro from './Intro';
import Comedy from './Comedy';
import Timer from './Timer'
import Schedule from './Schedule';
import Lnb from '../inc/Lnb';
function Background(){
    return (
        <div className={style.dash_background}>
            <div className={style.home_background}>
                <div className={style.home_filter}>

                    <Intro></Intro>
                    <Comedy></Comedy>
                    {/* <Lnb></Lnb> */}
                    <Schedule></Schedule>
                    {/* <Timer></Timer> */}

                </div>
            </div>
        </div>
    );
};

export default Background;