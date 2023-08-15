import {useState, useEffect} from "react";
import { PaginationType } from '@/utils/Pagination/Pagination';

interface User{
    userId: Number;
    nickName: String;
    email: String;
    status: String;
}

const StudyGroupUserList = ({ studyinfoId, page, size }: { studyinfoId: number, page: number, size: number }) => {
    const param = {
        page: 0,
        size: 10
    }

    const [userList, setUserList] = useState<User[]>([]);
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

    const getList = () => {
        fetch(`http://localhost:8080/api/study/user/list?study=${studyinfoId}&page=${page}&size=${size}`, {

            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          })
            .then(response => response.json())
            .then(data => {
                console.log("스터디 그룹에 가입된 유저들", data.totalCnt, "명");

                const userListResponse = data.userList.map((user: User) => ({
                    userId: user.userId,
                    nickName: user.nickName,
                    email: user.email,
                    status: user.status,
                  }));

                setTotalCnt(data.totalCnt);
                setUserList(userListResponse)
            })
            .catch(error => {
              console.error("Error:", error);
            });
    };

    return(
        <div>
            {userList.map((user, index) => (
                <div key={index}>{user.userId.toString()}, {user.nickName}, {user.email}, {user.status}</div>
                )
            )}
        </div>
    );
}

export default StudyGroupUserList;
