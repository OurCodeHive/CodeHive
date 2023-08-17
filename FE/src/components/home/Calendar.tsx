import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Calendar.module.css';
import Schedule from './Schedule';
import { authHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';

interface Schedule {
  endTime: string;
  id: number;
  meetingAt: string;
  startTime: string;
  title : string,
}
interface CalendarData {
  calendar : Schedule[],
  message : string,
}
interface PopoverProps {
  isPopoverRight : boolean,
}
function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
  const [data, setData] = useState<Schedule[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<Schedule[]>([]);
  const [showPopover, setShowPopover] = useState(false); // State to control popover visibility
  const [clickedDate, setClickedDate] = useState<string>("");

  const loginUser = useRecoilValue(userState);
  const pk = loginUser.userId;

  useEffect(()=>{
    getCalendar();
  },[])

  function getCalendar(){
    async function requestCalendar(): Promise<void> {
        try {
            const response: AxiosResponse<CalendarData> = await authHttp.get<CalendarData>(`/calendar/study?user=${pk}`);
            const {calendar} = response.data;
            if(calendar){
              setData(calendar)
            }
        } catch (error) {
            const err = error as AxiosError
            console.log(err);
        }
    }
    requestCalendar()
}

  const months = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
    const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
    const lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
    const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTags:JSX.Element[] = [];

    for (let i = firstDayOfMonth; i > 0; i--) {
      liTags.push(<li key={`prev-${i}`} className={style.inactive}>{lastDateOfLastMonth - i + 1}</li>);
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday = i === currentDate.getDate() && currMonth === currentDate.getMonth() && currYear === currentDate.getFullYear();
    //   const scheduleTitle = data.find(schedule => schedule.date === `${currYear}-${(currMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`)?.study_title || '';
      const daySchedules = data.filter(schedule => {
        const scheduleDate = new Date(schedule.startTime);
        return scheduleDate.getFullYear() === currYear && scheduleDate.getMonth() === currMonth && scheduleDate.getDate() === i;
      });

     //만약 캘린더 자체에 일정 표시할거면 쓰였을 코드 (liTags 에 {scheduleElements} 추가)
      const scheduleElements = daySchedules.map((schedule, index) => (
        <div key={`schedule-${i}-${index}`}>
          {schedule.title}
        </div>
      ));
      
      liTags.push(
        <li key={`curr-${i}`} 
        className={`${isToday ? style.active : ''} ${daySchedules.length > 0 ? style.hasSchedule : ''}`}
        onClick={() => handleDateClick(i, daySchedules)}
        >{i}
        </li>
      );
    }

    for (let i = lastDayOfMonth; i < 6; i++) {
      liTags.push(<li key={`next-${i}`} className={style.inactive}>{i - lastDayOfMonth + 1}</li>);
    }

    return liTags;
  };

  const handleDateClick = (day:number, daySchedules:Schedule[]) => {
    const selectedDate = new Date(currYear, currMonth, day+1);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setClickedDate(formattedDate);
    // console.log(`Schedules for ${formattedDate}:`);
    // console.log(daySchedules);
    if (selectedDateInfo.length === 0) {
      setSelectedDateInfo(daySchedules);
      setShowPopover(true);
    } else {
      setSelectedDateInfo([]);
      setShowPopover(false);
    }
  }

  const handleIconClick = (iconId:string) => {
    setCurrMonth(prevMonth => iconId === "prev" ? prevMonth - 1 : prevMonth + 1);

    if (currMonth < 0 || currMonth > 11) {
      const newDate = new Date(currYear, currMonth, currentDate.getDate());
      setCurrYear(newDate.getFullYear());
      setCurrMonth(newDate.getMonth());
    } else {
      setCurrentDate(new Date());
    }
  };

  const renderPopover = () => (
    showPopover && (
    <div className={style.popover}>
      <div className={style.popover_title}>{clickedDate}</div>
      {selectedDateInfo.map((schedule, index) => (
        <div className={style.study_item} key={`popover-schedule-${index}`}>
        <div className={style.study_title} key={`popover-schedule-${index}`}>
          {schedule.title} 
        </div>
        <div>{schedule.startTime.slice(11,16)} - {schedule.endTime.slice(11,16)}</div>
        </div>
      ))}
    </div>
    )
  );

  return (
    <div className={`col-12 ${style.wrapper}`}>
      <header className={`col-12 ${style.header}`}>
        <p className={style.current_date}>{months[currMonth]} {currYear}</p>
        <div className={style.icons}>
          <span id="prev" className={style.material_symbols_rounded} onClick={() => handleIconClick("prev")}>&#9664;</span>
          <span id="next" className={style.material_symbols_rounded} onClick={() => handleIconClick("next")}>&#9654;</span>
        </div>
      </header>
      <div className={`col-12 ${style.calendar}`}>
        <ul className={style.weeks}>
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className={style.days}>
          {renderCalendar()}
        </ul>
      </div>
      {selectedDateInfo.length > 0 && renderPopover()}
    </div>
  );
}

export default CalendarApp;
