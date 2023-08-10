import { useState, useRef } from 'react';
import { StudyNoticeType } from '@/type/StudyNoticeType';
import { updateNoticeData } from "@/api/study";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { AlertPopup } from "@/utils/Popup";
import CustomEditor from "@/utils/CustomEditor/CustomEditor";


const NoticeUpdate = ({studyinfoId, data, closePop, completePop} : { studyinfoId: number, data: StudyNoticeType, closePop: () => void, completePop: () => void }) => {
    //const studyboardId = data.studyboardId as number;
    const studyboardId = 3;
    const userId = useRecoilValue(userState).userId;
    const [titleContents, setTitleContents] = useState(data.noticeTitle);
    const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
    const [AlertPopupTitle, setAlertPopupTitle] = useState("");
    const titleInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const descInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const AlertPopupInfo = {
        PopupStatus : AlertPopupFlag,
        zIndex : 10000,
        maxWidth: 440,
        PopupTitle : AlertPopupTitle,
        ClosePopupProp : () => changePopupFlag(false),
    }

    const changePopupFlag = (flag: boolean) => {
        setAlertPopupFlag(() => flag);
    };

    //폼 submit 이벤트
    const formSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();
        if(titleInput.current == null || titleInput.current.value == ''){
            setAlertPopupTitle("제목을 입력해주세요");
            changePopupFlag(true);
            return;
        }

        if(titleInput.current == null || titleInput.current.value == ''){
            setAlertPopupTitle("제목을 입력해주세요");
            changePopupFlag(true);
            return;
        }

        const today = new Date();
        const year = String(today.getFullYear());
        const month = today.getMonth() + 1 >= 10 ? String(today.getMonth() + 1) : '0' + String(today.getMonth() + 1);
        const date = today.getDate() >= 10 ? String(today.getDate()) : '0' + String(today.getDate());

        const todayText = year + '-' + month + '-' + date;


        const param = {
            authorId : userId,
            noticeTitle : titleInput.current.value,
            content : String(descInput.current?.value),
            uploadAt : todayText
        }
        await updateNoticeData(studyinfoId, studyboardId, param, ({data}) => {
            completePop();
        }, () => {
            alert("생성에 실패했습니다.");
        })

    }

    return (
        <form className="col-12" encType="multipart/form-data" onSubmit={(e) => void formSubmit(e)}>
            <div className="col-12 mb37 form_style_0_con">
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <label htmlFor="studyInsertTitle" className="essential">제목</label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="text" id="studyInsertTitle" className="input_style_0" placeholder="제목을 입력해주세요" ref={titleInput} value={titleContents} onChange={(e) => setTitleContents(e.target.value)} />
                    </div>
                </div>
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <span>내용</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <CustomEditor editorRef={descInput} content={data.content} />
                    </div>
                </div>
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={closePop}>취소</button>
                <button type="submit" className="btn_style_0 bg_point0">변경</button>
            </div>
            <AlertPopup PopupInfo={AlertPopupInfo} />
        </form>
    )
};

export default NoticeUpdate;