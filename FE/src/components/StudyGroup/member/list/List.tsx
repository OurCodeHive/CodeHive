import {useState, useEffect} from "react";
import { getMemberList } from '@/api/study';
import { UserType } from "@/type/UserType";
import UserListItem from './item/ListItem';
import Pagination, { PaginationType } from '@/utils/Pagination/Pagination';
import Style from '@/res/css/module/StudyGroupMember.module.css';
import StudyInvite from "@/components/StudyGroup/invite/Invite";
import { ContentsPopup } from '@/utils/Popup';

const StudyGroupMemberList = ({studyinfoId, closePop, LeaderFlag, LeaderId} : {studyinfoId : number, closePop: () => void, LeaderFlag:boolean, LeaderId:any}) => {
    const param = {
        study : studyinfoId,
        page : 0,
        size : 10
    }
    const [TotalCnt, setTotalCnt] = useState(0);

    const changePage = (idx: number) => {
        param.page = idx;
        void getList();
    }

    const [userList, setUserList] = useState<UserType[]>([]);

    useEffect(() => {
        void getList();
    }, []);

    const PaginationInfo:PaginationType = {
        totalCnt : TotalCnt,
        perSize : param.size,
        range : 5,
        changeIdx : changePage
    };

    const getList = async () => {
        await getMemberList(param, ({data}) => {
            setTotalCnt(data.totalCnt);
            setUserList(data.userList);
            // console.log(data.userList)
        }, (error) => {console.log(error)})
    }

    const refreshList = () => {
        void getList();
    }

    const [InvitePopupFlag, setInvitePopupFlag] = useState(false);
    const changeInvitePopupFlag = (flag: boolean) => {setInvitePopupFlag(() => flag)};
    const InvitePopupInfo = {
        PopupStatus : InvitePopupFlag,
        zIndex : 10000,
        maxWidth: 500,
        ClosePopupProp : () => changeInvitePopupFlag(false),
        PopupTitle : "멤버 초대",
        PopupContents : <StudyInvite refreshList={refreshList} closePop={() => changeInvitePopupFlag(false)} studyInfoId={studyinfoId} />
    }

    return (
        <div className="col-12">
            <ul className={`col-12 mb30 ${Style.member_list_con}`}>
                {userList.length > 0 ? userList.map((item, index) => <UserListItem LeaderId={LeaderId} LeaderFlag={LeaderFlag} key={index} item={item} studyinfoId={studyinfoId} refreshList={refreshList} />) : <div>등록된 멤버가 없습니다</div>}
            </ul>
            <div className="col-12 mb30">
                <Pagination PaginationInfo={PaginationInfo} />
            </div>
            <div className="col-12 tc btn_style_0_con">
                <button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={closePop}>닫기</button>
                {
                    LeaderFlag?
                    <button type="button" className="btn_style_0 bg_point0" onClick={() => changeInvitePopupFlag(true)}>초대</button>
                    :
                    null
                }
            </div>
            <ContentsPopup PopupInfo={InvitePopupInfo} />
        </div>
    );
}

export default StudyGroupMemberList;
