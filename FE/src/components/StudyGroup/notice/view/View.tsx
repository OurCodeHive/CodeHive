const NoticeView = ({studyBoardId, closePopup} : {studyBoardId : number, closePopup: (flag: boolean) => void}) => {
    return (
        <div className="col-12 pt50 pr20 pb20 pl20">
            {studyBoardId}
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={() => closePopup(false)}>취소</button>
            </div>
        </div>
    )
}

export default NoticeView;