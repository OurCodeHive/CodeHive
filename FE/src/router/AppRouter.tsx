// import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Dashboard } from "../components/Dashboard";
// import NotFound from "../pages/NotFound";
// import AppDashBoard from "../pages/AppDashBoard";
import AppWelcome from "@/pages/AppWelcome";
import IDE from "@/pages/AppIDE";
import AppNotFound from "@/error/AppNotFound";
import Signup from "@/components/Login/Signup";
import Login from "@/components/Login/Login";
import FindPassword from "@/components/Login/FindPassword";
import ChangePassword from "@/components/Login/ChangePassword";

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={Dashboard}></Route> */}
          {/* <Route path="*" element={NotFound}></Route> */}
          <Route path="/" element={<AppWelcome/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/ide/:id" element={ <IDE/> }></Route>
          <Route path="/*" element={<AppNotFound/>}/>

          <Route path="/signup" element={<Signup/>}/>
          <Route path="/findpassword" element={<FindPassword/>}/>
          <Route path="/changepassword" element={<ChangePassword/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default AppRouter;
