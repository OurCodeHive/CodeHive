// import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Dashboard } from "../components/Dashboard";
// import NotFound from "../pages/NotFound";
// import AppDashBoard from "../pages/AppDashBoard";
import AppWelcome from "@/pages/AppWelcome";
import IDE from "@/pages/AppIDE";
import AppLogin from "@/pages/AppLogin";
import AppNotFound from "@/error/AppNotFound";

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={Dashboard}></Route> */}
          {/* <Route path="*" element={NotFound}></Route> */}
          <Route path="/" element={<AppWelcome/>}></Route>
          <Route path="/login" element={<AppLogin/>}></Route>
          <Route path="/ide/:id" element={ <IDE/> }></Route>
          <Route path="/*" element={<AppNotFound/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default AppRouter;
