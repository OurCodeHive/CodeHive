import React, { useEffect, useState } from 'react';
import style from './ViewSchedule.module.css';
// import data from '@/components/home/CalendarData';
// import Schedule from './Schedule';
import { authHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
const studyinfo_id = 3;

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

function ViewSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
  const [data, setData] = useState<Schedule[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<Schedule[]>([]);
  const [showPopover, setShowPopover] = useState(false); // State to control popover visibility
  const [showAddPopover, setShowAddPopover] = useState(false);
  const parsedPk = JSON.parse(sessionStorage.getItem("sessionStorage") as string);
  const pk = parsedPk.useState.userId;

  useEffect(()=>{
    getCalendar();
    console.log(data);
  },[])

  function getCalendar(){
   
    async function requestCalendar(): Promise<void> {
        try {
            const response: AxiosResponse<Schedule[]> = await authHttp.get<Schedule[]>(`/study/meeting/${studyinfo_id}`);
            console.log(response.data);
            const calendar = response.data;
            if(calendar){
              console.log(calendar);
              setData(calendar);
              console.log(data);
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
        const scheduleDate = new Date(schedule.meetingAt);
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
    // if (selectedDateInfo.length === 0 || selectedDateInfo[0].meetingAt.slice(0,10) !== formattedDate) {
      setSelectedDateInfo(daySchedules);
      setShowPopover(true);
    // } 
    // else {
    //   setSelectedDateInfo([]);
    //   setShowPopover(false);
    // }

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
  };//

  const handleDeleteSchedule = (id: number) => {
    return new Promise<void>( (resolve, reject) => {
      if (confirm("스터디 일정을 삭제하시겠습니까?")) {
        try {
          void authHttp.delete(`/study/${studyinfo_id}/meeting/${id}`);
          setSelectedDateInfo(prevSelectedDateInfo =>
            prevSelectedDateInfo.filter(schedule => schedule.id !== id)
          );
          resolve(); // Resolve the Promise if successful
        } catch (error) {
          console.error("Error deleting schedule:", error);
          reject(error); // Reject the Promise if an error occurs
        }
      } else {
        resolve(); // Resolve the Promise if user cancels deletion
      }
    });
  };
  
  
  const renderPopover = () => (
    showPopover && (
      <div className={style.popover_right}>
        {selectedDateInfo.length === 0 ? (
          <div className={style.no_study_text}>예정된 스터디가 없습니다</div>
        ) : (
        selectedDateInfo.map((schedule, index) => (
        <>
          <div key={`popover-schedule-${index}`} className={style.schedule_item}>
            <div className={style.study_info}>
              <div className={style.study_title}>{schedule.title}</div>
              <div className={style.actions}>
                <span onClick={() => handleDeleteSchedule(schedule.id)} className={style.action_icon}>&#128465;</span> {/* Trashcan icon */}
                <span className={style.action_icon}>&#9998;</span> {/* Pencil icon */}
              </div>
            </div>
            <div className={style.study_schedules}>
              {schedule.startTime.slice(11,16)} - {schedule.endTime.slice(11,16)}
            </div>
          </div>
          <hr />
          </>
        ))
      )}
        <div onClick={handleShowAddPopover} className={style.add_icon}>&#43;</div> {/* Add icon */}
      </div>
    )
  );
  
  const handleShowAddPopover = () => {
    setShowAddPopover(true);
  };

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
      {showPopover && renderPopover()}
      {showAddPopover && (
        <div className={` ${style.add_popover}`}>
          <div>add a schedule</div>
        </div>
      )}
    </div>

  );
}

export default ViewSchedule;
