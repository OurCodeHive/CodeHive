import React, {useState} from "react";
import { inviteMember } from "@/api/study";
import { AlertPopup } from "@/utils/Popup";
import { EmailCheck } from "@/utils/valid/Valid";
import InviteEmailStyle from '@/res/css/module/InviteEmail.module.css';

const StudyInsert2Step = ({closePop, studyInfoId} : {closePop: () => void, studyInfoId: number}) => {
    const [CompleteStatus, setCompleteStatus] = useState(false);
    const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
    const [AlertPopupTitle, setAlertPopupTitle] = useState("");
    const [EmailList, setEmailList] = useState(["",""]);

    const AlertPopupInfo = {
        PopupStatus : AlertPopupFlag,
        zIndex : 10000,
        maxWidth: 440,
        PopupTitle : AlertPopupTitle,
        ClosePopupProp : () => changePopupFlag(false),
    }

    const changePopupFlag = ( flag:boolean ) => {
        setAlertPopupFlag(() => flag);
        if(CompleteStatus){ //전송완료일 때
            closePop();
        }
    };

    //이메일 input 추가 함수
    const emailAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        const currentList = [...EmailList];
        currentList.push("");
        setEmailList(currentList);
    }

    //이메일 input 삭제
    const emailRemove = (e: React.MouseEvent, targetIdx: number) => {
        e.preventDefault();
        setEmailList([...EmailList.slice(0, targetIdx), ...EmailList.slice(targetIdx + 1, EmailList.length)]);
    }

    //value 변경 함수
    const emailValueChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        setEmailList([...EmailList.slice(0, idx), String(e.currentTarget.value), ...EmailList.slice(idx + 1, EmailList.length)]);
    }

    

    //이메일 링크 전송
    const inviteEmail = async (e: React.MouseEvent):Promise<void> => {
        e.preventDefault();
        //중복제거
        const curEmail = [] as string[];
        let flag = true;
        EmailList.forEach((item) => {
            if(!EmailCheck(item)) return flag = false; //유효성 실패시 종료
            else if(!curEmail.includes(item)) curEmail.push(item); //중복확인 후 추가
        });
        //유효성 실패
        if(!flag){
            setAlertPopupTitle("올바르지 않은 이메일이 있습니다.");
            changePopupFlag(true);
            return;
        }

        const param = {
            studyinfoId : studyInfoId,
            email : curEmail
        }
        await inviteMember(param, () => {
            setAlertPopupTitle("초대 이메일이 전송되었습니다");
            setCompleteStatus(() => true);
            changePopupFlag(true);
        }, () => {
            setAlertPopupTitle("에러가 발생했습니다<br/>관리자에 문의해주세요");
            changePopupFlag(true);
        })
    }

    return (
        <div className="col-12">
            <div className="col-12 mb24 tc headline">그룹이 만들어졌습니다!</div>
            <div className="col-12 mb34 tc sub_title">E-mail 전송으로<br/>스터디원들을 초대해보세요</div>
            <div className={`col-12 mb20 col-center mw-400 ${InviteEmailStyle.email_link_con}`}>
                <div className={`col-12 mb7 ${InviteEmailStyle.email_link_title}`}>E-mail</div>
                <ul className={`col-12 ${InviteEmailStyle.email_link_input_con}`}>
                    {EmailList.map((item, index) => <li key={index}><input type="email" onChange={(e) => emailValueChange(e, index)} value={item} className="input_style_0" placeholder="초대할 이메일을 입력해주세요" /><button type="button" className={`${InviteEmailStyle.email_link_remove_btn}`} onClick={(e) => emailRemove(e, index)}>X</button></li>)}
                </ul>
                <button type="button" className={`col-12 tc ${InviteEmailStyle.email_add_btn_con}`} onClick={(e) => emailAdd(e)}>Add+</button>
            </div>
            <div className="col-12 mb50 tc btn_style_0_con">
            <button type="button" className="btn_style_0 bg_point0" onClick={(e) => void inviteEmail(e)}>초대링크 전송</button>
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 bg_black" onClick={closePop}>닫기</button>
            </div>
            <AlertPopup PopupInfo={AlertPopupInfo} />
        </div>
    )
};

export default StudyInsert2Step;