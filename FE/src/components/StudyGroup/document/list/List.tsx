import {useState} from 'react';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const DocumentList = () => {
    return (
        <div className="col-12">
            자료 탭
        </div>
    )
}

export default DocumentList;