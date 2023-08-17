import React, { useState, useRef, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './css/DatePicker.css';
import LeftArrow from './img/left_arrow.png';
import RightArrow from './img/right_arrow.png';
import { ko } from 'date-fns/esm/locale';

interface DatePickerProps {
  setData : (value: string) => void;
  settingDate? : Date;
  minDate? : Date;
  maxDate? : Date;
}

interface CustomInputProps {
  value : string,
  onClick : () => void,
}

const CustomDatePicker = (Props : DatePickerProps) => {
  const [selectDate, setSelectDate] = useState<Date>(Props.settingDate as Date);

  const changeDate = (date : Date) => {
    Props.setData(toStringByFormatting(date));
    setSelectDate(date);
  }

  const ExampleCustomInput = forwardRef((Props: CustomInputProps, ref) => (
    <button type='button' className="datepicker_input_btn" onClick={Props.onClick}>
      {Props.value}
    </button>
  ));

	return (
		<DatePicker
      locale={ko}
      dateFormat="yyyy.MM.dd"
      minDate={Props.minDate ? Props.minDate : selectDate}
      selected={selectDate}
      onChange={(date: Date) => changeDate(date)}
      customInput={<ExampleCustomInput value={''} onClick={function (): void {
        throw new Error('Function not implemented.');
      } } />}
      renderCustomHeader={({ // custom header 만들어주기
        monthDate,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="date-customheader">
          <button type='button' onClick={() => decreaseMonth()} style={{width: '8px'}} disabled={prevMonthButtonDisabled}>
            <img src={LeftArrow} alt="왼쪽 화살표 아이콘" />
          </button>
          <div>
            {monthDate.getFullYear()}년 {monthDate.getMonth() + 1}월
          </div>
          <button type='button' onClick={() => increaseMonth()} style={{width: '8px'}} disabled={nextMonthButtonDisabled}>
            <img src={RightArrow} alt="오른쪽 화살표 아이콘" />
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