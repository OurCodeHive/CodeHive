import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'


export default function saveButton(content: string, title: string) {
  asBlob(content)
  .then((data :any) => {
    saveAs(data, presentTime() + ' ' + title + '.docx')
  })
};


function presentTime() {
  let date = new Date();
  let year = date.getFullYear();
  let month = "0" + (date.getMonth() + 1);
  let day = "0" + date.getDate();
  let hour = "0" + date.getHours();
  let minute = "0" + date.getMinutes();
  // let second = "0" + date.getSeconds();
  return String(year).substr(-2) + "-" + month.substr(-2) + "-" + day.substr(-2) + " "+ hour.substr(-2) + minute.substr(-2);
}