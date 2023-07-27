import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';

const CustomDatePicker = ({resultInput, settingDate} : {resultInput: React.RefObject<HTMLInputElement>, settingDate : Date}) => {
  const [selectDate, setSelectDate] = useState<Date>(settingDate);

  const changeDate = (date : Date) => {
    setSelectDate(date);
    if(resultInput.current != null){ resultInput.current.value = toStringByFormatting(date); }
  }

	return (
		<DatePicker
      showIcon
      locale={ko}
      dateFormat="yyyy.MM.dd"
      selected={selectDate}
      onChange={(date: Date) => changeDate(date)}
    />
    )

    //0일경우에 붙여서 주는 함수
  function leftPad(value: number): string {return value >= 10 ? String(value) : `0${value}`;}

  //date를 문자열로 바꿔주는 함수
  function toStringByFormatting(source: Date, delimiter = '-'): string {return [source.getFullYear(), leftPad(source.getMonth() + 1), leftPad(source.getDate())].join(delimiter);}
}

export default CustomDatePicker;