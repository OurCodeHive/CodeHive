import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import { Dashboard } from "../components/Dashboard";
import NotFound from "../pages/NotFound";
import AppDashBoard from "../pages/AppDashBoard";
import AppWelcome from "../pages/AppWelcome";
import AppLogin from "../pages/AppLogin";


const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={Dashboard}></Route> */}
          {/* <Route path="*" element={NotFound}></Route> */}
          <Route path="/" element={<AppWelcome/>}></Route>
          <Route path="/login" element={<AppLogin/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default AppRouter;
