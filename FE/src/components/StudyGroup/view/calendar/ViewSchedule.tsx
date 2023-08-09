import React from 'react';
import CalendarApp from '@/components/home/Calendar';
import style from '@/components/StudyGroup/view/calendar/ViewSchedule.module.css'
const viewSchedule = () => {
    return (
        <div className={style.test}>
            <CalendarApp isPopoverRight={true}></CalendarApp>
        </div>
    );
};

export default viewSchedule;