import { useState, useEffect } from 'react';
import { StudyDocumentType, StudyDocumentDetailType, StudyDocumentDetailItemType, file } from '@/type/StudyDocumentType';
import { CheckUserId } from '@/atom/UserAtom';
import { getDocumentView, deleteStudyfile } from '@/api/study';
import CustomEditorResult from '@/utils/CustomEditor/CustomEditorResult';
import { ConfirmPopup } from '@/utils/Popup';
import FileUpdate from '@/components/StudyGroup/FileUpdate';
import ContentsPopup from '@/utils/Popup/Contents';
import { useRecoilState } from 'recoil';
import { studyFileState } from '@/atom/DocumentContentsAtom';
import { fileListState } from '@/atom/FileListAtom';


const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const DocumentView = ({ studyDocumentId, closePopup, completePopup, ide }: { studyDocumentId: number, closePopup: (flag: boolean) => void, completePopup : () => void, ide:boolean }) => {

	const [DocumentContents, setDocumentContents] = useRecoilState(studyFileState);
	const [fileList, setFileList] = useRecoilState(fileListState);
	
	const AuthorFlag = useState(CheckUserId(DocumentContents.userId));

	const [PopupFlag, setPopupFlag] = useState(false);
	const [updatePopupFlag, setUpdatePopupFlag] = useState(false);

	const [PopupContents, setPopupContents] = useState(
		<FileUpdate
			// info={DocumentContents}
			closePopup={() => setUpdatePopupFlag(false)}
			updateAlert={() => alert("수정완료")}
			completePopup={completePopup}
		/>
	);

	const PopupInfo = {
		PopupStatus: PopupFlag,
		zIndex: 10000,
		maxWidth: 440,
		PopupTitle: "삭제하시겠습니까?",
		ClosePopupProp: () => changePopupFlag(false),
		ConfirmPopupProp: () => removeConfirm(false)
	};

	const FileUpdatePopUpProps = {
		PopupStatus: updatePopupFlag,
		zIndex: 9999,
		maxWidth: 800,
		PopupTitle: "자료 수정",
		PopupContents: PopupContents,
		ClosePopupProp: () => changePopupFlag(false),
		completePopup: () => completePopup
	}

	const updateFile = (flag: boolean) => {
		// closePopup(false)
		setPopupContents(
			<FileUpdate
				closePopup={() => setUpdatePopupFlag(false)}
				updateAlert={() => alert("수정완료")}
				completePopup={completePopup}
			/>
		)
		changeUpdatePopupFlag(true)
	}

	const changeUpdatePopupFlag = (flag: boolean) => {
		setUpdatePopupFlag(() => flag);
	};

	const changePopupFlag = (flag: boolean) => {
		setPopupFlag(() => flag);
	};

	const removeConfirm = (flag: boolean) => {
		requestDeleteStudyFile(studyDocumentId);
		setPopupFlag(() => flag);
	};

	const requestDeleteStudyFile = async (studyDocumentId: number) => {
		await deleteStudyfile(studyDocumentId, () => {
			closePopup(false)
			completePopup();
		}, (err) => console.log(err));
	};

	const removeNotice = () => {
		setPopupFlag(() => true);
	};

	const getView = async () => {
		await getDocumentView(studyinfoId, studyDocumentId, ({ data }) => {
			setDocumentContents(data);
			setFileList(data.fileList);
		}, (error) => { console.log(error) })
	}

	const fnGetFileSize = (filesize: number) => {
		var text = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
		var e = Math.floor(Math.log(filesize) / Math.log(1024));
		return (filesize / Math.pow(1024, e)).toFixed(2) + " " + text[e];
	};

	const downloadFile = () => {
		for (const file of fileList) {
			const element = document.createElement('a');
			element.href = file.path;
			element.click();
		}
	}

	useEffect(() => {
		void getView();
	}, []);

	return (
		<div className="col-12 pt50 pr20 pb20 pl20">
			<div className="col-12 mb50 form_style_0_con type_view">
				<div className="col-12 form_style_0">
					<div className="col-12 col-md-0 label_box"><span><strong>제목</strong></span></div>
					<div className="col-12 col-md-0 input_box">{DocumentContents.title}</div>
				</div>
				<div className="col-12 form_style_0">
					<div className="col-12 col-md-0 label_box"><span><strong>내용</strong></span></div>
					<div className="col-12 col-md-0 input_box"><CustomEditorResult param={DocumentContents?.content as string} /></div>
				</div>
				<div className="col-12 form_style_0">

					<div className="col-12 col-md-0 label_box">
						<div style={{
							display: "flex",
							cursor: "pointer",
						}} onClick={() => {
							downloadFile();
						}}>
							<span><strong>학습 자료</strong></span>
							<div>
								<img style={{
									width: "20px",
									paddingTop: "2px",
									paddingLeft: "3px"
								}}
									src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/download_icon.png">
								</img>
							</div>
						</div>
					</div>

					<div className="col-12 col-md-0 input_box">
						{
							fileList.map((file: file, index: number) => {
								return (
									<a
										href={file.path}
										style={{
											marginBottom: "5px",
											display: "flex",
											cursor: "pointer"
										}} key={index}>
										{file.originName}.{file.etc}
										<div>
											<img style={{
												width: "20px",
												paddingTop: "3px",
												paddingLeft: "3px"
											}} src="https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/download_icon.png">
											</img>
										</div>
										&nbsp;&nbsp;&nbsp;{fnGetFileSize(file.fileSize)}
									</a>
								)
							})
						}
					</div>
				</div>
			</div>
			<div className="col-12 tc btn_style_0_con">
				<button type="button" className="btn_style_0 bg_a2a2a2" onClick={() => closePopup(false)}>닫기</button>
				{AuthorFlag?
					<>
						{
							ide?
							null
							:
							<div className='ml15 show'>
								<button type="button" className="btn_style_0 bg_point0" onClick={
									() => updateFile(false)
								}>변경</button>
								<button type="button" className="btn_style_0 ml15" onClick={() => removeNotice()}>삭제</button>
							</div>
						}
					</>
					: 
					null
				}
			</div>
			<ContentsPopup PopupInfo={FileUpdatePopUpProps} />
			<ConfirmPopup PopupInfo={PopupInfo} />
		</div>
	)
}


export default DocumentView;