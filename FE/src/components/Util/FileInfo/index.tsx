import React, { useState } from "react";
import FileInfoStyle from "@/res/css/module/util/FileInfo.module.css";

const FileInfo = ({inheritRef, multi} : {inheritRef : React.RefObject<HTMLInputElement>, multi : boolean}) => {
    const [FileList, setFileList] = useState<File[]>([]);

    function settingInfoList(e : React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files != null){
            const Files = [...e.target.files];
            console.dir(Files);
            setFileList(Files);
            
        }
        console.dir(FileList);
    }

	return (
        <ul className={`col-12 ${FileInfoStyle.file_info_con}`}>
            {multi ? <input type="file" ref={inheritRef} className={FileInfoStyle.inputFile} onChange={settingInfoList} multiple /> : <input type="file" ref={inheritRef} className={FileInfoStyle.inputFile} onChange={settingInfoList}/>}

        </ul>
    )
}

export default FileInfo;