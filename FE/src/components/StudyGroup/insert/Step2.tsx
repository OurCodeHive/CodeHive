const StudyInsert2Step = ({closePop} : {closePop: () => void}) => {
    return (
        <div className="col-12">
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={closePop}>취소</button>
            </div>
        </div>
    )
};

export default StudyInsert2Step;