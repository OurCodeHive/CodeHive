import TableListStyle from './res/css/ListTable.module.css';

const TableList = ({WidGroup, ListTitle, ListContents, NoDataText} : {WidGroup : string[], ListTitle : string[], ListContents : JSX.Element[], NoDataText: string}) => {
    const tdLength = WidGroup.length;  

    return (
      <div className={`col-12 ${TableListStyle.table_style_1_con}`}>
        <table className={`col-12 ${TableListStyle.table_style_1}`}>
            <colgroup>{WidGroup.map((item, index) => <col key={index} width={item}/>)}</colgroup>
            <thead><tr>{ListTitle.map((item, index) => <th key={index}>{item}</th>)}</tr>
            </thead>
            <tbody>
              {ListContents.length > 0 ? ListContents.map((item) => item) : <tr className={`${TableListStyle.no_data}`}><td colSpan={tdLength}>{NoDataText}</td></tr>}
            </tbody>
        </table>
      </div>
    )
}
  
export default TableList;
  
