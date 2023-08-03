import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Home.module.css';
import arrow from '@/res/img/icon_arrow.png';
import { authHttp, nonAuthHttp } from '@/api/http';
import moment, { ISO_8601 } from 'moment';
import { start } from 'repl';
import { format } from 'path';

const Schedule = () => {
    let [schedules, setSchedules] = useState<ISchedule[] | undefined>();

    useEffect(()=>{
        // const today = new Date().toISOString().slice(0,10)
        const today = "2023-08-02";
        authHttp.get(`/today/study?today=${today}`).then((res)=>{
            setSchedules(res.data.today);//[{},{},{}]
            console.log(res.data.today);
        })
    },[])

    return (
        <div>
            <div className={`${style.box_schedule}`}>
            <div className={`${style.subtitle_schedule}`}>오늘 예정된 스터디</div>
                <div className={style.content}>
                <div className={style.schedule_wrap}>

                <div className={style.time_info}>
                    <div className={style.from_to}><span>06:43</span><img src={arrow} alt="" /> <span>09:10 </span></div>
                    <div className={style.duration}> 2h 27m</div>
                </div>

                <div className={style.timer_wrap}>
                    <div className={style.timer_text}>남은 시간 : 8시간 11분</div>
                </div>

                </div>
                    <ScheduleList schedules={schedules} />
                    <ScheduleList schedules={schedules} />
                </div>
            </div>
        </div>
    );
};
interface ISchedule {
    startTime? : string | undefined;
}
// interface ISchedule {
//     schedule : {
//         startTime? : string | undefined;
//     }
//     startTime? : string | undefined;
// }
const ScheduleList:any= (props:{schedules:ISchedule[] | void}) => {
// function ScheduleList(props:{schedules:ISchedule[]}){
    // interface ISchedules {
    //     schedule : {
    //         startTime? : string;
    //     }
    // }
   
    function getTimeLeft(startTime:string | undefined):string{
        let now = moment().toISOString();
        // let startAt = moment("2023-08-02T05:22:43.512Z");
        let startAt = moment(startTime);
        console.log("now = "+now);
        console.log("startAt = "+startAt.toISOString());
        let hours = moment.duration(startAt.diff(moment())).hours();
        let mins = moment.duration(startAt.diff(moment())).minutes();
        let seconds = moment.duration(startAt.diff(moment())).seconds();
        // let duration = moment(moment.utc(moment(startAt)).diff(moment(now))).days();
        console.log(hours +" "+ mins +" "+ seconds);
    
        if(hours<=0 && mins<=0 && seconds<=0){
            return "지난 스터디입니다";
        } else {
            return `남은 시간:${hours}시간 ${mins}분`;
        }
    }
 
    props.schedules?.map((schedule:ISchedule)=>{
        return (
            <>
            <div className={style.schedule_wrap}>
                <div className={style.time_info}>
                    <div className={style.from_to}><span>06:43</span><img src={arrow} alt="" /> <span>09:10 </span></div>
                    <div className={style.duration}>2h 27m</div>
                </div>
    
                <div className={style.timer_wrap}>
                    <div className={style.timer_text}>{getTimeLeft(schedule.startTime)}</div>
                </div>
            </div>
        </>
    )})
}
export default Schedule;

// import React, { useEffect, useState } from 'react';
// import style from '@/res/css/module/Home.module.css';
// import arrow from '@/res/img/icon_arrow.png';
// import { nonAuthHttp } from '@/api/http';
// import {Cookies} from 'react-cookie';
// const Schedule = () => {
//     let [schedules, setSchedules] = useState<string[]>([]);
//     useEffect(()=>{
//         const today = new Date().toISOString().slice(0,10)
//         nonAuthHttp.get(`/today/study?today=${today}`).then((res)=>{
//             setSchedules(res.data.today);//[{},{},{}]
//             console.log(res.data.today);
//         })
//     },[])
//     return (
//         <div>
//             <div className={`${style.box_schedule}`}>
//             <div className={`${style.subtitle_schedule}`}>오늘 예정된 스터디</div>
//                 <div className={style.content}>
//                 <div className={style.schedule_wrap}>

//                 <div className={style.time_info}>
//                     <div className={style.from_to}><span>06:43</span><img src={arrow} alt="" /> <span>09:10 </span></div>
//                     <div className={style.duration}> 2h 27m</div>
//                 </div>

//                 <div className={style.timer_wrap}>
//                     <div className={style.timer_text}>남은 시간 : 8시간 11분</div>
//                 </div>

//                 </div>
//                     <ScheduleList schedules={schedules} />
//                     <ScheduleList schedules={schedules} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// function ScheduleList(props:{schedules:string[]}){
//     return (
//         <>
//         <div className={style.schedule_wrap}>

//             <div className={style.time_info}>
//                 <div className={style.from_to}><span>06:43</span><img src={arrow} alt="" /> <span>09:10 </span></div>
//                 <div className={style.duration}> 2h 27m</div>
//             </div>

//             <div className={style.timer_wrap}>
//                 <div className={style.timer_text}>남은 시간 : 8시간 11분</div>
//             </div>

//         </div>
//         </>
//     )
// }



// export default Schedule;