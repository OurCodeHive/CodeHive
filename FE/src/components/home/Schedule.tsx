import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Schedule.module.css';
import arrow from '@/res/img/icon_arrow.png';
import { authHttp } from '@/api/http';
import moment from 'moment';

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
        const today = new Date().toISOString().slice(0,10)
        authHttp.get<ScheduleData>(`/today/study?today=${today}`).then((res)=>{
            const {today} = res.data;
            if(today){
                setData(today);
            }
        }).catch(console.log);
    },[])

    return (
      <div className={`col-12 ${style.box_schedule}`}>
        <div className={`col-12 mb20 ${style.subtitle_schedule}`}>오늘 예정된 스터디</div>
        <div className={`col-12 ${style.schedule_list_wrapper}`}>
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
          <div className={`col-12 ${style.duration}`}>{`${getDuration(data.startTime, data.endTime)[0]}hr ${getDuration(data.startTime, data.endTime)[1]}min`}</div>
        </div>
        <div className={`col-12 ${style.timer_text}`}>{getTimeLeft(data.startTime, data.endTime)}</div>
      </div>
    );
  };

  function getUTCTime(){
    // const curr = new Date();
    const offset = 1000 * 60 * 60 * 9
    const seoul = new Date((new Date()).getTime() + offset)
    return seoul.toISOString();
  }

  function getDuration(startTime:string, endTime:string):number[]{
    const startAt = moment(startTime);
    const endAt = moment(endTime);
    const hrs = moment.duration(endAt.diff(startAt)).hours();
    const mins = moment.duration(endAt.diff(startAt)).minutes();
    return[hrs,mins];
  }

  function getTimeLeft(startTime:string | undefined, endTime:string | undefined):string{
    //현재 한국 시간
    let now = getUTCTime();
    //시작시간, 끝 시간을 한국 시간으로 계산
    let startAt = moment(moment(startTime).valueOf() + 9 * 60 * 60 * 1000);
    let endAt = moment(moment(endTime).valueOf() + 9 * 60 * 60 * 1000);
    // console.log("now = "+now);
    // console.log("startAt = "+startAt.toISOString());

    //현재 시간과 시작시간의 차이를 계산
    let hours = moment.duration(startAt.diff(moment(now))).hours();
    let mins = moment.duration(startAt.diff(moment(now))).minutes();
    let seconds = moment.duration(startAt.diff(moment(now))).seconds();

    //현재 시간과 끝 시간의 차이를 계산
    let endHours = moment.duration(endAt.diff(moment(now))).hours();
    let endMins = moment.duration(endAt.diff(moment(now))).minutes();
    let endSeconds = moment.duration(endAt.diff(moment(now))).seconds();

    //계산한 데이터를 바탕으로 예외 처리
    if((hours<=0 && mins<=0 && seconds<=0) && (endHours>0 || endMins>0 || endSeconds>0)){
        return "진행중인 스터디입니다";
    } else if (hours<=0 && mins<=0 && seconds<=0) {
      return "지난 스터디입니다";
    } else {
        return `남은 시간 : ${hours}시간 ${mins}분`;
    }
}

export default Schedule;