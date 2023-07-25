import LnbStyle from "@/res/css/module/Lnb.module.css";

const Filter = ( {searchKeyWord} : {searchKeyWord : (data: string) => void} ) => {
    let keyWord = "";

    const changeKeyWord = (e : React.KeyboardEvent<HTMLInputElement>) => {
        keyWord = e.currentTarget.value;
        if(e.key == 'Enter' && keyWord != ""){
            goKeyWord();
        }
    }

    const goKeyWord = () => {
        if(keyWord != ''){
            searchKeyWord(keyWord);
        }
    }

    return (
        <div className={`col-12 ${LnbStyle.filter_con}`}>
            나의 스터디 목록
            <button>필터 버튼
                <div className={`col-12 ${LnbStyle.search_input_box}`}>
                    <div className="mb7">스터디 제목 검색</div>
                    <input type="text" onKeyDown={changeKeyWord} className="input_style_0" />
                </div>
            </button>
        </div>
    )
};

export default Filter;