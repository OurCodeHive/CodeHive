import { asBlob } from 'html-docx-js-typescript'
import { saveAs } from 'file-saver'

export default function saveButton(content: string, title: string) {
  asBlob(content)
  .then((data :any) => {
    saveAs(data, presentTime() + ' ' + title + '.docx')
  })
};

function presentTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${String(year).slice(-2)}-${month}-${day} ${hour}:${minute}`;
}