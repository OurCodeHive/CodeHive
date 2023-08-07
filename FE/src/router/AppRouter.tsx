import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppWelcome from "@/pages/AppWelcome";
import IDE from "@/pages/AppIDE";
// import AppLogin from "@/pages/AppLogin";
import AppStudy from "@/pages/AppStudy";
import AppInvite from "@/pages/AppInvite";
import AppNotFound from "@/error/AppNotFound";
import Signup from "@/components/Login/Signup";
import Login from "@/components/Login/Login";
import FindPassword from "@/components/Login/FindPassword";
import ChangePassword from "@/components/Login/ChangePassword";
import AppHome from "@/pages/AppHome";
import TimerApp from "@/components/home/Timer";
const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={Dashboard}></Route> */}
          {/* <Route path="*" element={NotFound}></Route> */}
          <Route path="/" element={<AppWelcome/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/study" element={<AppStudy/>}></Route>
          <Route path="/invite" element={<AppInvite/>}></Route>
          <Route path="/ide/:id" element={ <IDE/> }></Route>
          <Route path="/*" element={<AppNotFound/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/findpassword" element={<FindPassword/>}/>
          <Route path="/changepassword" element={<ChangePassword/>}/>
          <Route path="/home" element={<AppHome/>}/>
          <Route path="/timer" element={<TimerApp/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
};

export default AppRouter;
