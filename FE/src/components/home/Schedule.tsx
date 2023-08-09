import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Schedule.module.css';
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
    let [data, setData] = useState<ISchedule[]>([] as ISchedule[]);

    useEffect(()=>{
        // const today = new Date().toISOString().slice(0,10)
        const date = "2023-08-03";
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
      <div className={`col-12 ${style.box_schedule}`}>
        <div className={`col-12 mb40 ${style.subtitle_schedule}`}>오늘 예정된 스터디</div>
        <div className={`col-12`}>
          {data.length > 0 ? data.map((item, index) => <ScheduleListItem key={index} data={item} />) : <div className={`col-12 ${style.no_data}`}>예정된 스터디가 없습니다</div>}
        </div>
      </div>
    );
};
const ScheduleListItem = ({data} : {data: ISchedule}) => {
    return (
      <div className={`col-12 ${style.schedule_wrap}`}>
        <div className={`col-12 ${style.time_info}`}>
          <div className={`col-12 ${style.from_to}`}>
            <span>{data.startTime.slice(11, 16)}</span>
            <img src={arrow} alt="" />
            <span>{data.endTime.slice(11, 16)}</span>
          </div>
          <div className={`col-12 ${style.duration}`}>{}</div>
        </div>
        <div className={`col-12 ${style.timer_text}`}>{getTimeLeft(data.startTime)}</div>
      </div>
    );
  };

  function getTimeLeft(startTime:string | undefined):string{
    let now = "2023-08-03T06:20:06.739Z"
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

export default Schedule;