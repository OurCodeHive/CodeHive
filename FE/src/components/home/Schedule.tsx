import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Home.module.css';
import arrow from '@/res/img/icon_arrow.png';
import { authHttp, nonAuthHttp } from '@/api/http';
import moment, { ISO_8601 } from 'moment';
import { start } from 'repl';
import { format } from 'path';
interface ScheduleData {
    today : ISchedule[],
}
interface ISchedule {
    endTime : string,
    startTime : string,
    studyappointmentId : number,
    studyinfoId : number,
    title : string,
}
const Schedule = () => {
    let [data, setData] = useState<ISchedule[] | undefined>();

    useEffect(()=>{
        // const today = new Date().toISOString().slice(0,10)
        const date = "2023-08-09";
        authHttp.get<ScheduleData>(`/today/study?today=${date}`).then((res)=>{
            const {today} = res.data;
            if(today){
                setData(today);//[{},{},{}]
                console.log(today);
                console.log(data);
            }
        }).catch(console.log);
    },[])

    return (
        <div>
            <div className={`${style.box_schedule}`}>
            <div className={`${style.subtitle_schedule}`}>오늘 예정된 스터디</div>
                <div className={style.content}>
                {/* <div className={style.schedule_wrap}>

                <div className={style.time_info}>
                    <div className={style.from_to}><span>06:43</span><img src={arrow} alt="" /> <span>09:10 </span></div>
                    <div className={style.duration}> 2h 27m</div>
                </div>

                <div className={style.timer_wrap}>
                    <div className={style.timer_text}>남은 시간 : 8시간 11분</div>
                </div>
                </div> */}
                    <ScheduleList schedules={data} />
                </div>
            </div>
        </div>
    );
};
function getTimeLeft(startTime:string | undefined):string{
    let now = "2023-08-03T06:20:06.739Z"
    // let now = moment().toISOString();
    // let startAt = moment("2023-08-02T05:22:43.512Z");
    let startAt = moment(startTime);
    console.log("now = "+now);
    console.log("startAt = "+startAt.toISOString());
    let hours = moment.duration(startAt.diff(moment(now))).hours();
    let mins = moment.duration(startAt.diff(moment(now))).minutes();
    let seconds = moment.duration(startAt.diff(moment(now))).seconds();
    // let duration = moment(moment.utc(moment(startAt)).diff(moment(now))).days();
    console.log(`${hours} ${mins} ${seconds}`);

    if(hours<=0 && mins<=0 && seconds<=0){
        return "지난 스터디입니다";
    } else {
        return `남은 시간:${hours}시간 ${mins}분`;
    }
}
const ScheduleList: React.FC<{ schedules: ISchedule[] | void }> = (props) => {
    return (
      <div>
        {props.schedules?.map((schedule: ISchedule, i: number) => (
          <div key={i} className={style.schedule_wrap}>
            <div className={style.time_info}>
              <div className={style.from_to}>
                <span>{schedule.startTime.slice(11, 16)}</span>
                <img src={arrow} alt="" />
                <span>{schedule.endTime.slice(11, 16)}</span>
              </div>
              <div className={style.duration}>{}</div>
            </div>
  
            <div className={style.timer_wrap}>
              <div className={style.timer_text}>{getTimeLeft(schedule.startTime)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };
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