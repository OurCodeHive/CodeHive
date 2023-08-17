import React, { useCallback, useEffect, useState } from 'react';
import style from '@/res/css/module/ViewSchedule.module.css';

interface Schedule {
    endTime? : string;
    id?: number;
    meetingAt?: string;
    startTime?: string;
    title? : string,
}
interface CalendarProps {
    currMonth: number;
    currYear: number;
    currentDate: Date;
    data: Schedule[];
    handleDateClick: (day: number, daySchedules: Schedule[]) => void;
}

function StudyCalendar({data, handleDateClick,}:CalendarProps){
    const months = ["January", "February", "March", "April", "May", "June", "July",
                  "August", "September", "October", "November", "December"];
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
    const [currYear, setCurrYear] = useState(currentDate.getFullYear());

    const renderCalendar = useCallback(() => {
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
          const scheduleDate = new Date(schedule.meetingAt as string);
            return scheduleDate.getFullYear() === currYear && scheduleDate.getMonth() === currMonth && scheduleDate.getDate() === i;
          });
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
            {/* {scheduleElements} */}
            </li>);
        }
        
        for (let i = lastDayOfMonth; i < 6; i++) {
          liTags.push(<li key={`next-${i}`} className={style.inactive}>{i - lastDayOfMonth + 1}</li>);
        }
    
        return liTags;
      }, [data, currMonth, currYear, currentDate, handleDateClick]);

      useEffect(()=>{
        renderCalendar();
    },[data, renderCalendar]);

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

      return (
        <>
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
  </>
)
}


export default StudyCalendar;
