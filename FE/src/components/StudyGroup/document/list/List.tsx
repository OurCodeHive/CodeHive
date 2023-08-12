import { useState, useEffect, useRef } from 'react';
import { getDocumentList } from '@/api/study';
import DocumentFilter from './item/Filter';
import DocumentListItem from './item/ListItem';
import Pagination, { PaginationType } from '@/utils/Pagination/Pagination';
import {ContentsPopup} from "@/utils/Popup";
import DocumentView from '../view/View';
import TableList from '@/utils/List/Table/List';
import StudyStyle from '@/res/css/page/StudyView.module.css';
import FileUpload from '../../FileUpload';
import toast, { Toaster } from 'react-hot-toast';

const DocumentList = ({studyinfoId} : {studyinfoId: number}) => {
	const param = {
        page : 0,
        size : 10
    }
    const [ListContents, setListContents] = useState<JSX.Element[]>([]);
    const [TotalCnt, setTotalCnt] = useState(0);

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

    const getList = async () => {
        await getDocumentList(studyinfoId, param, ({data}) => {
            setTotalCnt(data.totalCnt);
            const tempList = data.studyArchives.map((item, index) => <DocumentListItem key={index} item={item} clickEvent={openViewPopup} />);
            setListContents(tempList);
        }, (error) => {console.log(error)})
    }

    useEffect(() => {
        void getList();
    }, []);

    const keywordInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const WidGroup = ["auto", "100px", "150px"];
    const ListTitle = ["제목", "작성자", "작성일"];

    const completeInsert = () => {
        changePage(0);
        changePopupFlag(false);
        console.log("call completeInsert")
        console.log(ListContents)
    }

    const [popupFlag, setPopupFlag] = useState(false);
    const [ViewStudyDocumentId, setViewStudyDocumentId] = useState(-1);
    const [PopupContents, setPopupContents] = useState(
    <DocumentView studyDocumentId={ViewStudyDocumentId} 
    closePopup={() => changePopupFlag(false)}
    completePopup={completeInsert}
    
    />
    );

    const PopupInfo = {
        PopupStatus : popupFlag,
        zIndex : 9999,
        maxWidth: 800,
        PopupTitle : "자료 상세",
        ClosePopupProp : () => changePopupFlag(false),
        PopupContents : PopupContents,
    }

    const changePopupFlag = (flag: boolean) => {
        setPopupFlag(() => flag);
    };

    //상세 팝업 열기
    const openViewPopup = (idx: number) => {
        setViewStudyDocumentId(() => idx);
        PopupInfo.PopupTitle = "자료 상세";
        setPopupContents(<DocumentView studyDocumentId={idx} closePopup={() => changePopupFlag(false)} completePopup={completeInsert}/>);
        changePopupFlag(true);
    }

    const openInsertPopup = () => {
        PopupInfo.PopupTitle = "자료 등록";
        setPopupContents(<FileUpload closePopup={changePopupFlag} uploadAlert={notifyUploadFile} completePopup={completeInsert}/>);
        changePopupFlag(true);
    }



	return (
		<div className="col-12 pt50 pr20 pb20 pl20">
			<DocumentFilter />
			<div className="col-12 mb50">
				<TableList WidGroup={WidGroup} ListTitle={ListTitle} ListContents={ListContents} NoDataText="자료가 없습니다."/>
			</div>
			<div className="col-12">
				<Pagination PaginationInfo={PaginationInfo} />
				<button type="button" className={`${StudyStyle.study_plus_btn} bg_point0`} onClick={openInsertPopup}>+</button>
			</div>
			<ContentsPopup PopupInfo={PopupInfo}/>
		</div>
	)
}


function notifyUploadFile() {

	let sentence = "자료가 등록되었습니다.";

	toast(sentence, {
		duration: 2000,
		icon: '✔️',
		style: {
			fontSize: "15px",
		},
		iconTheme: {
			primary: '#000',
			secondary: '#fff',
		},
		ariaProps: {
			role: 'status',
			'aria-live': 'polite',
		},
	});
}

export default DocumentList;