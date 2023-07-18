import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Dashboard } from "../components/Dashboard";
import NotFound from "../views/NotFound";


const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={Dashboard}></Route>
          <Route path="*" element={NotFound}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
};

export default AppRouter;
