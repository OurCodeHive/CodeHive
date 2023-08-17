import { useRef, useState, useEffect } from 'react';
import { StudyNoticeType } from '@/type/StudyNoticeType';
import { getNoticeView, removeNoticeData } from '@/api/study';
import { CheckUserId } from '@/atom/UserAtom';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import { ConfirmPopup, ContentsPopup } from '@/utils/Popup';
import NoticeUpdate from '../update/Update';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const NoticeView = ({studyBoardId, changePopup, closePopup, studyLeaderId} : {studyBoardId : number, changePopup: () => void, closePopup: (flag: boolean) => void, studyLeaderId : number}) => {
    const LeaderFlag = useRef(CheckUserId(studyLeaderId));

    const [NoticeContents, setNoticeContents] = useState<StudyNoticeType>({} as StudyNoticeType);

    const [PopupFlag, setPopupFlag] = useState(false);
    const [ConfirmPopupFlag, setConfirmPopupFlag] = useState(false);
    const ConfirmPopupInfo = {
        PopupStatus : ConfirmPopupFlag,
        zIndex : 10000,
        maxWidth: 440,
        PopupTitle : "삭제하시겠습니까?",
        ClosePopupProp : () => changeConfirmPopupFlag(false),
        ConfirmPopupProp : () => removeConfirm(),
    }

    const PopupInfo = {
        PopupStatus : PopupFlag,
        zIndex : 10000,
        maxWidth: 800,
        PopupTitle : "공지사항 변경",
        ClosePopupProp : () => changePopupFlag(false),
        PopupContents : <NoticeUpdate studyinfoId={studyinfoId} data={NoticeContents} closePop={() => changePopupFlag(false)} completePop={() => completeUpdate()} />
    };

    const changePopupFlag = (flag: boolean) => {
        setPopupFlag(() => flag);
    };

    const changeConfirmPopupFlag = (flag: boolean) => {
        setConfirmPopupFlag(() => flag);
    };

    //삭제하기 눌렀을 때
    const removeConfirm = async () => {

        await removeNoticeData(studyinfoId, studyBoardId, ({data}) => {
            changeConfirmPopupFlag(false);
            changePopup();
        }, (error) => {console.log(error)});
        
    }

    //삭제 시도
    const removeNotice = () => {
        changeConfirmPopupFlag(true);
    };

    const updateNotice = () => {
        changePopupFlag(true);
    }

    const completeUpdate = () => {
        changePopupFlag(false);
        changePopup();
    }

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
                {LeaderFlag.current
                    ?
                    <div className='ml15 show'>
                        <button type="button" className="btn_style_0 bg_point0" onClick={() => updateNotice()}>변경</button>
                        <button type="button" className="btn_style_0 ml15" onClick={() => removeNotice()}>삭제</button>
                    </div>
                    : null
                }
            </div>
            <ConfirmPopup PopupInfo={ConfirmPopupInfo}/>
            <ContentsPopup PopupInfo={PopupInfo}/>
        </div>
    )
}

export default NoticeView;