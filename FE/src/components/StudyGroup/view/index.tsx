import React, {useEffect, useState} from 'react';
import { StudyType } from '@/type/StudyType';
import { getView } from '@/api/study';
import StudyViewInfo from './info';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const StudyView: React.FC = () => {
  const [ViewContents, setViewContents] = useState<StudyType | null>(null);
  const [tabIdx, setTabIdx] = useState(1);
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
      </div>      
      <div className="col-12 col-md-4">
        
      </div>
    </div>
  )
}

export default StudyView;
