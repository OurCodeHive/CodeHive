import TabStyle from './css/Tab.module.css';

const TabBtn = ({key, title, activeFlag, changeTab} : {key: number, title: string, activeFlag: boolean, changeTab: (idx: number)=> void}) => {    
	return (
      <>
        { activeFlag ? (
            <div className={`${TabStyle.tab_btn} ${TabStyle.active}`}>{title}</div>
          ) : (
            <div className={`${TabStyle.tab_btn}`} onClick={() => changeTab(key)}>{title}</div>
          )
        }
      </>
    )
};

export default TabBtn;