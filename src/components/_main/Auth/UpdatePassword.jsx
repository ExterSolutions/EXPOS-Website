import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import LoadingLayout from "../../../layouts/LoadingLayout";
import { customerResendOtp, customerUpdatePassword, customerVerifyOtp } from "../../../services";
import Footer from "../Footer";
import Header from "../Header/Header";

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str}`;
};
const validationSchema = (otpVerified) => Yup.object({
    otp: Yup.string()
        .matches(/^[0-9]{4}$/, "OTP must be exactly 4 digits")
        .required("Please enter the OTP"),
    password: otpVerified ? Yup.string()
        .required("Password is required")
        .min(6, "Password must have at least 6 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .matches(/[0-9]/, getCharacterValidationError("digit")) : Yup.string(),
    passwordconfirmation: otpVerified ? Yup.string()
        .oneOf(
            [Yup.ref("password"), null],
            "Passwords and Confirm Password must be same"
        )
        .required("Confirm Password is required") : Yup.string(),
});
function UpdatePassword() {
    const iniValues = {
        otp: "",
        password: "",
        passwordconfirmation: "",
    };

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const token = localStorage.getItem('resetToken');
    const mobile = localStorage.getItem('resetMobile');

    const verifyOtp = async (otp) => {
        setLoading(true);
        const payload = {
            mobileNumber: mobile,
            otp: otp,
            token: token
        };
        await customerVerifyOtp(payload)
            .then((res) => {
                toast.success(res.message);
                setOtpVerified(true);
                setLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
                setLoading(false);
            });
    };

    const resendOtp = async () => {
        setResendLoading(true);
        const payload = {
            mobileNumber: mobile
        };
        await customerResendOtp(payload)
            .then((res) => {
                toast.success(res.message);
                setResendLoading(false);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
                setResendLoading(false);
            });
    };

    const onSubmit = async (values) => {
        if (!otpVerified) {
            await verifyOtp(values.otp);
        } else {
            setLoading(true);
            const payload = {
                token: token,
                password: values?.password,
                password_confirmation: values?.passwordconfirmation
            };
            await customerUpdatePassword(payload)
                .then((res) => {
                    toast.success(res.message);
                    localStorage.removeItem('resetToken');
                    localStorage.removeItem('resetMobile');
                    navigate('/login');
                    setLoading(false);
                })
                .catch((err) => {
                    if (err.response.status === 400 || err.response.status === 500) {
                        toast.error(err.response.data.message);
                    }
                    setLoading(false);
                });
        }
    };

    const formik = useFormik({
        initialValues: iniValues,
        validateOnBlur: true,
        validationSchema: validationSchema(otpVerified),
        onSubmit,
        enableReinitialize: true,
    });
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

    if (loading) return <LoadingLayout />;

    return (
        <>
            <Header />
            <div className="nav-margin"></div>
            <div
                className="container-fluid d-flex justify-content-center align-items-center"
                style={{ minHeight: "calc(100vh - 400px)" }}
            >
                <div className="container row py-md-2 py-4 px-0 m-0" >
                    <div className="col-12 ">
                        <div className="row gx-3 justify-content-center align-content-center py-3">
                            <div className="content card-background-color col-lg-5 col-md-6 col-sm-12 rounded px-md-4 px-3 py-md-4 py-3">
                                <h3 className="mb-4">
                                    <strong>Change Password</strong>
                                </h3>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                        <label className="form-label cPasswordLabel">
                                            OTP <small className="text-danger">*</small>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control cPasswordInput"
                                            name="otp"
                                            value={formik.values.otp}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                formik.setFieldValue("otp", e.target.value.trim());
                                            }}
                                            onBlur={formik.handleBlur}
                                        ></input>
                                        {formik.touched.otp && formik.errors.otp ? (
                                            <div className="text-danger formErrMsg mt-2 mb-1">
                                                {formik.errors.otp}
                                            </div>
                                        ) : null}
                                        <div className="col-lg-12 col-md-12 col-sm-12 py-2 text-end">
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-decoration-none"
                                                onClick={resendOtp}
                                                disabled={resendLoading}
                                            >
                                                {resendLoading ? "Resending..." : "Resend OTP"}
                                            </button>
                                        </div>
                                    </div>
                                    {otpVerified && (
                                        <>
                                            <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                                <label className="form-label cPasswordLabel">
                                                    Password <small className="text-danger">*</small>
                                                </label>
                                                <input
                                                    className="form-control cPasswordInput"
                                                    type="password"
                                                    name="password"
                                                    value={formik.values.password}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                ></input>
                                                {formik.touched.password && formik.errors.password ? (
                                                    <div className="text-danger formErrMsg mt-2 mb-1">
                                                        {formik.errors.password}
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                                <label className="form-label cPasswordLabel">
                                                    Confirm Password <small className="text-danger">*</small>
                                                </label>
                                                <input
                                                    className="form-control cPasswordInput"
                                                    type="password"
                                                    name="passwordconfirmation"
                                                    value={formik.values.passwordconfirmation}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                ></input>
                                                {formik.touched.passwordconfirmation &&
                                                    formik.errors.passwordconfirmation ? (
                                                    <div className="text-danger formErrMsg mt-2 mb-1">
                                                        {formik.errors.passwordconfirmation}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                    <div className="col-lg-12 py-2 w-100 mb-3 mt-4">
                                        <button
                                            className="w-100 py-2 fw-bold btn btn-md rounded-5 text-uppercase loginBtn"
                                            type="submit"
                                        >
                                            {otpVerified ? "Update Password" : "Verify OTP"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UpdatePassword;