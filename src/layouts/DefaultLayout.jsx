import React from "react";
import { Outlet } from "react-router-dom";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
