import React from 'react';
import homePicture from '@/res/img/home_background.jpg';
import style from '@/res/css/module/Home.module.css'
import Intro from './Intro';
import Comedy from './Comedy';
import Schedule from './Schedule';
function Background(){
    return (
        <div className={style.dash_background}>
            <div className={style.home_background}>
                <div className={style.home_filter}>

                    <Intro></Intro>
                    <Comedy></Comedy>

                    <Schedule></Schedule>

                </div>
            </div>
        </div>
    );
};

export default Background;