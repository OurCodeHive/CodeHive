import {useState} from 'react';
import TabBtn from "./item/Btn";
import TabStyle from './css/Tab.module.css';

export type TabType = {
  title : string;
  contents : React.FC;
}

const Tab = ({initIdx, TabList} : {initIdx: number, TabList: TabType[]}) => {   
  const [tabIdx, setTabIdx] = useState(initIdx);
  let Content = TabList[tabIdx].contents;
  const changeIdx = (idx: number) => {
    Content = TabList[idx].contents;
    setTabIdx(() => idx);
  }

  const btnList = [] as string[];
  for(let i=0; i < TabList.length; i++){
    btnList.push(TabList[i].title);
  }

	return (
    <div className="col-12">
      <div className={`col-12 ${TabStyle.tab_btn_wrap}`}>
        <div className={`col-12 ${TabStyle.tab_btn_con}`}>
          {btnList.map((item, index) => (
            <TabBtn key={index} idx={index} title={item} activeFlag={tabIdx == index} changeTab={changeIdx} />
          ))}
        </div>
      </div>
      <div className={`col-12 ${TabStyle.tab_contents_con}`}>
        <Content />
      </div>
    </div>
    )
};

export default Tab;