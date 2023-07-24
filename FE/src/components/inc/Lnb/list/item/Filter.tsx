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
        <div>
            나의 스터디 목록
            <div>
                필터 버튼
                <div className="col-12 search_box">
                    <input type="text" onKeyDown={changeKeyWord} />
                </div>
            </div>
        </div>
    )
};

export default Filter;