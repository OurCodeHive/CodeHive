import "@/res/css/common/import.css";
import AppRouter from "@/router/AppRouter";
import { RecoilRoot } from 'recoil';

function App() {
  return (
    <RecoilRoot>
     <AppRouter />
    </RecoilRoot>
  )
}
export default App;
