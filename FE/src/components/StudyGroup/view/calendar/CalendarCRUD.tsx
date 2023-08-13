import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/ViewSchedule.module.css';
import { authHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
import StudyCalendar from './StudyCalendar';
import SchedulePopover from './SchedulePopover';
import AddPopover from './AddPopover';
import EditPopover from './EditPopover';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';

const studyinfo_id = 3;

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

function CalendarCRUD() {
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

    useEffect(()=>{
      getCalendar().then().catch(console.log);
    },[])
  
function getCalendar():Promise<Schedule[]> {
    return new Promise<Schedule[]>((resolve, reject) => {
        authHttp.get<Schedule[]>(`/study/meeting/${studyinfo_id}`)
            .then((response: AxiosResponse<Schedule[]>) => {
                const calendar = response.data;
                if (calendar) {
                    setData(calendar);
                }
                resolve(response.data);
            })
            .catch((error: AxiosError) => {
                console.log(error);
                reject(error);
            });
    });
}

  const handleDateClick = (day:number, daySchedules:Schedule[]) => {
    const selectedDate = new Date(currYear, currMonth, day+1);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setClickedDate(formattedDate);
    setSelectedDateInfo(daySchedules);
    setShowPopover(true);
  }

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
          console.error("스케줄 삭제 에러 :", error);
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
  const isScheduleOverlapping = (studyStartTime:string, studyEndTime:string, id?:number):boolean => {
    const newStartTime = new Date(`${clickedDate} ${studyStartTime}`); //시간만 있는 형태
    const newEndTime = new Date(`${clickedDate} ${studyEndTime}`); // 날짜 + 시간형태로 변환
    const newSelectedDateInfo = selectedDateInfo.filter((schedule)=>schedule.id !== id)
    const overlappingSchedule = newSelectedDateInfo.find(schedule => {
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

  const handleAddSchedule = async ():Promise<void> => {
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
        const newData = await getCalendar();
   
        const maxId = Math.max(...newData.map(schedule => schedule.id as number));
        const newId = maxId;

        const newSchedule = {
            endTime : `1970-01-01 ${studyEndTime}`,
            id : newId,
            meetingAt : clickedDate,
            startTime : `1970-01-01 ${studyStartTime}`,
            title : studyTitle,
        };

        setData(newData);
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
    if(isScheduleOverlapping(editSchedule?.startTime as string, editSchedule?.endTime as string, editSchedule?.id)){
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
      <StudyCalendar
        currMonth={currMonth}
        currYear={currYear}
        currentDate={currentDate}
        data={data}
        handleDateClick={handleDateClick}
      />
      <SchedulePopover
        showPopover={showPopover}
        selectedDateInfo={selectedDateInfo}
        setShowPopover={setShowPopover}
        handleShowAddPopover={handleShowAddPopover}
        handleShowEditPopover={handleShowEditPopover}
        handleDeleteSchedule={handleDeleteSchedule}
        clickedDate={clickedDate}
      />
      {showAddPopover && 
      <AddPopover
        setStudyStartTime={setStudyStartTime}
        setStudyEndTime={setStudyEndTime}
        setStudyTitle={setStudyTitle}
        setShowAddPopover={setShowAddPopover}
        handleAddSchedule={handleAddSchedule}
      />
    }
    {showEditPopover &&
      <EditPopover
        setShowEditPopover={setShowEditPopover}
        editSchedule={editSchedule}
        setEditSchedule={setEditSchedule}
        handleEditSchedule={handleEditSchedule}
      />
    }
    </div>
  );
}

export default CalendarCRUD;
