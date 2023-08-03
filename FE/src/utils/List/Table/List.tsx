import TableListStyle from './css/ListTable.module.css';

const TableList = ({WidGroup, ListTitle, ListContents} : {WidGroup : string[], ListTitle : string[], ListContents : {[key: string]: string}[]}) => {
    
    return (
      <div className={`col-12 ${TableListStyle.table_style_0_con}`}>
        <table className={`col-12 ${TableListStyle.table_style_0}`}>
            <colgroup>
                {WidGroup.map((item, index) => <col key={index} width={item}/>)}
            </colgroup>
            <thead>
                <tr>
                    {ListTitle.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
            </thead>
            <tbody>
                {ListContents.map((item, index) => (
                    <tr key={index}>
                        {ListTitle.map((title, idx) => <td key={idx}>{item[title]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    )
}
  
export default TableList;
  
