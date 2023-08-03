import React, {useEffect, useState} from 'react';
import { StudyType } from '@/type/StudyType';
import { getView } from '@/api/study';
import StudyViewInfo from './info';
import Tab, {TabType} from '@/utils/Tab/Tab';
import NoticeList from '../notice/list';
import DocumentList from '../document/list';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const StudyView: React.FC = () => {
  const [ViewContents, setViewContents] = useState<StudyType>({} as StudyType);
  const initIdx = 0;
  const TabContents = [] as TabType[];
  TabContents.push({title : "공지사항", contents : NoticeList});
  TabContents.push({title : "자료", contents : DocumentList});

  useEffect(() => {
    async function fetchData() {
      await getView(studyinfoId, ({data}) => {
        setViewContents(data);
      }, (error) => {console.log(error)});
    }
    void fetchData();
  }, []);

  return (
    <div className="col-12 pt50">
      <div className="col-12 col-md-8">
          <StudyViewInfo Contents={ViewContents} />
          <Tab initIdx={initIdx} TabList={TabContents} />
      </div>      
      <div className="col-12 col-md-4">
        
      </div>
    </div>
  )
}

export default StudyView;
