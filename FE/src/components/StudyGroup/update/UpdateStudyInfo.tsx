import { useState, useRef } from 'react';
import { updateStudyInfoData, getList } from "@/api/study";
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { AlertPopup } from "@/utils/Popup";
import CustomEditor from "@/utils/CustomEditor/CustomEditor";
import CustomDatePicker from "@/utils/CustomDatePicker";
import FileInput from "@/utils/FileInfo/Input";
import { StudyUpdateType, StudyType } from '@/type/StudyType';
import { SidebarContentAtom } from "@/atom/SidebarContentAtom";



const UpdateStudyInfo = ({closePopup, studyUpdate, fetchData}:{closePopup: () => void, studyUpdate:StudyUpdateType, fetchData:() => void}) => {
    const today = new Date();
    const userId = useRecoilValue(userState).userId;
    const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
    const [AlertPopupTitle, setAlertPopupTitle] = useState("");

    const titleInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const descInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState(studyUpdate.title);
    const [startDate, setStartDate] = useState(studyUpdate.startAt);
    const [endDate, setEndDate] = useState(studyUpdate.endAt);
    const profileInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    const [studyList, setStudyList] = useRecoilState(SidebarContentAtom);


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

    const handleTitle = (event: any) => {
		setTitle(event.target.value);
	}

    const convertDateType = (stringDate: string) => {
        return new Date(stringDate);
    }



    async function fetchData2(){
        let originStudyList = [] as Array<StudyType>;
        const param2 = {user : userId};
        await getList(param2, ({data}) => {
            originStudyList = data.studyList;
            setStudyList(originStudyList);
        },
        (error) => {console.log(error);});
    }

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

        if(startDate == null ||  startDate == ""){
            setAlertPopupTitle("시작날짜를 설정해주세요");
            changePopupFlag(true);
            return;
        }

        if(endDate == null ||  endDate == ""){
            setAlertPopupTitle("종료날짜를 설정해주세요");
            changePopupFlag(true);
            return;
        }

        if(new Date(startDate) > new Date(endDate)){
            setAlertPopupTitle("시작날짜가 종료날짜보다 미래에 있습니다");
            changePopupFlag(true);
            return;
        }

        let param = new FormData();
        param.append("userId", String(userId));
        param.append("studyInfoId", studyUpdate.studyinfoId + "")
        param.append("title", titleInput.current.value);
        param.append("startAt", startDate);
        param.append("endAt", endDate);
        param.append("description", String(descInput.current?.value));
        
        // 파일 존재하는 경우만 업로드
        if (profileInput.current?.files) {
            for (let i = 0; i < profileInput.current?.files.length; i++) {
                param.append("profile", profileInput.current?.files[i]);
            }   
        }
        // console.log("------------------------------")
        // for (let pair of param.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }
        // console.log("------------------------------")
        await updateStudyInfoData(param, ({data}) => {

            fetchData();
            fetchData2();
            closePopup();
        }, () => {
            alert("생성에 실패했습니다.");
        })

    }

    return (
        <form className="col-12" encType="multipart/form-data" onSubmit={(e) => void formSubmit(e)}>
            <div style={{
                textAlign:"left",
                color:"black",
                cursor:"auto"
                }} className="col-12 mb37 form_style_0_con">
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <label htmlFor="studyInsertTitle" className="essential">스터디 이름</label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="text" id="studyInsertTitle" className="input_style_0" placeholder="제목을 입력해주세요"
                         ref={titleInput} 
                         value={title}
                         onChange={(event) => { handleTitle(event) }}
                         />
                    </div>
                </div>
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <span>설명</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <CustomEditor editorRef={descInput} content={studyUpdate.description} />
                    </div>
                </div>
                <div className="col-12 form_style_0 type_date_range">
                    <div className="col-12 col-md-0 label_box">
                        <span className="essential">기간</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <div className="col-12 date_box">
                            <CustomDatePicker setData={setStartDate} settingDate={convertDateType(startDate)} minDate={today}/>
                        </div>
                        <span className="addr_text">-</span>
                        <div className="col-12 date_box">
                            <CustomDatePicker setData={setEndDate} settingDate={convertDateType(endDate)} minDate={today}/>
                        </div>
                    </div>
                </div>
                <div className="col-12 form_style_0 type_file">
                    <div className="col-12 col-md-0 label_box">
                        <span>대표 이미지</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <div className="col-12 mb12 addr_text">형식은 png, jpg, jpeg만 가능합니다.</div>
                        <button type="button" className="col-0 btn_style_0 bg_black border_none" onClick={() => profileInput.current?.click()}>이미지 등록</button>
                        <FileInput inheritRef={profileInput} multi={false}/>
                    </div>
                </div>
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 mr15 bg_a2a2a2"
                onClick={closePopup}>취소</button>
                <button type="submit" className="btn_style_0 bg_point0">수정완료</button>
            </div>
            <AlertPopup PopupInfo={AlertPopupInfo} />
        </form>
    )
};

export default UpdateStudyInfo;