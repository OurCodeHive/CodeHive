import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './css/DatePicker.module.css';
import { ko } from 'date-fns/esm/locale';

interface DatePickerProps {
  resultInput : React.RefObject<HTMLInputElement>;
  settingDate : Date;
  minDate? : Date;
  maxDate? : Date;
}


const CustomDatePicker = (Props : DatePickerProps) => {
  const [selectDate, setSelectDate] = useState<Date>(Props.settingDate);

  const changeDate = (date : Date) => {
    setSelectDate(date);
    if(Props.resultInput.current != null){ Props.resultInput.current.value = toStringByFormatting(date); }
  }

	return (
		<DatePicker
      locale={ko}
      dateFormat="yyyy.MM.dd"
      minDate={Props.minDate ? Props.minDate : selectDate}
      selected={selectDate}
      onChange={(date: Date) => changeDate(date)}
      renderCustomHeader={({ // custom header 만들어주기
        monthDate,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="date-customheader">
          <button onClick={() => decreaseMonth()} disabled={prevMonthButtonDisabled}>
            <i className="icon-arrow-left32" />
          </button>
          <div>
            {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
          </div>
          <button onClick={() => increaseMonth()} disabled={nextMonthButtonDisabled}>
            <i className="icon-arrow-right32" />
          </button>
        </div>
      )}
    />
    )

    //0일경우에 붙여서 주는 함수
  function leftPad(value: number): string {return value >= 10 ? String(value) : `0${value}`;}

  //date를 문자열로 바꿔주는 함수
  function toStringByFormatting(source: Date, delimiter = '-'): string {return [source.getFullYear(), leftPad(source.getMonth() + 1), leftPad(source.getDate())].join(delimiter);}
}

export default CustomDatePicker;