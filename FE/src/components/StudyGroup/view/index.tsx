import { StudyType } from '@/type/StudyType';
import React, {useState} from 'react';

const StudyView: React.FC = () => {
  const [ViewContents, setViewContents] = useState<StudyType | null>(null);

  return (
    <div className="col-12">

    </div>
  )
}

export default StudyView;
