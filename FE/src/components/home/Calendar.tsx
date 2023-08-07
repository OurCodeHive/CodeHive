import React from 'react';
import style from "@/res/css/module/Calendar.module.css"
import { AxiosError, AxiosResponse } from 'axios';
import { authHttp } from '@/api/http';
import { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// import enGB from 'date-fns/locale/en-GB';
import data from "./CalendarData";

const Calendar = () => {
    interface calendarData {
        study_title: string,
        date: string,
        start_time: string,
        end_time: string,
    }
    interface fullData {
        calendar : calendarData[],
        message : string
    }
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [scheduleData, setScheduleData] = useState<calendarData[]>([]);

    const pk = (JSON.parse(sessionStorage.getItem("useState") as string) as { userId: string } | null)?.userId;

    function getCalendar(){
        async function requestCalendar(): Promise<void> {
            try {
                const response: AxiosResponse<fullData> = await authHttp.get<fullData>(`/calendar/study?user=${pk}`);
                const {calendar} = response.data;
                if(calendar){
                    setScheduleData(calendar);
                    console.log(calendar);
                }
                // return response.data;
            } catch (error) {
                const err = error as AxiosError
                console.log(err);
            }
        }
        requestCalendar()
        .then((res)=>{
            console.log(res);
        })
        .catch(console.log)
            
    }
    useEffect(()=>{
        setScheduleData(data);
        console.log(scheduleData);
        // getCalendar();
    },[])

    // Function to handle date selection
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    // Function to render schedule content for a specific date
    const renderScheduleContent = (date: Date) => {
        const formattedDate = date.toISOString().slice(0, 10);//YYYY-mm-dd
        const schedule = scheduleData.find((item) => item.date === formattedDate);

        if (schedule) {
        return <div>{schedule.study_title}</div>;
        } else {
        return null;
        }
    };
    const getCustomDayClassName = (date: Date) => {
        const formattedDate = date.toISOString().slice(0, 10);
        const hasSchedule = scheduleData.some((item) => item.date === formattedDate);
    
        return hasSchedule ? 'has-schedule' : '';
      };
    return (
        <div style={{ width: '500px', margin: '0 auto' }}>
      <h1>Calendar with Study Titles</h1>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dayClassName={getCustomDayClassName}
        locale="en-GB"
        inline // Show the calendar without requiring a click
        
      />
    </div>
    );
};

export default Calendar;