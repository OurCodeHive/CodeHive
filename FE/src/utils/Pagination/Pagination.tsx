import { useState } from 'react';
import PaginationStyle from './css/Pagination.module.css';

export type PaginationType = {
    totalCnt : number;
    perSize : number;
    range : number;
    curIdx : number;
    changeIdx : (idx : number) => void;
}

const Pagination = ({PaginationInfo} : {PaginationInfo : PaginationType}) => {

    const remain = PaginationInfo.curIdx % PaginationInfo.range;
    const [CurList, setCurList] = useState<number[]>([]);
    const firstIdx = 1, lastIdx = Math.floor(PaginationInfo.totalCnt / PaginationInfo.perSize);
    const prevIdx = (Math.floor(PaginationInfo.curIdx / PaginationInfo.range) != 0 ? PaginationInfo.curIdx - PaginationInfo.range - remain : 0) + 1;
    const nextIdx = PaginationInfo.curIdx + PaginationInfo.range - remain < lastIdx ? PaginationInfo.curIdx + PaginationInfo.range - remain : lastIdx;
    
    function changeRange(){
        const tempList = [] as number[];
        for(let i= prevIdx; i <= nextIdx; i++) tempList.push(i);
        setCurList(tempList);
    }
    changeRange();

    //첫번째로 가기
    const goFirst = () => {
        if(PaginationInfo.curIdx != firstIdx){
            PaginationInfo.changeIdx(firstIdx);
            changeRange();
        }
        
    }

    //이전으로 가기
    const goPrev = () => {
        if(PaginationInfo.curIdx != 1){
            PaginationInfo.changeIdx(prevIdx);
            changeRange();
        }
    }

    //마지막으로 가기
    const goLast = () => {
        if(PaginationInfo.curIdx != lastIdx){
            PaginationInfo.changeIdx(lastIdx);
            changeRange();
        }
    }

    //다음으로 가기
    const goNext = () => {
        if(PaginationInfo.curIdx != lastIdx){
            PaginationInfo.changeIdx(nextIdx);
            changeRange();
        }
    }

    const clickIdx = (idx: number) => {
        PaginationInfo.changeIdx(idx);
    }

    return (
        <div className={`col-12 ${PaginationStyle.pagination_style_0_con}`}>
            <button type="button" onClick={goFirst} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_first}`}>첫번째로 가기</button>
            <button type="button" onClick={goPrev} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_prev}`}>이전으로 가기</button>
            <ul className={`${PaginationStyle.pagination_style_0}`}>
                {CurList.map((item, index) => (
                    item !== PaginationInfo.curIdx && true ?
                    (<li key={index} onClick={() => clickIdx(item)}>{item}</li>) :
                    (<li key={index} className={`${PaginationStyle.active}`}>{item}</li>)
                ))}
            </ul>
            <button type="button" onClick={goNext} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_next}`}>다음으로 가기</button>
            <button type="button" onClick={goLast} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_last}`}>마지막으로 가기</button>
        </div>
    )
}

export default Pagination;