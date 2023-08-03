import { useState } from 'react';
import PaginationStyle from './css/Pagination.module.css';

export type PaginationType = {
    totalCnt : number;
    perSize : number;
    range : number;
    changeIdx : (idx : number) => void;
}

const Pagination = ({PaginationInfo} : {PaginationInfo : PaginationType}) => {
    
    const [CurIdx, setCurIdx] = useState(1);
    const firstIdx = 1, lastIdx = Math.floor(PaginationInfo.totalCnt / PaginationInfo.perSize);
    let remain = CurIdx % PaginationInfo.range;
    const [PrevIdx, setPrevIdx] = useState(CurIdx - remain > 0 ? CurIdx - remain : 1);
    const [NextIdx, setNextIdx] = useState(CurIdx - remain + PaginationInfo.range + 1 < lastIdx ? CurIdx - remain + PaginationInfo.range + 1 : lastIdx);
    
    //처음 세팅
    const initList = [] as number[];
    for(let i= PrevIdx; i < NextIdx; i++) initList.push(i);
    const [CurList, setCurList] = useState<number[]>(initList);
    
    function changeRange(idx: number) {
        remain = idx % PaginationInfo.range;
        if(remain !== 0){
            const tempPrev = idx - remain > 0 ? idx - remain : 1;
            const tempNext = idx - remain + PaginationInfo.range + 1 < lastIdx ? idx - remain + PaginationInfo.range + 1 : lastIdx;

            const tempList = [] as number[];
            for(let i=tempPrev + 1; i < tempNext; i++) tempList.push(i);
            if(tempPrev == 1) tempList.unshift(tempPrev);
            if(tempNext == lastIdx) tempList.push(tempNext);
            setCurList(tempList);
            setPrevIdx(() => tempPrev);
            setNextIdx(() => tempNext);
        }
        setCurIdx(() => idx);
        
    }

    //첫번째로 가기
    const goFirst = () => {
        if(CurIdx != firstIdx){
            PaginationInfo.changeIdx(firstIdx);
            changeRange(firstIdx);
        }
        
    }

    //이전으로 가기
    const goPrev = () => {
        if(CurIdx != 1){
            PaginationInfo.changeIdx(PrevIdx);
            changeRange(PrevIdx);
        }
    }

    //마지막으로 가기
    const goLast = () => {
        if(CurIdx != lastIdx){
            PaginationInfo.changeIdx(lastIdx);
            changeRange(lastIdx);
        }
    }

    //다음으로 가기
    const goNext = () => {
        if(CurIdx != lastIdx){
            PaginationInfo.changeIdx(NextIdx);
            changeRange(NextIdx);
        }
    }

    const clickIdx = (idx: number) => {
        PaginationInfo.changeIdx(idx);
        changeRange(idx);
    }

    return (
        <div className={`col-12 ${PaginationStyle.pagination_style_0_con}`}>
            <button type="button" onClick={goFirst} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_first}`}>첫번째로 가기</button>
            <button type="button" onClick={goPrev} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_prev}`}>이전으로 가기</button>
            <ul className={`${PaginationStyle.pagination_style_0}`}>
                {CurList.map((item, index) => (
                    item !== CurIdx && true ?
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