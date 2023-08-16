import { useRecoilValue } from "recoil";
import { userState } from '@/atom/UserAtom';
import { ConfirmPopup } from "@/utils/Popup";
import { inviteProcess } from "@/api/study";

interface params {
    usersId : number,
    userstudyId : number,
    status: number
}

const InviteConfirm = ({studyinfoId, PopupFlag, confirmPopup} : {studyinfoId: number, PopupFlag : boolean, confirmPopup : (flag: boolean) => void}) => {
    
    const userId = useRecoilValue(userState).userId!;

    const postData = async (param: params) => {
        let flag = true;
        if(param.status == 5) flag = false;
        await inviteProcess(param, () => {confirmPopup(flag)}, (error) => console.log(error));
    }

    function reject() {
        const param = {usersId : userId, userstudyId : studyinfoId, status: 5};
        void postData(param);
    }

    function confirm() {
        const param = {usersId : userId, userstudyId : studyinfoId, status: 1};
        void postData(param);
    }

    const PopupInfo = {
        PopupStatus: PopupFlag,
        zIndex: 10000,
        maxWidth: 440,
        PopupTitle: "초대를 수락하시겠습니까?",
        ClosePopupProp : reject,
        CancelPopupProp : reject,
        ConfirmPopupProp : confirm
    }

    return (
        <ConfirmPopup PopupInfo={PopupInfo} />
    )
}

export default InviteConfirm;