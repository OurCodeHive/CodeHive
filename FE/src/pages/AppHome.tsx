import React, { useEffect, useState } from 'react';
import homeBgImg from '@/res/img/home_background.jpg';
import HomeStyle from '@/res/css/page/AppHome.module.css';
import Lnb from '@/components/inc/Lnb';
import Comedy from '@/components/home/Comedy';
import Timer from '@/components/home/Timer';
import CalendarApp from '@/components/home/Calendar';
import Schedule from '@/components/home/Schedule';
import Intro from '@/components/home/Intro';
import StudyViewMenu from '@/components/StudyGroup/menu/Menu';
import { useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { userState } from '@/atom/UserAtom';

const AppHome = () => {
    let [day, setDay] = useState<string>("");
    let loginUser = useRecoilValue(userState);
    const navigate = useNavigate();

    useEffect(()=>{
        let hours = new Date().getHours();
        if (hours < 12 && hours >= 0) {
           setDay("아침이에요");
        } else if (hours >= 12 && hours <= 18) {
            setDay("오후에요");
        } else if (19 <= hours && hours < 24) {
            setDay("저녁이에요");
        }
    },[])
    return (
        <div className="col-12 sub_wrap">
            <div className="col-12 sub_con" >
                <div className="col-12 sub_contents" style={{backgroundColor: "#ffffffa0"}}>    
                    <Lnb/>
                    <div className="col-12">
                        <div className="col-12 mb20">
                            <StudyViewMenu/>
                        </div>
                        <div className="col-12 col-md-6 pl-md-15 pr-md-15">
                        <div className={`col-12 mb30 ml25 ${HomeStyle.greeting}`}>
                            좋은 {day}, {loginUser.nickname}님
                        </div>
                            <div className="col-12 mb20 ml30"><Comedy></Comedy></div>
                            <Timer></Timer>
                        </div>
                        <div className="col-12 col-md-6 pl-md-15 pr-md-15">
                            <div className="col-12 mb20 ml30" style={{zIndex:"1"}}><CalendarApp></CalendarApp></div>
                            <div className="col-12 ml30"><Schedule></Schedule></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppHome;