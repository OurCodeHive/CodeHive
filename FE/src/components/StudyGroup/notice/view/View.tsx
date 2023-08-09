import { useState, useEffect } from 'react';
import { StudyNoticeType } from '@/type/StudyNoticeType';
import { CheckUserId } from '@/atom/UserAtom';
import { getNoticeView } from '@/api/study';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import { ConfirmPopup } from '@/utils/Popup';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const NoticeView = ({studyBoardId, closePopup} : {studyBoardId : number, closePopup: (flag: boolean) => void}) => {

    const [NoticeContents, setNoticeContents] = useState<StudyNoticeType>({} as StudyNoticeType);
    
    const AuthorFlag = useState(CheckUserId(NoticeContents.authorId));

    const [PopupFlag, setPopupFlag] = useState(false);

    const PopupInfo = {
        PopupStatus : PopupFlag,
        zIndex : 10000,
        maxWidth: 440,
        PopupTitle : "삭제하시겠습니까?",
        ClosePopupProp : () => changePopupFlag(false),
        ConfirmPopupProp : () => removeConfirm(false)
    };

    const changePopupFlag = (flag: boolean) => {
        setPopupFlag(() => flag);
    };

    const removeConfirm = (flag: boolean) => {
        setPopupFlag(() => flag);
    }

    const removeNotice = () => {
        setPopupFlag(() => true);
    };

    const getView = async () => {
        await getNoticeView(studyinfoId, studyBoardId, ({data}) => {
            setNoticeContents(data);
        }, (error) => {console.log(error)})
    }

    useEffect(() => {
        void getView();
    }, []);

    return (
        <div className="col-12 pt50 pr20 pb20 pl20">
            <div className="col-12 mb50 form_style_0_con type_view">
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box"><span>제목</span></div>
                    <div className="col-12 col-md-0 input_box">{NoticeContents.noticeTitle}</div>
                </div>
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box"><span>내용</span></div>
                    <div className="col-12 col-md-0 input_box"><CustomEditorResult param={NoticeContents?.content as string}/></div>
                </div>
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 bg_a2a2a2" onClick={() => closePopup(false)}>닫기</button>
                {AuthorFlag
                    ?
                    <div className='ml15 show'>
                        <button type="button" className="btn_style_0 bg_point0">변경</button>
                        <button type="button" className="btn_style_0 ml15" onClick={() => removeNotice()}>삭제</button>
                    </div>
                    : null
                }
            </div>
            <ConfirmPopup PopupInfo={PopupInfo}/>
        </div>
    )
}

export default NoticeView;