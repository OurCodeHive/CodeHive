import {useState} from "react";
import { PopupContentsProps } from "@/components/Util/Popup";
import Step1Contents from "./Step1";
import Step2Contents from "./Step2";

const StudyInsert: React.FC<PopupContentsProps> = ({closePopup}) => {
    const [StepIdx, setStepIdx] = useState(1);
    const closePop = () => {
        closePopup(false);
    }

    return (
        <>
         {StepIdx === 1 ? (
            <Step1Contents closePop={closePop} />
         ) : (
            <Step2Contents />
         )}
        </>
    )
};

export default StudyInsert;