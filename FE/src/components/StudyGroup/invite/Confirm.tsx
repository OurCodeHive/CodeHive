import { useRecoilValue } from "recoil";
import { userState } from '@/atom/UserAtom';
import { ConfirmPopup } from "@/utils/Popup";
import { inviteProcess } from "@/api/study";

const InviteConfirm = ({studyinfoId, PopupFlag, closePopup, confirmPopup} : {studyinfoId: number, PopupFlag : boolean, closePopup : (flag: boolean) => void, confirmPopup : (flag: boolean) => void}) => {
    
    const userId = useRecoilValue(userState).userId;
    const reject = async () => {
        const param = {usersId : userId, usersstudyId : studyinfoId, status: 5};
        await postData(param);
    }

    const confirm = async () => {
        const param = {usersId : userId, usersstudyId : studyinfoId, status: 1};
        await postData(param);
    }

    const PopupInfo = {
        PopupStatus: PopupFlag,
        zIndex: 10000,
        maxWidth: 440,
        PopupTitle: "초대를 수락하시겠습니까?",
        ClosePopupProp : closePopup,
        CancelPopupProp : void reject(),
        ConfirmPopupProp : void confirm()
    }

    async function postData(param: object){
        await inviteProcess(param, () => {
            console.log("성공완료!");
        }, (error) => console.log(error));
    }

    return (
        <ConfirmPopup PopupInfo={PopupInfo} />
    )
}

export default InviteConfirm;