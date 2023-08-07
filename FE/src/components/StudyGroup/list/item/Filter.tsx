import { useRef } from 'react';
import LnbStyle from "@/res/css/module/Lnb.module.css";

const ListFilter = ( {searchKeyWord} : {searchKeyWord : (data: string) => void} ) => {
    let keyWord = "";
    const searchInputBox = useRef<HTMLDivElement>(null);

    //input keydown을 잡는 함수
    const changeKeyWord = (e : React.KeyboardEvent<HTMLInputElement>) => {
        keyWord = e.currentTarget.value;
        console.log(keyWord);
        if(e.key == 'Enter' && keyWord != ""){
            goKeyWord();
        }
    }

    //검색단어 올리기
    const goKeyWord = () => {
        searchInputBox.current?.classList.toggle(`${LnbStyle.active}`);
        searchKeyWord(keyWord);
    }

    const toggleSearchBox = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        searchInputBox.current?.classList.toggle(`${LnbStyle.active}`);
    }

    return (
        <div className={`col-12 ${LnbStyle.filter_con}`}>
            나의 스터디 목록
            <div className={`${LnbStyle.filter_btn}`} ref={searchInputBox} onClick={toggleSearchBox}>필터 버튼</div>
            <div className={`col-12 ${LnbStyle.search_input_box}`}>
                <div className="col-12">
                    <div className="col-12 mb7">스터디 제목</div>
                    <input type="text" onKeyUp={changeKeyWord} className="input_style_0 mb7" />
                    <button className="fr btn_style_0 white_search_icon" onClick={goKeyWord}>검색</button>
                </div>
            </div>
        </div>
    )
};

export default ListFilter;