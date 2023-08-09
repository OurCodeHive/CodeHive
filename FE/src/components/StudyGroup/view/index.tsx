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
import { useParams } from 'react-router-dom';


const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const StudyView = () => {

  const { id } = useParams();
  const [ViewContents, setViewContents] = useState<StudyType>({} as StudyType);
  const LeaderFlag: boolean = CheckUserId(ViewContents?.users_id as number);
  const initIdx = 0;
  const TabContents = [] as TabType[];
  TabContents.push({title : "공지사항", contents : <NoticeList studyinfoId={studyinfoId} LeaderFlag={LeaderFlag}/>});
  TabContents.push({title : "자료", contents : <DocumentList id={id}/>});

  useEffect(() => {
    async function fetchData() {
      await getView(studyinfoId, ({data}) => {
        setViewContents(data);
      }, (error) => {console.log(error)});
    }
    void fetchData();
  }, []);

  return (
    <div className="col-12">
      <div className={`col-12`}>
        <StudyViewMenu Contents={ViewContents} />
      </div>
      <div className="col-12 col-md-8 pl30">
          <StudyViewInfo Contents={ViewContents} LeaderFlag={LeaderFlag} />
          <Tab initIdx={initIdx} TabList={TabContents} />
      </div>
      <div style={{
        position:"absolute",
        right:"-7%"
      }}>
        <ChatFrameComp id={id + ""} />
      </div>
    </div>
  )
}


export default StudyView;