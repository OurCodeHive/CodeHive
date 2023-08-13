import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppWelcome from "@/pages/AppWelcome";
import AppIDE from "@/pages/AppIDE";
import AppStudy from "@/pages/AppStudy";
import AppInvite from "@/pages/AppInvite";
import AppQuit from "@/pages/AppQuit";
import AppNotFound from "@/error/AppNotFound";
import Signup from "@/components/Login/Signup";
import AppLogin from "@/pages/AppLogin";
import FindPassword from "@/components/Login/FindPassword";
import ChangePassword from "@/components/Login/ChangePassword";
import AppHome from "@/pages/AppHome";
import TimerApp from "@/components/home/Timer";
import RedirectLogin from "@/components/Login/RedirectLogin";
import CalendarCRUD from "@/components/StudyGroup/view/calendar/CalendarCRUD";


const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppWelcome/>}></Route>
          <Route path="/login" element={<AppLogin/>}></Route>
          <Route path="/login/redirect" element={<RedirectLogin/>}></Route>
          <Route path="/study" element={<AppStudy/>}></Route>
          <Route path="/invite" element={<AppInvite/>}></Route>
          <Route path="/quit" element={<AppQuit/>}></Route>
          <Route path="/ide/:id" element={ <AppIDE/> }></Route>
          <Route path="/*" element={<AppNotFound/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/findpassword" element={<FindPassword/>}/>
          <Route path="/changepassword" element={<ChangePassword/>}/>
          <Route path="/home" element={<AppHome/>}/>
          <Route path="/timer" element={<TimerApp/>}/>
          <Route path="/calendarcrud" element={<CalendarCRUD/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default AppRouter;
