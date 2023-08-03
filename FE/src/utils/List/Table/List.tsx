import TableListStyle from './css/ListTable.module.css';

const TableList = ({TableWidGroup, ListTitle, ListContents} : {TableWidGroup : string[], ListTitle : string[], ListContents : object[]}) => {
    
    return (
      <div className={`col-12 ${TableListStyle.table_style_0_con}`}>
        <table className={`col-12 ${TableListStyle.table_style_0}`}>
            <colgroup>
                {TableWidGroup.map((item, index) => <col key={index} width={item}/>)}
            </colgroup>
            <thead>
                <tr>
                    {ListTitle.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                
            </tbody>
        </table>
      </div>
    )
}
  
export default TableList;
  
