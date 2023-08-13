import React, { useState } from 'react';
import style from '@/res/css/module/ViewSchedule.module.css';

interface AddPopoverProps {
  setStudyTitle : React.Dispatch<React.SetStateAction<string>>;
  setStudyStartTime : React.Dispatch<React.SetStateAction<string>>;
  setStudyEndTime: React.Dispatch<React.SetStateAction<string>>;
  setShowAddPopover: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddSchedule: () => Promise<void>;
}

function AddPopover({
  setStudyEndTime,
  setStudyStartTime,
  setStudyTitle,
  setShowAddPopover,
  handleAddSchedule,
}: AddPopoverProps) {

    

    const handleShowAddPopover = () => {
        setShowAddPopover((prevShowAddPopover) => !prevShowAddPopover); 
      };

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

  return renderAddPopover();
}

export default AddPopover;
