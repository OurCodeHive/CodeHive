import React from 'react';
import homeBgImg from '@/res/img/home_background.jpg';
import HomeStyle from '@/res/css/page/AppHome.module.css';
import Lnb from '@/components/inc/Lnb';
import Comedy from '@/components/home/Comedy';
import Timer from '@/components/home/Timer';
import CalendarApp from '@/components/home/Calendar';
import Schedule from '@/components/home/Schedule';
const AppHome = () => {
    return (
        <div className="col-12 sub_wrap">
            <div className="col-12 sub_con" style={{backgroundImage: `url(${homeBgImg})`}}>
                <div className="col-12 sub_contents" style={{backgroundColor: "#ffffffa0"}}>    
                    <Lnb/>
                    <div className="col-12">
                        <div className="col-12 col-md-6 pl-md-15 pr-md-15">
                            <div className="col-12 mb20"><Comedy></Comedy></div>
                            <div className="col-12"><Timer></Timer></div>
                        </div>
                        <div className="col-12 col-md-6 pl-md-15 pr-md-15">
                            <div className="col-12 mb20"><CalendarApp></CalendarApp></div>
                            <div className="col-12"><Schedule></Schedule></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppHome;