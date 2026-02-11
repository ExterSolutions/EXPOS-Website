import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/_main/Header/Header";
import Footer from "../../components/_main/Footer";
import swal from "sweetalert";
import {GlobalContext} from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { LOGOUT } from "../../redux/authProvider/actionType";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import ProfileUpdate from "../../components/_main/Auth/ProfileUpdate";
import defaultAvatar from "../../assets/images/avatar.jpg";
// import "../../assets/styles/MyAccount/profile.css";
import ChangePassword from "../../components/_main/Auth/ChangePassword";
import MyOrders from "../../components/_main/Auth/MyOrders";

function MyAccount() {
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [user, setUser] = globalCtx.user;
    const [reset, setReset] = useState(false);
    //
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        if (isAuthenticated !== false) {
            swal({
                title: "Logout Confirmation",
                text: "Do you really want to logout?",
                icon: "warning",
                buttons: ["Cancel", "Logout"],
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    if (
                        localStorage.getItem("registeredUser") !== null ||
                        localStorage.getItem("prevUrl") !== null
                    ) {
                        localStorage.removeItem("registeredUser");
                        localStorage.removeItem("prevUrl");
                    }
                    toast.success("Logged Out successfully");
                    dispatch({ type: LOGOUT, payload: null });
                    setTimeout(() => {
                        setIsAuthenticated(false);
                        setUser({});
                        navigate("/");
                    }, 500);
                } else {
                }
            });
        }
    };

    useEffect(() => {
        if (user != null) {
            if (user) {
                navigate("/my-account");
            } else {
                navigate("/");
            }
        } else {
            navigate("/");
        }
    }, [navigate, user]);

    useEffect(() => {
        setTimeout(() => {
            setReset(false);
        }, 1000);
    }, [reset]);
    return (
        <>
            <Header />
            <div className="nav-margin"></div>
            <div className="container-fluid new-block">
                <Tab.Container id="left-tabs-example" defaultActiveKey="orderList">
                    <Row className="m-md-5 my-4 mx-2 pTabContainer">
                        <Col
                            lg={3}
                            md={12}
                            sm={12}
                            className="sideMenu py-lg-5 pb-0 pt-3 px-2"
                        >
                            <div className="profile d-flex justify-content-center align-items-center flex-column">
                                <div className="profilePhoto rounded-circle">
                                    <img
                                        src={
                                            user?.profilePhoto ? user?.profilePhoto : defaultAvatar
                                        }
                                        alt=""
                                        width="100%"
                                        height="100%"
                                    />
                                </div>
                                <div className="pt-4 pb-2 userFullName">
                                    <strong>{user?.fullName}</strong>
                                </div>
                            </div>
                            <Nav className="text-start pt-3 navMenu">
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="orderList"
                                        className="text-start w-100 py-2 fw-bold btn btn-md pTabs border-bottom"
                                        onClick={(e) => {
                                            setReset(true);
                                        }}
                                    >
                                        <i className="fa fa-table icons" aria-hidden="true"></i>
                                        <span className="mx-2">My Orders</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="updatedProfile"
                                        className="text-start w-100 py-2 fw-bold btn btn-md pTabs border-bottom"
                                    >
                                        <i className="fa fa-pencil icons" aria-hidden="true"></i>
                                        <span className="mx-2">Update Profile</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="changePassword"
                                        className="text-start w-100 py-2 fw-bold btn btn-md pTabs border-bottom"
                                        onClick={(e) => {
                                            setReset(true);
                                        }}
                                    >
                                        <i className="fa fa-key icons" aria-hidden="true"></i>
                                        <span className="mx-2">Change Password</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="fifth"
                                        className="text-start w-100 py-2 fw-bold btn btn-md pTabs border-bottom"
                                        onClick={handleLogout}
                                    >
                                        <i className="fa fa-sign-out icons" aria-hidden="true"></i>
                                        <span className="mx-2">Logout</span>
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={9} md={12} sm={12} className="profileTabContent">
                            <Tab.Content>
                                <Tab.Pane eventKey="orderList">
                                    <MyOrders reset={reset} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="updatedProfile">
                                    <ProfileUpdate />
                                </Tab.Pane>
                                <Tab.Pane eventKey="changePassword">
                                    <ChangePassword reset={reset} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
            <Footer />
        </>
    );
}

export default MyAccount;
