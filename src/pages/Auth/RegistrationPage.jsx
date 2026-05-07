import React, { useEffect, useState } from "react";
import Header from "../../components/_main/Header/Header";
import Footer from "../../components/_main/Footer";
import Registration from "../../components/_main/Auth/Registration";
import { useNavigate } from "react-router-dom";
import LoadingLayout from "../../layouts/LoadingLayout";
// import "../../../src/assets/styles/register.css"

function RegistrationPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("user") ?? null;
        if (user != null) {
            const userData = JSON.parse(user);
            if (userData) {
                navigate("/");
            }
        }
        setLoading(false);
    }, [navigate]);

    if (loading) {
        return <LoadingLayout />;
    }

    return (
        <>
            <Header />
            <div className="nav-margin"></div>
            <div
                className="registration-container d-flex justify-content-center align-items-center"
                style={{ minHeight: "calc(100vh - 400px)" }}
            >
                <div className="registration-card">
                    <div className="registration-content">
                        <Registration setLoading={setLoading} />
                    </div>
                </div>
            </div>

        </>
    );
}

export default RegistrationPage;