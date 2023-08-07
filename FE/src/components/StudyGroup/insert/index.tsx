import {useState} from "react";
import Step1Contents from "./Step1";
import Step2Contents from "./Step2";

const StudyInsert = ({refreshList, closePopup} : {refreshList: () => void, closePopup: (flag: boolean) => void}) => {
    const [StudyInfoId, setStudyInfoId] = useState(-1);
    const [StepIdx, setStepIdx] = useState(1);
    const closePop = () => {
        closePopup(false);
    }

    function updateIdx(num : number){
        setStepIdx(2);
        setStudyInfoId(num);
    }

    return (
        <>
         {StepIdx === 1 ? (
            <Step1Contents closePop={closePop} updateIdx={updateIdx} />
         ) : (
            <Step2Contents refreshList={refreshList} closePop={closePop} studyInfoId={StudyInfoId} />
         )}
        </>
    )
};

export default StudyInsert;