import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/_main/Header/Header";
import Footer from "../../components/_main/Footer";
import swal from "sweetalert";
import { GlobalContext } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { LOGOUT } from "../../redux/authProvider/actionType";
import ProfileUpdate from "../../components/_main/Auth/ProfileUpdate";
import defaultAvatar from "../../assets/images/avatar.jpg";
import ChangePassword from "../../components/_main/Auth/ChangePassword";
import MyOrders from "../../components/_main/Auth/MyOrders";
import { FaClipboardList, FaUserEdit, FaKey, FaSignOutAlt } from "react-icons/fa";

const TABS = [
    { key: "orderList",      label: "My Orders",       icon: <FaClipboardList /> },
    { key: "updatedProfile", label: "Profile",         icon: <FaUserEdit />      },
    { key: "changePassword", label: "Password",        icon: <FaKey />           },
];

function MyAccount() {
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [user, setUser] = globalCtx.user;
    const [activeTab, setActiveTab] = useState("orderList");
    const [reset, setReset] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        if (!isAuthenticated) return;
        swal({
            title: "Sign Out",
            text: "Do you really want to sign out?",
            icon: "warning",
            buttons: ["Cancel", "Sign Out"],
            dangerMode: true,
        }).then(async (confirmed) => {
            if (confirmed) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("registeredUser");
                localStorage.removeItem("prevUrl");
                toast.success("Signed out successfully");
                dispatch({ type: LOGOUT, payload: null });
                setTimeout(() => {
                    setIsAuthenticated(false);
                    setUser(null);
                    navigate("/");
                }, 500);
            }
        });
    };

    useEffect(() => {
        if (!user) navigate("/");
    }, [navigate, user]);

    useEffect(() => {
        const t = setTimeout(() => setReset(false), 1000);
        return () => clearTimeout(t);
    }, [reset]);

    const handleTabClick = (key) => {
        setActiveTab(key);
        setReset(true);
    };

    return (
        <>
            <Header />
            <div className="nav-margin" />
            <div style={{ minHeight: "80vh", background: "#f5f5f5", paddingBottom: "calc(140px + env(safe-area-inset-bottom, 0px))" }}>

                {/* ── Profile Card ── */}
                <div style={{ background: "#fff", padding: "24px 20px 20px", borderBottom: "1px solid #efefef" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {/* Avatar */}
                        <div style={{
                            width: 64, height: 64, borderRadius: "50%",
                            overflow: "hidden", flexShrink: 0,
                            border: "2px solid #e0e0e0",
                            background: "#f0f0f0",
                        }}>
                            <img
                                src={user?.profilePhoto || defaultAvatar}
                                alt="avatar"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user?.fullName || "My Account"}
                            </div>
                            <div style={{ fontSize: "0.82rem", color: "#888", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {user?.phoneNo || user?.email || ""}
                            </div>
                        </div>
                        {/* Sign Out — top right */}
                        <button
                            onClick={handleLogout}
                            title="Sign Out"
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "8px 14px", borderRadius: 10,
                                border: "1.5px solid #e53935",
                                background: "transparent", color: "#e53935",
                                fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                                whiteSpace: "nowrap", flexShrink: 0,
                            }}
                        >
                            <FaSignOutAlt size={14} />
                            <span className="d-none d-sm-inline">Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* ── Tab Bar ── */}
                <div style={{
                    background: "#fff",
                    display: "flex",
                    borderBottom: "2px solid #f0f0f0",
                    overflowX: "auto",
                    scrollbarWidth: "none",
                }}>
                    {TABS.map(tab => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleTabClick(tab.key)}
                                style={{
                                    flex: 1,
                                    minWidth: 90,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", gap: 4,
                                    padding: "12px 8px",
                                    border: "none",
                                    borderBottom: isActive ? "3px solid var(--primary, #2d7a2d)" : "3px solid transparent",
                                    background: "transparent",
                                    color: isActive ? "var(--primary, #2d7a2d)" : "#888",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: "0.78rem",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <span style={{ fontSize: "1.1rem" }}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ── Tab Content ── */}
                <div style={{
                    margin: "16px 12px",
                    background: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
                    padding: "20px 16px",
                    overflow: "hidden",
                }}>
                    {activeTab === "orderList"      && <MyOrders reset={reset} />}
                    {activeTab === "updatedProfile" && <ProfileUpdate />}
                    {activeTab === "changePassword" && <ChangePassword reset={reset} />}
                </div>

                {/* ── Full-width Sign Out at Bottom ── */}
                <div className="d-lg-none" style={{ padding: "0 12px" }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            padding: "14px",
                            borderRadius: 14,
                            border: "1.5px solid #e53935",
                            background: "#fff5f5",
                            color: "#e53935",
                            fontWeight: 700, fontSize: "0.95rem",
                            cursor: "pointer",
                        }}
                    >
                        <FaSignOutAlt size={16} />
                        Sign Out
                    </button>
                </div>
            </div>

        </>
    );
}

export default MyAccount;
