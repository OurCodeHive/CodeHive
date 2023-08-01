import React, { useState } from 'react';
import style from '@/res/css/module/Home.module.css';
import arrow from '@/res/img/icon_arrow.png';
const Schedule = () => {
    let [schedules, setSchedules] = useState<string[]>([]);
    return (
        <div>
            <div className={`${style.box} ${style.box_schedule}`}>
            <div className={`${style.subtitle_schedule}`}>오늘 예정된 스터디</div>
                <div className={style.content}>
                    <ScheduleList schedules={schedules} />
                    <ScheduleList schedules={schedules} />
                    <ScheduleList schedules={schedules} />
                    <ScheduleList schedules={schedules} />
                </div>
            </div>
        </div>
    );
};

function ScheduleList(props:{schedules:string[]}){
    return (
        <>
        <div className={style.schedule_wrap}>

            <div className={style.time_info}>
                <div className={style.from_to}><span>06:43</span><img src={arrow} alt="" /> <span>09:10 </span></div>
                <div className={style.duration}> 2h 27m</div>
            </div>

            <div className={style.timer_wrap}>
                <div className={style.timer_text}>남은 시간 : 30분 11초</div>
            </div>

        </div>
        </>
    )
}



export default Schedule;