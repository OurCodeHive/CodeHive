import {useState} from "react";
import Step1Contents from "./Step1";
import Step2Contents from "./Step2";

const StudyInsert: React.FC = () => {
    const [StepIdx, setStepIdx] = useState(1);

    return (
        <>
         {StepIdx === 1 ? (
            <Step1Contents />
         ) : (
            <Step2Contents/>
         )}
        </>
    )
};

export default StudyInsert;