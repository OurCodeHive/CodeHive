import { useRef } from 'react';
import CustomEditor from "@/components/Util/CustomEditor";

const StudyInsert1Step: React.FC = () => {
    const descInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    return (
        <form className="col-12" encType="multipart/form-data">
            <div className="col-12 mb37 form_style_0_con">
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <label htmlFor="studyInsertTitle" className="essential">제목</label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="text" id="studyInsertTitle" className="input_style_0" placeholder="제목을 입력해주세요" />
                    </div>
                </div>
                <div className="col-12 form_style_0">
                    <div className="col-12 col-md-0 label_box">
                        <span>내용</span>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="hidden" ref={descInput}/>
                        <CustomEditor resultInput={descInput} />
                    </div>
                </div>
                <div className="col-12 form_style_0 type_date_range">
                    <div className="col-12 col-md-0 label_box">
                        <label htmlFor="studyInsertStartDay">기간</label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="date" name="studyInsertStartDay" id="studyInsertStartDay" className="input_style_0" />
                        <span className="addr_text">-</span>
                        <input type="date" name="studyInsertEndDay" id="studyInsertEndDay" className="input_style_0" />
                    </div>
                </div>
                <div className="col-12 form_style_0 type_file">
                    <div className="col-12 col-md-0 label_box">
                        <label htmlFor="studyInsertProFileImg">대표 이미지</label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <input type="file" id="studyInsertProFileImg" name="studyInsertProFileImg" className="input_style_0" accept=".png, .jpg, .jpeg"/>
                        <div className="col-12 mb12 addr_text">형식은 png, jpg, jpeg만 가능합니다.</div>
                        <label htmlFor="studyInsertProFileImg" className="col-0 btn_style_0 bg_black border_none">이미지 등록</label>
                        <ul className="col-12 file_info_con"></ul>
                    </div>
                </div>
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button className="btn_style_0 mr15">취소</button>
                <button className="btn_style_0 bg_point0">만들기</button>
            </div>
        </form>
    )
};

export default StudyInsert1Step;