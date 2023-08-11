import {useState, useEffect} from "react";
import { PaginationType } from '@/utils/Pagination/Pagination';

const StudyGroupUserList = ({ studyinfoId, page, size }: { studyinfoId: number, page: number, size: number }) => {
    const param = {
        page: 0,
        size: 10
    }

    const [ListContents, setListContents] = useState<JSX.Element[]>([]);
    const [TotalCnt, setTotalCnt] = useState(0);

    useEffect(() => {
        void getList();
    }, []);

    const changePage = (idx: number) => {
        param.page = idx;
        void getList();
    }

    const PaginationInfo:PaginationType = {
        totalCnt : TotalCnt,
        perSize : param.size,
        range : 5,
        changeIdx : changePage
    };

    interface User{
        userId: Number;
        nickName: String;
        email: String;
        status: String;
    }

    const getList = () => {
        fetch(`http://localhost:8080/api/study/user/list?study=${studyinfoId}&page=${page}&size=${size}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          })
            .then(response => response.json())
            .then(data => {
                console.log("여기는 들어오니?");
                const userList = data.userList.map((user:User) => (
                    <div>{user.nickName}</div>
                ));

                setTotalCnt(data.totalCnt);
                setListContents(userList)
            })
            .catch(error => {
              console.error("Error:", error);
            });
    };

    return("hi");
}

export default StudyGroupUserList;
