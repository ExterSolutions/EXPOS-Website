import React, { useEffect, useState } from "react";
import Header from "../../components/_main/Header/Header";
import Footer from "../../components/_main/Footer";
import Login from "../../components/_main/Auth/Login";
import { useNavigate } from "react-router-dom";
import LoadingLayout from "../../layouts/LoadingLayout";
// import "../../assets/styles/new/homepage/login/LoginPage.css"; 

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("user") ?? null;
        if (user != null) {
            const userData = JSON.parse(user);
            if (userData) {
                // Respect any redirectTo path saved before the login redirect
                const redirectTo = localStorage.getItem("redirectTo") || "/";
                localStorage.removeItem("redirectTo");
                navigate(redirectTo);
            }
        }
        setLoading(false);
    }, [navigate]);

    return (
        <>
            {loading ? (
                <LoadingLayout />
            ) : (
                <>
                    <Header />
                    <div className="nav-margin"></div>
                    <div className="login-container">
                        <div className="login-card">
                       
                            <Login setLoading={setLoading} />
                           
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
}

export default LoginPage;