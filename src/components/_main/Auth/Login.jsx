import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {GlobalContext} from "../../../context/GlobalContext";
import { LOGIN_SUCCESS } from "../../../redux/authProvider/actionType";
import { customerLogin } from "../../../services";
import { useTheme } from '../../../context/ThemeContext';

// Validation Functions
const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
};
const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

const ValidateSchema = Yup.object({
    phoneno: Yup.string()
        .required("Phone Number is Required")
        .matches(
            canadianPhoneNumberRegExp,
            "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
        ),
    password: Yup.string()
        .required("Password is Required")
        .min(6, "Password must have at least 6 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .matches(/[0-9]/, getCharacterValidationError("digit"))
        .matches(/[a-z]/, getCharacterValidationError("lowercase"))
        .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
});

function Login({ setLoading }) {
    const [loginObj] = useState({
        phoneno: "",
        password: "",
    });
    const globalctx = useContext(GlobalContext);
    const [user, setUser] = globalctx.user;
    const [isAuthenticated, setIsAuthenticated] = globalctx.auth;
    const [url, setUrl] = globalctx.urlPath;
    const { theme, colors } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const dispatch = useDispatch();

    const onSubmit = async (values) => {
        setLoading(true);
        let payload = {
            username: values.phoneno.trim(),
            password: values.password.trim(),
        }
        await customerLogin(payload)
            .then((res) => {
                toast.success("Logged in successfully...");
                setIsAuthenticated(true);
                setUser(res.data);
                dispatch({ type: LOGIN_SUCCESS, payload: res.data, token: res.token });
                localStorage.setItem("user", JSON.stringify(res.data));
                localStorage.setItem("token", res.token);

                let redirectParams = params || {};
                let redirect = redirectParams.redirect || "/";
                navigate(redirect);


                // const redirectTo = localStorage.getItem("redirectTo");
                // const forceShowPopup = localStorage.getItem('forceShowOrderMethodPopup') === 'true';
                // if (forceShowPopup) {
                //     // Set flag to show popup after login
                //     localStorage.setItem('showPopupAfterLogin', 'true');
                //     navigate("/");
                // } else if (redirectTo === "/checkout") {
                //     // For Order Now flow, show popup first before going to checkout
                //     localStorage.setItem('showOrderNowPopupAfterLogin', 'true');
                //     navigate("/");
                // } else {
                //     navigate(redirectTo !== null ? redirectTo : "/");
                // } 
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
                setLoading(false);
            }).finally(() => {
                setLoading(false);
            });
    };

    // Use Formik
    const formik = useFormik({
        initialValues: loginObj,
        validateOnBlur: true,
        validationSchema: ValidateSchema,
        onSubmit,
        // enableReinitialize: true, // ❌ Removed to prevent form clearing on errors
    });

    // Set Url Location
    useEffect(() => {
        setUrl(location?.pathname);
    }, [location]);
    return (
        <>
            <div className="row gx-3 justify-content-center align-content-center py-3">
                <div className="content card-background-color col-lg-5 col-md-6 col-sm-12 rounded px-md-4 px-3 py-md-4 py-3">
                    <h3 className="mb-md-4 mb-1 primary-text-color">
                        <strong>Login</strong>
                    </h3>
                    <form className="w-100" onSubmit={formik.handleSubmit}>
                        <div className="row gx-1">
                            <div className="col-lg-12 col-md-12 col-sm-12 primaryWhiteColor pb-2">
                                <label className="form-label mb-1">Phone Number</label>
                                <input
                                    className="form-control  "
                                    type="tel"
                                    name="phoneno"
                                    value={formik.values.phoneno}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phoneno && formik.errors.phoneno ? (
                                    <div className="text-danger  mb-1">
                                        {formik.errors.phoneno}
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 primaryWhiteColor pb-1">
                                <label className=" form-label mb-1">Password</label>
                                <input
                                    className="form-control  mb-1 "
                                    type="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-danger  mb-1">
                                        {formik.errors.password}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-lg-12 col-md-12 col-sm-12 primaryWhiteColor pb-2">
                                <Link to={"/forget-password"} className="text-capitalize logo-primary-text-color text-decoration-none">
                                    Forget Password ?
                                </Link>
                            </div>
                        </div>
                        <div className="w-100 text-center mb-3 mt-2">
                            <button
                                type="submit"
                                className="w-100 py-2 fw-bold btn btn-md rounded-5 text-uppercase loginBtn"
                                style={{ color: colors?.primary }}
                            >
                                Login
                            </button>
                        </div>
                        <div className="row gx-3">
                            <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                                <span className="me-2">Don't have an account ?</span>
                                <br className="d-md-none d-block" />
                                <Link to={"/registration"} className="text-uppercase logo-primary-text-color text-decoration-none">
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
