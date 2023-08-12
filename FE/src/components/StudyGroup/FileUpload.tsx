import { useState, useRef } from 'react';
import { insertData, insertStudyFile } from "@/api/study";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { AlertPopup } from "@/utils/Popup";
import CustomEditor from "@/utils/CustomEditor/CustomEditor";
import FileInput from "@/utils/FileInfo/Input";
import axios from 'axios';


interface FileUploadProps {
    closePopup: (flag:boolean) => void;
    uploadAlert: () => void;
    completePopup: () => void;
}


const FileUpload = (props:FileUploadProps) => {
    const userId = useRecoilValue(userState).userId;
    
    const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
    const [AlertPopupTitle, setAlertPopupTitle] = useState("");

    const titleInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const descInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const profileInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

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
    const formSubmit  = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
        e.preventDefault();

        if (titleInput.current == null || titleInput.current.value == '') {
            setAlertPopupTitle("제목을 입력해주세요");
            changePopupFlag(true);
            return;
        }

        if (!profileInput.current?.files?.length) {
            setAlertPopupTitle("파일을 등록해 주세요");
            changePopupFlag(true);
            return
        }

        let param = new FormData();
        param.append("userId", String(userId));
        param.append("title", titleInput.current.value);
        param.append("studyInfoId", "10");
        param.append("content", String(descInput.current?.value));
        
        // 파일 존재하는 경우만 업로드
        for (let i = 0; i < profileInput.current?.files.length; i++) {
            param.append("studyFile", profileInput.current?.files[i]);
        }   
        
        await insertStudyFile(param, ({data}) => {
            // props.closePopup(false);
            props.completePopup();
		}, (err) => {
			console.log(err);
		})

        props.uploadAlert();
        props.closePopup(false);
    }


    return (
        <form className="col-12" encType="multipart/form-data" onSubmit={(e) => void formSubmit(e)}>
            <div className="col-12 mb37 form_style_0_con">
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <label htmlFor="studyInsertTitle" className="essential">제목</label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="text" id="studyInsertTitle" className="input_style_0" placeholder="제목을 입력해주세요" ref={titleInput} />
                    </div>
                </div>
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <span>내용</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <CustomEditor editorRef={descInput} />
                    </div>
                </div>
                <div className="col-12 form_style_0 type_file">
                    <div className="col-12 col-md-0 label_box">
                        <span className="essential">스터디 자료</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <div className="col-12 mb12 addr_text"></div>
                        <button type="button" className="col-0 btn_style_0 bg_black border_none" onClick={() => profileInput.current?.click()}>자료 업로드</button>
                        <FileInput inheritRef={profileInput} multi={true}/>
                    </div>
                </div>
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={() => {
                    props.closePopup(false);
                    // console.log(1)
                }}>취소</button>
                <button type="submit" className="btn_style_0 bg_point0">등록</button>
            </div>
            
            <AlertPopup PopupInfo={AlertPopupInfo} />
        </form>
    )
};




export default FileUpload;