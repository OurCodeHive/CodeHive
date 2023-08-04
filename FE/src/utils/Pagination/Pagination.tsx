import { useState } from 'react';
import PaginationStyle from './res/css/Pagination.module.css';

export type PaginationType = {
    totalCnt : number;
    perSize : number;
    range : number;
    changeIdx : (idx : number) => void;
}

const Pagination = ({PaginationInfo} : {PaginationInfo : PaginationType}) => {
    
    const [CurIdx, setCurIdx] = useState(1);
    const FirstIdx = 1, LastIdx = Math.floor(PaginationInfo.totalCnt / PaginationInfo.perSize);
    let remain = CurIdx % PaginationInfo.range;
    const [PrevIdx, setPrevIdx] = useState(CurIdx - remain > 0 ? CurIdx - remain : 1);
    const [NextIdx, setNextIdx] = useState(CurIdx - remain + PaginationInfo.range + 1 < LastIdx ? CurIdx - remain + PaginationInfo.range + 1 : LastIdx);
    
    //처음 세팅
    const initList = [] as number[];
    for(let i= PrevIdx; i < NextIdx; i++) initList.push(i);
    const [CurList, setCurList] = useState<number[]>(initList);
    
    function paginationClick(idx: number) {
        PaginationInfo.changeIdx(idx);
        remain = idx % PaginationInfo.range;
        let tempPrev = 0, tempNext = 0;
        if(remain !== 0){
            tempPrev = idx - remain > 0 ? idx - remain : 1;
            tempNext = idx - remain + PaginationInfo.range + 1 < LastIdx ? idx - remain + PaginationInfo.range + 1 : LastIdx;
        } else {
            tempPrev = idx - PaginationInfo.range + 1;
            tempNext = idx + 1 < LastIdx ? idx + 1 : LastIdx;
        }

        const tempList = [] as number[];
        for(let i=tempPrev + 1; i < tempNext; i++) tempList.push(i);
        if(tempPrev == FirstIdx) tempList.unshift(tempPrev);
        if(tempNext == LastIdx) tempList.push(tempNext);
        setCurList(tempList);
        setPrevIdx(() => tempPrev);
        setNextIdx(() => tempNext);

        setCurIdx(() => idx);
        
    }

    return (
        <div className={`col-12 tc ${PaginationStyle.pagination_style_0_con}`}>
            <button type="button" onClick={() => paginationClick(FirstIdx)} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_first}`}>첫번째로 가기</button>
            <button type="button" onClick={() => paginationClick(PrevIdx)} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_prev}`}>이전으로 가기</button>
            <ul className={`${PaginationStyle.pagination_style_0}`}>
                {CurList.map((item, index) => (
                    item !== CurIdx && true ?
                    (<li key={index} onClick={() => paginationClick(item)}>{item}</li>) :
                    (<li key={index} className={`${PaginationStyle.active}`}>{item}</li>)
                ))}
            </ul>
            <button type="button" onClick={() => paginationClick(NextIdx)} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_next}`}>다음으로 가기</button>
            <button type="button" onClick={() => paginationClick(LastIdx)} className={`${PaginationStyle.arrow_btn} ${PaginationStyle.to_last}`}>마지막으로 가기</button>
        </div>
    )
}

export default Pagination;