import TabStyle from '../css/Tab.module.css';

const TabBtn = ({idx, title, activeFlag, changeTab} : {idx: number, title: string, activeFlag: boolean, changeTab: (idx: number)=> void}) => {    
	return (
      <>
        { activeFlag ? (
            <div className={`${TabStyle.tab_btn} ${TabStyle.active}`}>{title}</div>
          ) : (
            <div className={`${TabStyle.tab_btn}`} onClick={() => changeTab(idx)}>{title}</div>
          )
        }
      </>
    )
};

export default TabBtn;