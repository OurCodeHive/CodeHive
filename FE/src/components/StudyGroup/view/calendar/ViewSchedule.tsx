import React, { useEffect, useState } from 'react';
import style from './ViewSchedule.module.css';
import { authHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
import Schedule from '@/components/home/Schedule';
//임의의 studyinfo_id => 상세페이지 반영 시 query에서 가져오도록 수정 필요
///////////////////////////
const studyinfo_id = 3; ///
///////////////////////////

interface Schedule {
    endTime? : string;
    id?: number;
    meetingAt?: string;
    startTime?: string;
    title? : string,
}
interface editSchedule {
  title? : string,
  date? : string,
  startTime? : string,
  endTime? : string,
  id? : number
}

function ViewSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
  const [data, setData] = useState<Schedule[]>([]);
  const [selectedDateInfo, setSelectedDateInfo] = useState<Schedule[]>([]);
  const [showPopover, setShowPopover] = useState(false); 
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [clickedDate, setClickedDate] = useState<string>("");
  const [showEditPopover, setShowEditPopover] = useState(false);
  let [studyTitle, setStudyTitle] = useState<string>("");
  let [studyStartTime, setStudyStartTime] = useState<string>("");
  let [studyEndTime, setStudyEndTime] = useState<string>("");
  const [editSchedule, setEditSchedule] = useState<editSchedule | null>(null);

  const parsedPk = JSON.parse(sessionStorage.getItem("sessionStorage") as string) as { useState: { userId: string } };
  const pk = parsedPk.useState.userId;

  useEffect(()=>{
    getCalendar();
  },[])

  function getCalendar(){
    async function requestCalendar(): Promise<void> {
        try {
            const response: AxiosResponse<Schedule[]> = await authHttp.get<Schedule[]>(`/study/meeting/${studyinfo_id}`);
            const calendar = response.data;
            if(calendar){
              console.log(calendar);
              setData(calendar);
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

    
  };
  const handleDateClick = (day:number, daySchedules:Schedule[]) => {
    const selectedDate = new Date(currYear, currMonth, day+1);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    // console.log(`Schedules for ${formattedDate}:`);
    setClickedDate(formattedDate);
    setSelectedDateInfo(daySchedules);
    setShowPopover(true);
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
          setData((prevData)=>{return prevData.filter(schedule => schedule.id !== id)})
          resolve();    
        } catch (error) {
          console.error("Error deleting schedule:", error);
          reject(error);
        }
      } else {
        resolve();
      }
    });
  };
  
  const handleShowAddPopover = () => {
    setShowAddPopover((prevShowAddPopover) => !prevShowAddPopover); 
  };

  const handleShowEditPopover = (schedule: Schedule) => {
    let editData = {
      title : schedule.title as string,
      date : clickedDate,
      startTime : schedule.startTime?.slice(11,16),
      endTime : schedule.endTime?.slice(11,16),
      id : schedule.id,
    }
    setEditSchedule(editData);
    setShowEditPopover((prevShowEditPopover) => !prevShowEditPopover);
  };
  const renderPopover = () => (
    showPopover && (
      <div className={style.popover_right}>
        <div className={style.popover_title}>{clickedDate}</div>
        {selectedDateInfo.length === 0 ? (
          <div className={style.no_study_text}>예정된 스터디가 없습니다</div>
        ) : (
        selectedDateInfo.map((schedule, index) => (
        <>
          <div key={`popover-schedule-${index}`} className={style.schedule_item}>
            <div className={style.study_info}>
              <div className={style.study_title}>{schedule.title}</div>
              <div className={style.actions}>
                <span onClick={() => handleDeleteSchedule(schedule.id as number)} className={style.action_icon}>&#128465;</span> {/* Trashcan icon */}
                <span onClick={() => handleShowEditPopover(schedule)} className={style.action_icon}>&#9998;</span> {/* Pencil icon */}
              </div>
            </div>
            <div className={style.study_schedules}>
              {schedule.startTime?.slice(11,16)} - {schedule.endTime?.slice(11,16)}
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
  const renderAddPopover = () => (
    <div className={` ${style.add_popover}`}>
          <div className={style.add_popover_title}>일정 추가</div>
          <div className={style.input_wrapper}>
            <label htmlFor="addStudyTitle">제목</label>
            <input className={style.title_input} onChange={(e)=>{setStudyTitle(e.target.value)}} type="text" id='addStudyTitle'/>
          </div>
          <div className={style.input_wrapper}>
            <label htmlFor="addStudyStart">시작</label>
            <input onChange={(e)=>{setStudyStartTime(e.target.value)}} type="time" id='addStudyStart'/>
          </div>
          <div className={style.input_wrapper}>
            <label htmlFor="addStudyEnd">종료</label>
            <input onChange={(e)=>{setStudyEndTime(e.target.value)}} type="time" id='addStudyEnd'/>
          </div>
          <div className={`${style.input_wrapper} ${style.button_wrapper}`}>
            <button onClick={handleShowAddPopover}>취소</button>
            <button onClick={handleAddSchedule} >등록</button>
          </div>
        </div>
  )
  const renderEditPopover = () => (
    <div className={`${style.add_popover} ${style.edit_popover}`}>
          <div className={style.add_popover_title}>일정 수정</div>
          <div className={style.input_wrapper}>
            <label htmlFor="addStudyTitle">제목</label>
            <input  onChange={(e) =>
          setEditSchedule({ ...editSchedule, title: e.target.value })
        } value={editSchedule?.title || ''} className={style.title_input} type="text" id='addStudyTitle'/>
          </div>
          <div className={style.input_wrapper}>
            <label htmlFor="addStudyStart">시작</label>
            <input onChange={(e) =>
          setEditSchedule({ ...editSchedule, startTime:`${e.target.value}`})} value={editSchedule?.startTime} type="time" id='addStudyStart'/>
          </div>
          <div className={style.input_wrapper}>
            <label htmlFor="addStudyEnd">종료</label>
            <input onChange={(e) =>
          setEditSchedule({ ...editSchedule, endTime:`${e.target.value}`})} value={editSchedule?.endTime} type="time" id='addStudyEnd'/>
          </div>
          <div className={`${style.input_wrapper} ${style.button_wrapper}`}>
            <button onClick={()=>setShowEditPopover(false)}>취소</button>
            <button onClick={handleEditSchedule} >수정</button>
          </div>
    </div>
  )
  const isScheduleOverlapping = (studyStartTime:string, studyEndTime:string):boolean => {
    const newStartTime = new Date(`${clickedDate} ${studyStartTime}`); //시간만 있는 형태
    const newEndTime = new Date(`${clickedDate} ${studyEndTime}`); // 날짜 + 시간형태로 변환

    const overlappingSchedule = selectedDateInfo.find(schedule => {
      const scheduleStartTime = new Date(schedule.startTime as string);
      const scheduleEndTime = new Date(schedule.endTime as string);
  
      return ( //새로 등록하는 일정의 시작시간 OR 끝 시간이 기존 일정 사이에 있거나 / 기존일정 전/후에 있을 때
        newStartTime >= scheduleStartTime && newStartTime < scheduleEndTime ||
        newEndTime > scheduleStartTime && newEndTime <= scheduleEndTime ||
        newStartTime <= scheduleStartTime && newEndTime >= scheduleEndTime
      );
    });

    return overlappingSchedule? true : false;
  }

  const handleAddSchedule = async () => {
    const newStudy = {
      title: studyTitle,
      date: clickedDate,
      startTime: studyStartTime,
      endTime: studyEndTime,
    };
    if(studyTitle === "" || studyStartTime === "" || studyEndTime === ""){
        alert("제목, 시작 시간 및 종료시간을 모두 입력해주세요")
        return;
    }
    if (new Date(`${clickedDate} ${studyEndTime}`) <= new Date(`${clickedDate} ${studyStartTime}`)) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    if(studyTitle.split("").length > 20){
      alert("제목은 20자 이하로 지정해주세요");
      return;
    }
    if(isScheduleOverlapping(studyStartTime, studyEndTime)){
      alert("일정이 해당 날짜의 다른 스케줄과 겹칩니다");
      return;
    }
    if (confirm("새로운 일정을 등록하시겠습니까? 생성된 일정은 스터디에 속한 팀원 모두에게 공유됩니다.")) {
      try {
        await authHttp.post(`/study/meeting/${studyinfo_id}`, newStudy);
        // Calculate the new ID based on the largest existing ID
        const maxId = Math.max(...data.map(schedule => schedule.id as number));
        const newId = maxId + 1;

        // Create the new schedule with the calculated ID
        const newSchedule = {
            endTime : `1970-01-01 ${studyEndTime}`,
            id : newId,
            meetingAt : clickedDate,
            startTime : `1970-01-01 ${studyStartTime}`,
            title : studyTitle,
        };
        console.log(newId);
      setData(prevData => [...prevData, newSchedule]);
      setSelectedDateInfo(prevSelectedDateInfo => [
        ...prevSelectedDateInfo,
        newSchedule,
      ]);
      setShowPopover(true); 
      handleShowAddPopover(); 

      } catch (error) {
        console.error("Error registering schedule:", error);
      }
    }
  };

  const handleEditSchedule = async() => {
    const newStudy = { //(전송용 폼)
      title: editSchedule?.title,
      date: clickedDate,
      startTime: editSchedule?.startTime,
      endTime: editSchedule?.endTime,
    };
    const setDataForm:Schedule = { //(다시 setData => 상태 업데이트 하기 위한 폼)
      endTime : `${clickedDate} ${editSchedule?.endTime as string}`,
      id: editSchedule?.id,
      meetingAt: `${clickedDate} ${editSchedule?.startTime as string}`,
      startTime: `${clickedDate} ${editSchedule?.startTime as string}`,
      title : editSchedule?.title
    }
    if(editSchedule?.title === "" || editSchedule?.startTime === "" || editSchedule?.endTime === ""){
        alert("제목, 시작 시간 및 종료시간을 모두 입력해주세요")
        return;
    }
    if (new Date(`${clickedDate} ${editSchedule?.endTime as string}`) <= new Date(`${clickedDate} ${editSchedule?.startTime as string}`)) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    if(isScheduleOverlapping(editSchedule?.startTime as string, editSchedule?.endTime as string)){
      alert("일정이 해당 날짜의 다른 스케줄과 겹칩니다");
      return;
    }
    if(editSchedule?.title){
      if(editSchedule.title.split("").length> 20){
        alert("제목은 20자 이하로 지정해주세요");
        return;
      }
    }
    if (confirm("일정을 수정하시겠습니까?")) {
      try {
        await authHttp.put(`/study/${studyinfo_id}/meeting/${editSchedule?.id as number}`, newStudy); ///study/{studyinfo_id}/meeting/{appointment_id}
    
      // 캘린더 데이터 업데이트
      setData((prevData)=> {
        return prevData.map((schedule) => schedule.id === editSchedule?.id? setDataForm : schedule);
      });
      // 팝오버 데이터 업데이트
      setSelectedDateInfo((prevSelectedDateInfo) => 
        prevSelectedDateInfo.map((schedule) => schedule.id===editSchedule?.id? setDataForm : schedule)
      )
      setShowPopover(true); 
      setShowEditPopover(false); 

      } catch (error) {
        console.error("Error registering schedule:", error);
      }
    }
  }
  
  
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
      {showAddPopover && renderAddPopover()}
      {showEditPopover && renderEditPopover()}
    </div>

  );
}

export default ViewSchedule;
