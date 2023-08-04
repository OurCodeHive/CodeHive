const NoticeView = ({studyBoardId, closePopup} : {studyBoardId : number, closePopup: (flag: boolean) => void}) => {
    return (
        <div className="col-12 pt50 pr20 pb20 pl20">
            {studyBoardId}
        </div>
    )
}

export default NoticeView;