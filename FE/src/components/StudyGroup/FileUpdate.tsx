import { useState, useRef, useEffect } from 'react';
import { insertData } from "@/api/study";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { AlertPopup } from "@/utils/Popup";
import CustomEditor from "@/utils/CustomEditor/CustomEditor";
import FileInput from "@/utils/FileInfo/Input";
import { file } from '@/type/StudyDocumentType';
import { StudyDocumentDetailItemType } from '@/type/StudyDocumentType';
import FileInfoStyle from "@/utils/FileInfo/css/FileInfo.module.css";
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { studyFileState } from '@/atom/DocumentContentsAtom';
import { fileListState } from '@/atom/FileListAtom';


interface FileUpdateProps {
	// info: StudyDocumentDetailItemType;
	closePopup: (flag: boolean) => void;
	updateAlert: () => void;
}


const FileUpdate = (props: FileUpdateProps) => {

	const [DocumentContents, setDocumentContents] = useRecoilState<StudyDocumentDetailItemType>(studyFileState);
	const [fileList, setFileList] = useRecoilState(fileListState);

	const userId = useRecoilValue(userState).userId;

	const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
	const [AlertPopupTitle, setAlertPopupTitle] = useState("");

	const titleInput: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
	const descInput: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
	const profileInput: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

	const [title, setTitle] = useState<string>(DocumentContents.title);
	// const [content, setContent] = useState<string>(props.info.content);
	// const [fileList, setFileList] = useState(props.info.fileList);
	const [updateFileList, setupdateFileList] = useState(new Array(DocumentContents.fileList.length).fill(false));
	const AlertPopupInfo = {
		PopupStatus: AlertPopupFlag,
		zIndex: 10000,
		maxWidth: 440,
		PopupTitle: AlertPopupTitle,
		ClosePopupProp: () => changePopupFlag(false),
	}

	const changePopupFlag = (flag: boolean) => {
		setAlertPopupFlag(() => flag);
	};

	// 폼 submit 이벤트
	const formSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		if (DocumentContents.title == '') {
			setAlertPopupTitle("제목을 입력해주세요");
			changePopupFlag(true);
			return;
		}

		// 삭제할이미지 담기
		const deleteList = []
		for (let i = 0; i < updateFileList.length; i++)
			if (updateFileList[i])
				deleteList.push(DocumentContents.fileList[i].id);

		if (!profileInput.current?.files?.length && deleteList.length == DocumentContents.fileList.length) {
			setAlertPopupTitle("파일을 등록해 주세요");
			changePopupFlag(true);
			return
		}

		const param = new FormData();
		param.append("userId", String(userId));
		param.append("title", title);
		param.append("studyInfoId", String(DocumentContents.id));
		param.append("content", String(descInput.current?.value));
		param.append("deleteList", String(deleteList));

		if (profileInput.current?.files) {
			for (let i = 0; i < profileInput.current?.files.length; i++) {
				param.append("studyFile", profileInput.current?.files[i]);
			}
		}

		const url = import.meta.env.VITE_APP_SERVER + "study/file";
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			}
		};
		const temp = { ...DocumentContents }
		temp.title = title;
		temp.content = String(descInput.current?.value);
		

		axios.put(url, param, config)
		.then((res) => {
			const fileList = res.data;
			setFileList(fileList)
			setDocumentContents(temp);
		})
		.catch((err) => {
			console.log(err);
		})
		props.closePopup(false)

	}

	const handleTitle = (event: any) => {
		setTitle(event.target.value);
	}

	const deleteFile = (index: number) => {
		const temp = [...updateFileList];
		temp[index] = !temp[index];
		setupdateFileList(temp);
	}


	return (
		<form className="col-12" encType="multipart/form-data" onSubmit={(e) => void formSubmit(e)}>
			<div className="col-12 mb37 form_style_0_con">
				<div className="col-12 form_style_0">
					<div className="col-12 col-md-0 label_box">
						<label htmlFor="studyInsertTitle" className="essential">제목 변경</label>
					</div>
					<div className="col-12 col-md-0 input_box">
						<input type="text" id="studyInsertTitle" className="input_style_0"
							placeholder="제목을 입력해주세요"
							ref={titleInput}
							value={title}
							onChange={(event) => { handleTitle(event) }}
						/>
					</div>
				</div>
				<div className="col-12 form_style_0">
					<div className="col-12 col-md-0 label_box">
						<span>내용</span>
					</div>
					<div className="col-12 col-md-0 input_box">
						<CustomEditor editorRef={descInput} content={DocumentContents.content} />
					</div>
				</div>
				<div className="col-12 form_style_0 type_file">
					<div className="col-12 col-md-0 label_box">
						<span className="essential">스터디 자료</span>
					</div>
					<div className="col-12 col-md-0 input_box">
						<div className="col-12 mb12 addr_text"></div>
						{
							DocumentContents.fileList.map((file: file, index: number) => {
								return (
									<div className="col-12" key={index}>
										<span
											style={{
												cursor: "pointer",
												fontSize: "15px",
												marginTop: "3px",
												display: "inline-block"
											}}
											onClick={() => { deleteFile(index) }}>
											{
												updateFileList[index] ?
													<div style={{ display: "flex" }}>
														<div
															style={{ textDecoration: "line-through" }}>{file.originName}.{file.etc}
														</div>
														<div>&nbsp;🔄</div>
													</div>

													:
													<div>{file.originName}.{file.etc}&nbsp;❌</div>
											}
										</span>
									</div>
								)
							})
						}
						<button type="button"
							className="col-0 btn_style_0 bg_black border_none"
							onClick={() => profileInput.current?.click()}>추가 업로드</button>
						<FileInput inheritRef={profileInput} multi={true} />
					</div>
				</div>
			</div>
			<div className="col-12 tc btn_style_0_con">
				<button type="button" className="btn_style_0 mr15 bg_a2a2a2" onClick={() => {
					props.closePopup(false);
				}}>취소</button>
				<button type="submit" className="btn_style_0 bg_point0">수정완료</button>
			</div>
			<AlertPopup PopupInfo={AlertPopupInfo} />
		</form>
	)
};




export default FileUpdate;