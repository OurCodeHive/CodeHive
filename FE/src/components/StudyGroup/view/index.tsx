import React, {useEffect, useState} from 'react';
import { StudyType } from '@/type/StudyType';
import { CheckUserId } from '@/atom/UserAtom';
import { getView } from '@/api/study';
import StudyViewInfo from './info';
import Tab, {TabType} from '@/utils/Tab/Tab';
import NoticeList from '../notice/list/List';
import DocumentList from '../document/list/List';
import StudyViewMenu from '../menu/Menu';
import ChatFrameComp from '@/components/chat/ChatFrameComp';


const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const StudyView = () => {
  const [ViewContents, setViewContents] = useState<StudyType>({} as StudyType);
  const LeaderFlag: boolean = CheckUserId(ViewContents?.users_id as number);
  const initIdx = 0;
  const TabContents = [] as TabType[];
  TabContents.push({title : "공지", contents : <NoticeList studyinfoId={studyinfoId} studyLeaderId={ViewContents.users_id!} />});
  TabContents.push({title : "자료", contents : <DocumentList studyinfoId={studyinfoId} />});
  
  async function fetchData() {
    await getView(studyinfoId, ({data}) => {
      setViewContents(data);
    }, (error) => {console.log(error)});
  }

  useEffect(() => {
    void fetchData();
  }, []);

  return (
    <div className="col-12">

      <div className="col-12 col-md-8 pl30 pr15">
          <StudyViewInfo Contents={ViewContents} LeaderFlag={LeaderFlag} />
          <Tab initIdx={initIdx} TabList={TabContents} />
      </div>
      <div className="col-12 col-md-4 pl15">
        <div className="col-12 mb30">
          <StudyViewMenu Contents={ViewContents} fetchData={fetchData}/>
        </div>
        <div className='col-12 mt30'>
        <ChatFrameComp id={String(studyinfoId)} chatMaxHeight='420px' />
        </div>
      </div>
    </div>
  )
}


export default StudyView;