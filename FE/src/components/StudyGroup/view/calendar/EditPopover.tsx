import React from 'react';
import style from './ViewSchedule.module.css';

interface editSchedule {
    title? : string,
    date? : string,
    startTime? : string,
    endTime? : string,
    id? : number
  }

interface EditPopoverProps {
  setShowEditPopover: React.Dispatch<React.SetStateAction<boolean>>;
  editSchedule: editSchedule | null;
  setEditSchedule: React.Dispatch<React.SetStateAction<editSchedule | null>>;
  handleEditSchedule: () => void;
}

function EditPopover({
  setShowEditPopover,
  editSchedule,
  setEditSchedule,
  handleEditSchedule,
}: EditPopoverProps) {
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

  return renderEditPopover();
}

export default EditPopover;
