import React, { useContext, useEffect } from "react";
import {GlobalContext} from "../context/GlobalContext";
import { Outlet, useNavigate } from "react-router-dom";

function AuthLayout() {
    const navigate = useNavigate();
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <div className="container-fluid">
                <Outlet />
            </div>
        </>
    );
}

export default AuthLayout;
