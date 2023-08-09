import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import axios from 'axios';
import { authHttp } from '@/api/http';
import { ContentsPopup } from '@/utils/Popup';
import FileUpload from '../../FileUpload';
import toast, { Toaster } from 'react-hot-toast';


const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const DocumentList = ({id}:{id:string | undefined}) => {

	const changePopupFlag = (flag: boolean) => {setPopupFlag(() => flag);};

	const [popupFlag, setPopupFlag] = useState(false);
	const PopupInfo = {
		PopupStatus : popupFlag,
		zIndex : 9999,
		maxWidth: 800,
		PopupTitle : "스터디 만들기",
		ClosePopupProp : () => changePopupFlag(false),
		PopupContents : <FileUpload closePopup={changePopupFlag} uploadAlert={notifyUploadFile}/>
	}

	useEffect(() => {
		const url = import.meta.env.VITE_RTC + "api/study/" + id + "/document?page=0&size=4";
		console.log(url);
		axios.get(url)
		.then((res) => {
			console.log(res.data)
		})
		.catch((err) => {
			console.log(err)
		})
	}, [])

	let loginUser = useRecoilValue(userState);
	console.log(loginUser)
	return (
		<div className="col-12">
			<ContentsPopup PopupInfo={PopupInfo}/>
			<button onClick={() => { setPopupFlag(true) }}>자료등록</button>
			<Toaster position="top-right"/>
			{/* {props.id}
			{loginUser.userId} */}
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