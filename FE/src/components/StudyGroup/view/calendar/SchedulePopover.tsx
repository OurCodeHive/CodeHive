import React from 'react';
import style from '@/res/css/module/ViewSchedule.module.css';
interface Schedule {
    endTime? : string;
    id?: number;
    meetingAt?: string;
    startTime?: string;
    title? : string,
}
interface SchedulePopoverProps {
    LeaderFlag: boolean;
    showPopover: boolean;
    selectedDateInfo: Schedule[];
    setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
    handleShowAddPopover: () => void;
    handleShowEditPopover: (schedule: Schedule) => void;
    handleDeleteSchedule: (id:number) => void;
    clickedDate : string
  }

function SchedulePopover({
  showPopover,
  selectedDateInfo,
  handleShowAddPopover,
  handleShowEditPopover,
  handleDeleteSchedule,
  clickedDate,
  LeaderFlag
}:SchedulePopoverProps) {

    const renderPopover = () => (
        showPopover && (
          <div className={style.popover_right}>
            <div className={style.popover_title}>{clickedDate}</div>
            {selectedDateInfo.length === 0 ? (
              <div className={style.no_study_text}>예정된 스터디가 없습니다</div>
            ) : (
            selectedDateInfo.map((schedule) => (
            <>
              <div key={`${schedule.id as number}`} className={style.schedule_item}>
                <div className={style.study_info}>
                  <div className={style.study_title}>{schedule.title}</div>
                  {
                    LeaderFlag?
                    <div className={style.actions}>
                      <span onClick={() => handleDeleteSchedule(schedule.id as number)} className={style.action_icon}>&#128465;</span> {/* Trashcan icon */}
                      <span onClick={() => handleShowEditPopover(schedule)} className={style.action_icon}>&#9998;</span> {/* Pencil icon */}
                    </div>
                    :
                    null
                  }
                </div>
                <div className={style.study_schedules}>
                  {schedule.startTime?.slice(11,16)} - {schedule.endTime?.slice(11,16)}
                </div>
              </div>
              <hr />
              </>
            ))
          )}
            {
              LeaderFlag?
              <div onClick={handleShowAddPopover} className={style.add_icon}>&#43;</div>
              :
              null
            }
          </div>
        )
    );

    return (
        renderPopover() as JSX.Element
    )
}

export default SchedulePopover;
