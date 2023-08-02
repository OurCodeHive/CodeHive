import React, { useState } from "react";
import FileInfoStyle from "./css/FileInfo.module.css";

const FileInfo = ({inheritRef, multi} : {inheritRef : React.RefObject<HTMLInputElement>, multi : boolean}) => {
    const [files, setFiles] = useState<File[]>([]);

    const settingInfoList = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFiles(() => Array.from(e.target.files || []));
    }

    const handleDelete = (index: number) => {
        const newFiles = [...files.slice(0, index), ...files.slice(index + 1)];
        const store = new DataTransfer();
        newFiles.forEach((file) => store.items.add(file));
        if(inheritRef.current){
            inheritRef.current.files = store.files;
        }
        setFiles(() => newFiles);
    }

	return (
        <div className={`col-12 ${FileInfoStyle.file_info_con}`}>
            {multi ? <input type="file" ref={inheritRef} className={FileInfoStyle.inputFile} onChange={settingInfoList} multiple /> : <input type="file" ref={inheritRef} className={FileInfoStyle.inputFile} onChange={settingInfoList}/>}
            <ul className="col-12">
                {files.map((file, index) => (
                    <li key={index}><span>{file.name}<button type="button" className={`${FileInfoStyle.delete_icon}`} onClick={() => handleDelete(index)}>삭제</button></span></li>
                ))}
            </ul>
        </div>
    )
}

export default FileInfo;