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
import { AlertPopup, ConfirmPopup } from "@/utils/Popup";
import { useParams } from 'react-router-dom';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));
console.log(studyinfoId);

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

interface calendarInStudyMainProps {
	ClosePopupProp?: (flag: boolean) => void;
  LeaderFlag: boolean;
}



function CalendarCRUD(props:calendarInStudyMainProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
    const [currYear, setCurrYear] = useState(currentDate.getFullYear());
    const [data, setData] = useState<Schedule[]>([]);
    const [selectedDateInfo, setSelectedDateInfo] = useState<Schedule[]>([]);
    const [showPopover, setShowPopover] = useState(false); 
    const [showAddPopover, setShowAddPopover] = useState(false);
    const [clickedDate, setClickedDate] = useState<string>("");
    const [showEditPopover, setShowEditPopover] = useState(false);
    const [studyTitle, setStudyTitle] = useState<string>("");
    const [studyStartTime, setStudyStartTime] = useState<string>("");
    const [studyEndTime, setStudyEndTime] = useState<string>("");
    
    const [editSchedule, setEditSchedule] = useState<editSchedule | null>(null);

    // alert title
    const [AlertPopupTitle, setAlertPopupTitle] = useState<string>("");
    const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
    const AlertPopupInfo = {
        PopupStatus : AlertPopupFlag,
        zIndex : 10000,
        maxWidth: 600,
        PopupTitle : AlertPopupTitle,
        ClosePopupProp : () => changePopupFlag(false),
    }
    const [CurIdx, setCurIdx] = useState(-1);
    const [ConfirmDeletePopupFlag, setConfirmDeletePopupFlag] = useState(false);
    const changeConfirmDeletePopupFlag = (flag: boolean) => {
        setConfirmDeletePopupFlag(() => flag);
    };
    const ConfirmDeletePopupInfo = {
      PopupStatus : ConfirmDeletePopupFlag,
      zIndex : 10000,
      maxWidth: 440,
      PopupTitle : "삭제하시겠습니까?",
      ClosePopupProp : () => changeConfirmDeletePopupFlag(false),
      ConfirmPopupProp : () => void deleteSchedule()
    }

    const changePopupFlag = (flag: boolean) => {
        setAlertPopupFlag(() => flag);
    };

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
  const deleteSchedule = async () => {
    await new Promise<void>( (resolve, reject) => {
      try {
        void authHttp.delete(`/study/${studyinfo_id}/meeting/${CurIdx}`);
        setSelectedDateInfo(prevSelectedDateInfo =>
          prevSelectedDateInfo.filter(schedule => schedule.id !== CurIdx)
        );
        setData((prevData)=>{return prevData.filter(schedule => schedule.id !== CurIdx)})
        changeConfirmDeletePopupFlag(false);
        resolve();    
      } catch (error) {
        console.error("스케줄 삭제 에러 :", error);
        reject(error);
      }
  });
}

  const handleDeleteSchedule = (id: number) => {
    setCurIdx(() => id);
    changeConfirmDeletePopupFlag(true);
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

  const [ConfirmAddPopupFlag, setConfirmAddPopupFlag] = useState(false);
    const changeConfirmAddPopupFlag = (flag: boolean) => {
        setConfirmAddPopupFlag(() => flag);
    };
    const ConfirmAddPopupInfo = {
      PopupStatus : ConfirmAddPopupFlag,
      zIndex : 10000,
      maxWidth: 440,
      PopupTitle : "새로운 일정을 등록하시겠습니까?<br/>생성된 일정은 팀원 모두에게 공유됩니다.",
      ClosePopupProp : () => changeConfirmAddPopupFlag(false),
      ConfirmPopupProp : () => void addSchedule()
    }

  const addSchedule = async () => {
    const newStudy = {
      title: studyTitle,
      date: clickedDate,
      startTime: studyStartTime,
      endTime: studyEndTime,
    };

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
      changeConfirmAddPopupFlag(false);
    } catch (error) {
      console.error("Error registering schedule:", error);
    }
  }

  const handleAddSchedule = () => {
    if(studyTitle === "" || studyStartTime === "" || studyEndTime === ""){
        // alert("제목, 시작 시간 및 종료시간을 모두 입력해주세요")
        setAlertPopupTitle("제목, 시작 시간 및 종료시간을 모두 입력해주세요");
        changePopupFlag(true);
        return;
    }
    if (new Date(`${clickedDate} ${studyEndTime}`) <= new Date(`${clickedDate} ${studyStartTime}`)) {
      // alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      setAlertPopupTitle("종료 시간은 시작 시간보다 늦어야 합니다.");
      changePopupFlag(true);
      return;
    }
    if(studyTitle.split("").length > 20){
      // alert("제목은 20자 이하로 지정해주세요");
      setAlertPopupTitle("제목은 20자 이하로 지정해주세요");
      changePopupFlag(true);
      return;
    }
    if(isScheduleOverlapping(studyStartTime, studyEndTime)){
      // alert("일정이 해당 날짜의 다른 스케줄과 겹칩니다");
      setAlertPopupTitle("일정이 해당 날짜의 다른 스케줄과 겹칩니다");
      changePopupFlag(true);
      return;
    }
    changeConfirmAddPopupFlag(true);
  };

  const [ConfirmEditPopupFlag, setConfirmEditPopupFlag] = useState(false);
    const changeConfirmEditPopupFlag = (flag: boolean) => {
        setConfirmEditPopupFlag(() => flag);
    };
    const ConfirmEditPopupInfo = {
      PopupStatus : ConfirmEditPopupFlag,
      zIndex : 10000,
      maxWidth: 440,
      PopupTitle : "일정을 수정하시겠습니까?",
      ClosePopupProp : () => changeConfirmEditPopupFlag(false),
      ConfirmPopupProp : () => void updateSchedule()
    }

  const updateSchedule = async () => {
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
    changeConfirmEditPopupFlag(false);

    } catch (error) {
      console.error("Error registering schedule:", error);
    }
  }

  const handleEditSchedule = () => {
    if(editSchedule?.title === "" || editSchedule?.startTime === "" || editSchedule?.endTime === ""){
        // alert("제목, 시작 시간 및 종료시간을 모두 입력해주세요")
        setAlertPopupTitle("제목, 시작 시간 및 종료시간을 모두 입력해주세요");
        changePopupFlag(true);
        return;
    }
    if (new Date(`${clickedDate} ${editSchedule?.endTime as string}`) <= new Date(`${clickedDate} ${editSchedule?.startTime as string}`)) {
      // alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      setAlertPopupTitle("종료 시간은 시작 시간보다 늦어야 합니다.");
      changePopupFlag(true);
      return;
    }
    if(isScheduleOverlapping(editSchedule?.startTime as string, editSchedule?.endTime as string, editSchedule?.id)){
      // alert("일정이 해당 날짜의 다른 스케줄과 겹칩니다");
      setAlertPopupTitle("일정이 해당 날짜의 다른 스케줄과 겹칩니다");
      changePopupFlag(true);
      return;
    }
    if(editSchedule?.title){
      if(editSchedule.title.split("").length> 20){
        // alert("제목은 20자 이하로 지정해주세요");
        setAlertPopupTitle("제목은 20자 이하로 지정해주세요");
        changePopupFlag(true);
        return;
      }
    }
    changeConfirmEditPopupFlag(true);
  }

  return (
    <div>

    <div className={style.wrapper}>
      <AlertPopup PopupInfo={AlertPopupInfo} />
      <ConfirmPopup PopupInfo={ConfirmDeletePopupInfo} />
      <ConfirmPopup PopupInfo={ConfirmAddPopupInfo} />
      <ConfirmPopup PopupInfo={ConfirmEditPopupInfo} />
      <StudyCalendar
        currMonth={currMonth}
        currYear={currYear}
        currentDate={currentDate}
        data={data}
        handleDateClick={handleDateClick}
        />
      <SchedulePopover
        LeaderFlag={props.LeaderFlag}
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
      />}
      {showEditPopover &&
        <EditPopover
          setShowEditPopover={setShowEditPopover}
          editSchedule={editSchedule}
          setEditSchedule={setEditSchedule}
          handleEditSchedule={handleEditSchedule}
          />
        }
      </div>
      <div className={style.offBox}>
        <button className={style.offPopup} onClick={() => {
          if (props.ClosePopupProp) {
            props.ClosePopupProp(false)
          }
        }}>닫기</button>
      </div>
      </div>
  );
}

export default CalendarCRUD;
