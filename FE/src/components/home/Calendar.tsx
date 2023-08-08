import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Calendar.module.css';
import data from './CalendarData';
import Schedule from './Schedule';
import { authHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';

interface Schedule {
    study_title: string;
    date: string;
    start_time: string;
    end_time: string;
}
interface CalendarData {
  calendar : Schedule[],
  message : string,
}
function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
//   const [data, setData] = useState<Schedule[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<Schedule[]>([]);
  const [showPopover, setShowPopover] = useState(false); // State to control popover visibility

  useEffect(()=>{
    


    // setData(data);
  },[])

  function getCalendar(){
   
    async function requestCalendar(): Promise<void> {
        try {
            const response: AxiosResponse<CalendarData> = await authHttp.get<CalendarData>(`/calendar/study?user={pk}`);
            console.log(response.data);
            const {calendar} = response.data;
            if(calendar){
                
            }
            console.log(calendar);
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
    const date = new Date();
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
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getFullYear() === currYear && scheduleDate.getMonth() === currMonth && scheduleDate.getDate() === i;
      });
    
      const scheduleElements = daySchedules.map((schedule, index) => (
        <div key={`schedule-${i}-${index}`}>
          {schedule.study_title}
        </div>
      ));
      
      liTags.push(
        <li key={`curr-${i}`} 
        className={`${isToday ? style.active : ''} ${daySchedules.length > 0 ? style.hasSchedule : ''}`}
        onClick={() => handleDateClick(i, daySchedules)}
        // data-schedule={scheduleTitle}
        >{i}
        {/* {scheduleElements} */}
        </li>);
    }
    

    for (let i = lastDayOfMonth; i < 6; i++) {
      liTags.push(<li key={`next-${i}`} className={style.inactive}>{i - lastDayOfMonth + 1}</li>);
    }

    return liTags;

    
  };
  const handleDateClick = (day:number, daySchedules:Schedule[]) => {
    const selectedDate = new Date(currYear, currMonth, day+1);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log(`Schedules for ${formattedDate}:`);
    console.log(daySchedules);
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
      {selectedDateInfo.map((schedule, index) => (
        <>
        <br />
        <div className={style.study_title} key={`popover-schedule-${index}`}>
          {schedule.study_title} 
        </div>
        <div>{schedule.start_time} - {schedule.end_time}</div>
        <hr />
        </>
      ))}
    </div>
    )
  );

  return (
    <div className={style.wrapper}>
      <header className={style.header}>
        <p className={style.current_date}>{months[currMonth]} {currYear}</p>
        <div className={style.icons}>
          <span id="prev" className={style.material_symbols_rounded} onClick={() => handleIconClick("prev")}>&#9664;</span>
          <span id="next" className={style.material_symbols_rounded} onClick={() => handleIconClick("next")}>&#9654;</span>
        </div>
      </header>
      <div className={style.calendar}>
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
