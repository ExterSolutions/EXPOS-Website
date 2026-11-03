import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/_main/Header/Header";
import PageSEO from "../../components/_main/PageSEO";
import swal from "sweetalert";
import { GlobalContext } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { LOGOUT } from "../../redux/authProvider/actionType";
import ProfileUpdate from "../../components/_main/Auth/ProfileUpdate";
import defaultAvatar from "../../assets/images/avatar.jpg";
import MyOrders from "../../components/_main/Auth/MyOrders";
import { FaClipboardList, FaUserEdit, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

const TABS = [
    { key: "orderList",      label: "My Orders",         icon: <FaClipboardList /> },
    { key: "updatedProfile", label: "Profile & Address", icon: <FaUserEdit />      },
];

function MyAccount() {
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [user, setUser] = globalCtx.user;
    const [activeTab, setActiveTab] = useState("orderList");
    const [reset, setReset] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const profileData = user?.data || user || {};
    const displayPhone = profileData?.mobileNumber || profileData?.phoneNo || "";

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
                }, 400);
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
            <PageSEO pageKey="account" />
            <Header />
            <div className="nav-margin" />
            <div
                style={{
                    minHeight: "82vh",
                    background: "#f5f6f8",
                    paddingBottom: "calc(120px + env(safe-area-inset-bottom, 0px))",
                }}
            >
                <div style={{ maxWidth: 980, margin: "0 auto" }}>
                    {/* ── Profile Header Card ── */}
                    <div
                        style={{
                            background: "#fff",
                            padding: "20px 16px 18px",
                            borderBottom: "1px solid #efefef",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Avatar */}
                            <div
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                    border: "2px solid var(--primary, #2d7a2d)",
                                    background: "#f0f0f0",
                                }}
                            >
                                <img
                                    src={profileData?.profilePhoto || defaultAvatar}
                                    alt="avatar"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    onError={(e) => {
                                        e.currentTarget.src = defaultAvatar;
                                    }}
                                />
                            </div>

                            {/* User Info */}
                            <div style={{ flex: 1, minWidth: 160 }}>
                                <div
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        color: "#1a1a1a",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {profileData?.fullName || "My Account"}
                                </div>
                                <div
                                    style={{
                                        fontSize: "0.84rem",
                                        color: "#666",
                                        marginTop: 2,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "6px 12px",
                                        alignItems: "center",
                                    }}
                                >
                                    {displayPhone && <span>📱 {displayPhone}</span>}
                                    {profileData?.email && (
                                        <span
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                maxWidth: "240px",
                                            }}
                                        >
                                            ✉️ {profileData.email}
                                        </span>
                                    )}
                                </div>
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        marginTop: 6,
                                        padding: "2px 9px",
                                        borderRadius: 20,
                                        background: "rgba(45, 122, 45, 0.1)",
                                        color: "var(--primary, #2d7a2d)",
                                        fontSize: "0.72rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    <FaShieldAlt size={11} />
                                    OTP Verified Account
                                </div>
                            </div>

                            {/* Sign Out — top right */}
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "9px 14px",
                                    borderRadius: 10,
                                    border: "1.5px solid #e53935",
                                    background: "#fff",
                                    color: "#e53935",
                                    fontWeight: 600,
                                    fontSize: "0.84rem",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                    minHeight: 40,
                                }}
                            >
                                <FaSignOutAlt size={14} />
                                <span className="d-none d-sm-inline">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Tab Bar ── */}
                    <div
                        style={{
                            background: "#fff",
                            display: "flex",
                            borderBottom: "2px solid #f0f0f0",
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                        }}
                    >
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabClick(tab.key)}
                                    style={{
                                        flex: 1,
                                        minHeight: 50,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        padding: "12px 10px",
                                        border: "none",
                                        borderBottom: isActive
                                            ? "3px solid var(--primary, #2d7a2d)"
                                            : "3px solid transparent",
                                        background: "transparent",
                                        color: isActive ? "var(--primary, #2d7a2d)" : "#666",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: "0.9rem",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    <span style={{ fontSize: "1.05rem", display: "flex" }}>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Tab Content ── */}
                    <div
                        style={{
                            margin: "14px 10px",
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            padding: "16px 12px",
                            overflow: "hidden",
                        }}
                    >
                        {activeTab === "orderList" && <MyOrders reset={reset} />}
                        {activeTab === "updatedProfile" && <ProfileUpdate />}
                    </div>

                    {/* ── Full-width Sign Out at Bottom on Mobile ── */}
                    <div className="d-sm-none" style={{ padding: "4px 10px 12px" }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: "100%",
                                minHeight: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                padding: "12px 16px",
                                borderRadius: 14,
                                border: "1.5px solid #e53935",
                                background: "#fff5f5",
                                color: "#e53935",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                cursor: "pointer",
                            }}
                        >
                            <FaSignOutAlt size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyAccount;
