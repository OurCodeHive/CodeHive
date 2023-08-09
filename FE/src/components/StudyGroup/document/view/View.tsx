import { useState, useEffect } from 'react';
import { StudyDocumentType } from '@/type/StudyDocumentType';
import { CheckUserId } from '@/atom/UserAtom';
import { getDocumentView } from '@/api/study';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import { ConfirmPopup } from '@/utils/Popup';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const DocumentView = ({studyDocumentId, closePopup} : {studyDocumentId : number, closePopup: (flag: boolean) => void}) => {

    const [DocumentContents, setDocumentContents] = useState<StudyDocumentType>({} as StudyDocumentType);
    
    const AuthorFlag = useState(CheckUserId(DocumentContents.authorId));

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
        console.log(studyDocumentId);
        await getDocumentView(studyinfoId, studyDocumentId, ({data}) => {
            setDocumentContents(data);
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
                    <div className="col-12 col-md-0 input_box">{DocumentContents.title}</div>
                </div>
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box"><span>내용</span></div>
                    <div className="col-12 col-md-0 input_box"><CustomEditorResult param={DocumentContents?.content as string}/></div>
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

export default DocumentView;