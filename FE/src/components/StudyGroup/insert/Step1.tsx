import CustomEditor from "@/components/Util/CustomEditor";

const StudyInsert1Step: React.FC = () => {
    return (
        <div className="col-12">
            <form className="col-12 form_style_0_con" encType="multipart/form-data">
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
                        <label htmlFor=""></label>
                    </div>
                    <div className="col-12 col-md-0 input_box">
                        <CustomEditor/>
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
                        <label htmlFor="">대표 이미지</label>
                    </div>
                </div>
            </form>
        </div>
    )
};

export default StudyInsert1Step;