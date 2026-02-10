// import { useFormik } from "formik";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// import LoadingLayout from "../../../layouts/LoadingLayout";
// import { customerResendOtp, customerResetPassword, customerUpdatePassword, customerVerifyOtp } from "../../../services";
// import Footer from "../Footer";
// import Header from "../Header";

// const getCharacterValidationError = (str) => {
//     return `Your password must have at least 1 ${str}`;
// };

// const ValidateSchema = (step, otpVerified) => {
//     if (step === 1) {
//         return Yup.object({
//             mobileNumber: Yup.string()
//                 .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
//                 .required("Mobile number is required"),
//         });
//     } else if (step === 2) {
//         return Yup.object({
//             otp: Yup.string()
//                 .matches(/^[0-9]{4}$/, "OTP must be exactly 4 digits")
//                 .required("Please enter the OTP"),
//         });
//     } else if (step === 3) {
//         return Yup.object({
//             password: Yup.string()
//                 .required("Password is required")
//                 .min(6, "Password must have at least 6 characters")
//                 .max(20, "Password cannot be longer than 20 characters")
//                 .matches(/[0-9]/, getCharacterValidationError("digit")),
//             passwordconfirmation: Yup.string()
//                 .oneOf([Yup.ref("password"), null], "Passwords and Confirm Password must be same")
//                 .required("Confirm Password is required"),
//         });
//     }
//     return Yup.object({});
// };

// function ForgetPassword() {
//     const [loading, setLoading] = useState(false);
//     const [step, setStep] = useState(1); // 1: mobile, 2: otp, 3: password
//     const [otpVerified, setOtpVerified] = useState(false);
//     const [resendLoading, setResendLoading] = useState(false);
//     const navigate = useNavigate();

//     const token = localStorage.getItem('resetToken');
//     const mobile = localStorage.getItem('resetMobile');

//     const verifyOtp = async (otp) => {
//         setLoading(true);
//         const payload = {
//             mobileNumber: mobile,
//             otp: otp,
//             token: token
//         };
//         await customerVerifyOtp(payload)
//             .then((res) => {
//                 toast.success(res.message);
//                 setOtpVerified(true);
//                 setStep(3);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 if (err.response && (err.response.status === 400 || err.response.status === 500)) {
//                     toast.error(err.response.data.message);
//                 } else {
//                     toast.error("Something went wrong. Please try again.");
//                 }
//                 setLoading(false);
//             });
//     };

//     const resendOtp = async () => {
//         setResendLoading(true);
//         const payload = {
//             mobileNumber: mobile
//         };
//         await customerResendOtp(payload)
//             .then((res) => {
//                 toast.success(res.message);
//                 setResendLoading(false);
//             })
//             .catch((err) => {
//                 if (err.response && (err.response.status === 400 || err.response.status === 500)) {
//                     toast.error(err.response.data.message);
//                 } else {
//                     toast.error("Something went wrong. Please try again.");
//                 }
//                 setResendLoading(false);
//             });
//     };

//     const onSubmit = async (values) => {
//         if (step === 1) {
//             setLoading(true);
//             const payload = {
//                 mobileNumber: values.mobileNumber,
//             };
//             await customerResetPassword(payload)
//                 .then((res) => {
//                     toast.success(res?.message);
//                     localStorage.setItem('resetToken', res.data.resetToken);
//                     localStorage.setItem('resetMobile', values.mobileNumber);
//                     setStep(2);
//                     setLoading(false);
//                 })
//                 .catch((err) => {
//                     if (err.response && (err.response.status === 400 || err.response.status === 500)) {
//                         toast.error(err.response.data.message);
//                     } else {
//                         toast.error("Something went wrong. Please try again.");
//                     }
//                     setLoading(false);
//                 });
//         } else if (step === 2) {
//             await verifyOtp(values.otp);
//         } else if (step === 3) {
//             setLoading(true);
//             const payload = {
//                 token: token,
//                 password: values?.password,
//                 password_confirmation: values?.passwordconfirmation
//             };
//             await customerUpdatePassword(payload)
//                 .then((res) => {
//                     toast.success(res.message);
//                     localStorage.removeItem('resetToken');
//                     localStorage.removeItem('resetMobile');
//                     navigate('/login');
//                     setLoading(false);
//                 })
//                 .catch((err) => {
//                     if (err.response && (err.response.status === 400 || err.response.status === 500)) {
//                         toast.error(err.response.data.message);
//                     } else {
//                         toast.error("Something went wrong. Please try again.");
//                     }
//                     setLoading(false);
//                 });
//         }
//     };

//     // Use Formik
//     const formik = useFormik({
//         initialValues: {
//             mobileNumber: "",
//             otp: "",
//             password: "",
//             passwordconfirmation: "",
//         },
//         validateOnBlur: true,
//         validationSchema: ValidateSchema(step, otpVerified),
//         onSubmit,
//         enableReinitialize: true,
//     });

//     useEffect(() => {
//         const user = localStorage.getItem("user") ?? null;
//         if (user != null) {
//             const userData = JSON.parse(user);
//             if (userData) {
//                 navigate("/");
//             }
//         }
//         setLoading(false);
//     }, [navigate]);

//     if (loading) return <LoadingLayout />;
//     return (
//         <>
//             <Header />
//             <div className="nav-margin"></div>
//             <div
//                 className="container-fluid d-flex justify-content-center align-items-center"
//                 style={{ minHeight: "calc(100vh - 400px)" }}
//             >
//                 <div className="container row py-md-2 py-4 px-0 m-0" >
//                     <div className="col-12 ">
//                         <div className="row gx-3 justify-content-center align-content-center py-3">
//                             <div className="content card-background-color col-lg-5 col-md-6 col-sm-12 rounded px-md-4 px-3 py-md-4 py-3">
//                                 <h3 className="mb-4">
//                                     <strong>Forget Password</strong>
//                                 </h3>
//                                 <form className="w-100" onSubmit={formik.handleSubmit}>
//                                     <div className="row gx-3">
//                                         {/* Step 1: Mobile Number */}
//                                         {step === 1 && (
//                                             <div className="col-lg-12 col-md-12 col-sm-12">
//                                                 <label className="form-label">
//                                                     Mobile Number <small className="text-danger">*</small>
//                                                 </label>
//                                                 <input
//                                                     className=" form-control mb-3"
//                                                     type="tel"
//                                                     name="mobileNumber"
//                                                     value={formik.values.mobileNumber}
//                                                     onChange={formik.handleChange}
//                                                     onBlur={formik.handleBlur}
//                                                 />
//                                                 {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
//                                                     <div className="text-danger formErrMsg mt-2 mb-3">
//                                                         {formik.errors.mobileNumber}
//                                                     </div>
//                                                 ) : null}
//                                             </div>
//                                         )}

//                                         {/* Step 2: OTP */}
//                                         {step === 2 && (
//                                             <div className="col-lg-12 col-md-12 col-sm-12 py-2">
//                                                 <label className="form-label">
//                                                     OTP <small className="text-danger">*</small>
//                                                 </label>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control"
//                                                     name="otp"
//                                                     value={formik.values.otp}
//                                                     onChange={(e) => {
//                                                         formik.handleChange(e);
//                                                         formik.setFieldValue("otp", e.target.value.trim());
//                                                     }}
//                                                     onBlur={formik.handleBlur}
//                                                 />
//                                                 {formik.touched.otp && formik.errors.otp ? (
//                                                     <div className="text-danger formErrMsg mt-2 mb-1">
//                                                         {formik.errors.otp}
//                                                     </div>
//                                                 ) : null}
//                                                 <div className="col-lg-12 col-md-12 col-sm-12 py-2 text-end">
//                                                     <button
//                                                         type="button"
//                                                         className="btn btn-link p-0 text-decoration-none"
//                                                         onClick={resendOtp}
//                                                         disabled={resendLoading}
//                                                     >
//                                                         {resendLoading ? "Resending..." : "Resend OTP"}
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {/* Step 3: Password */}
//                                         {step === 3 && (
//                                             <>
//                                                 <div className="col-lg-12 col-md-12 col-sm-12 py-2">
//                                                     <label className="form-label">
//                                                         Password <small className="text-danger">*</small>
//                                                     </label>
//                                                     <input
//                                                         className="form-control"
//                                                         type="password"
//                                                         name="password"
//                                                         value={formik.values.password}
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                     />
//                                                     {formik.touched.password && formik.errors.password ? (
//                                                         <div className="text-danger formErrMsg mt-2 mb-1">
//                                                             {formik.errors.password}
//                                                         </div>
//                                                     ) : null}
//                                                 </div>
//                                                 <div className="col-lg-12 col-md-12 col-sm-12 py-2">
//                                                     <label className="form-label">
//                                                         Confirm Password <small className="text-danger">*</small>
//                                                     </label>
//                                                     <input
//                                                         className="form-control"
//                                                         type="password"
//                                                         name="passwordconfirmation"
//                                                         value={formik.values.passwordconfirmation}
//                                                         onChange={formik.handleChange}
//                                                         onBlur={formik.handleBlur}
//                                                     />
//                                                     {formik.touched.passwordconfirmation &&
//                                                         formik.errors.passwordconfirmation ? (
//                                                         <div className="text-danger formErrMsg mt-2 mb-1">
//                                                             {formik.errors.passwordconfirmation}
//                                                         </div>
//                                                     ) : null}
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                     <div className="w-100 text-center mb-3 mt-2">
//                                         <button
//                                             type="submit"
//                                             className="w-100 py-2 fw-bold btn btn-md rounded-5 text-uppercase loginBtn"
//                                         >
//                                             {step === 1 ? "Reset Password" : step === 2 ? "Verify OTP" : "Update Password"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// }

// export default ForgetPassword;





import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import LoadingLayout from "../../../layouts/LoadingLayout";
import {
    customerResendOtp,
    customerResetPassword,
    customerUpdatePassword,
    customerVerifyOtp
} from "../../../services";
import Footer from "../Footer";
import Header from "../Header/Header";

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str}`;
};

const ValidateSchema = (step) => {
    if (step === 1) {
        return Yup.object({
            mobileNumber: Yup.string()
                .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
                .required("Mobile number is required"),
        });
    } else if (step === 2) {
        return Yup.object({
            otp: Yup.string()
                .matches(/^[0-9]{4}$/, "OTP must be exactly 4 digits")
                .required("Please enter the OTP"),
        });
    } else if (step === 3) {
        return Yup.object({
            password: Yup.string()
                .required("Password is required")
                .min(6, "Password must have at least 6 characters")
                .max(20, "Password cannot be longer than 20 characters")
                .matches(/[0-9]/, getCharacterValidationError("digit")),
            passwordconfirmation: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords and Confirm Password must be same")
                .required("Confirm Password is required"),
        });
    }
    return Yup.object({});
};

function ForgetPassword() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: mobile, 2: otp, 3: password
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const navigate = useNavigate();



    const verifyOtp = async (otp) => {
        try {
            setLoading(true);

            const payload = {
                mobileNumber,
                otp,
                token: resetToken
            };

            const res = await customerVerifyOtp(payload);
            console.log("OTP Verification Response:", res);

            // SUCCESS CONDITION BASED ON YOUR BACKEND'S MESSAGE
            if (res?.message?.toLowerCase().includes("verified")) {
                toast.success(res.message);
                setOtpVerified(true);
                setStep(3);
                return;
            }

            // FAILED OTP
            toast.error(res?.message || "Invalid OTP");
            setOtpVerified(false);

        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                "OTP verification failed"
            );
            setOtpVerified(false);
        } finally {
            setLoading(false);
        }
    };


    const resendOtp = async () => {
        try {
            setResendLoading(true);
            const payload = {
                mobileNumber: mobileNumber
            };

            const res = await customerResendOtp(payload);

            if (res) {
                toast.success(res.message || "OTP resent successfully");
            }
        } catch (err) {
            console.error("Resend OTP Error:", err);
            const errorMessage = err?.response?.data?.message ||
                err?.message ||
                "Failed to resend OTP. Please try again.";
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    const onSubmit = async (values) => {
        // Step 1: Send OTP to mobile number
        if (step === 1) {
            try {
                setLoading(true);
                const payload = {
                    mobileNumber: values.mobileNumber,
                };

                const res = await customerResetPassword(payload);
                if (res) {
                    const response = res;
                    console.log("Reset Password Response:", response);
                    if (response.status !== "200") {
                        toast.error(response.message || "Failed to send OTP. Please try again.");
                    } else {
                        setResetToken(response.resetToken);
                        setMobileNumber(values.mobileNumber);
                        toast.success(response.message || "OTP sent successfully to your mobile number");
                        setStep(2);

                    }
                } else {
                    throw new Error("Invalid response from server");
                }
            } catch (err) {
                const errorMessage = err?.response?.data?.message ||
                    err?.message ||
                    "Failed to send OTP. Please try again.";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
        // Step 2: Verify OTP
        else if (step === 2) {
            await verifyOtp(values.otp);
        }
        // Step 3: Update password
        else if (step === 3) {
            try {
                setLoading(true);
                const payload = {
                    token: resetToken,
                    password: values.password,
                    password_confirmation: values.passwordconfirmation
                };

                const res = await customerUpdatePassword(payload);
                if (res) {
                    toast.success(res.message || "Password updated successfully");

                    // Clear stored data
                    setResetToken("");
                    setMobileNumber("");

                    // Navigate to login after a short delay
                    setTimeout(() => {
                        navigate('/login');
                    }, 1500);
                }
            } catch (err) {
                const errorMessage = err?.response?.data?.message ||
                    err?.message ||
                    "Failed to update password. Please try again.";
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            mobileNumber: "",
            otp: "",
            password: "",
            passwordconfirmation: "",
        },
        validateOnBlur: true,
        validationSchema: ValidateSchema(step),
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
    }, [navigate]);

    if (loading && step === 1) return <LoadingLayout />;

    return (
        <>
            <Header />
            <div className="nav-margin"></div>
            <div
                className="container-fluid d-flex justify-content-center align-items-center"
                style={{ minHeight: "calc(100vh - 400px)" }}
            >
                <div className="container row py-md-2 py-4 px-0 m-0">
                    <div className="col-12">
                        <div className="row gx-3 justify-content-center align-content-center py-3">
                            <div className="content card-background-color col-lg-5 col-md-6 col-sm-12 rounded px-md-4 px-3 py-md-4 py-3">
                                <h3 className="mb-4">
                                    <strong>Forgot Password</strong>
                                </h3>

                                {/* Progress Indicator */}
                                <div className="d-flex justify-content-between mb-4">
                                    <div className={`text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
                                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 1 ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                            style={{ width: '32px', height: '32px' }}>
                                            1
                                        </div>
                                        <div className="small mt-1">Mobile</div>
                                    </div>
                                    <div className={`text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
                                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 2 ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                            style={{ width: '32px', height: '32px' }}>
                                            2
                                        </div>
                                        <div className="small mt-1">Verify OTP</div>
                                    </div>
                                    <div className={`text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
                                        <div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 3 ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                                            style={{ width: '32px', height: '32px' }}>
                                            3
                                        </div>
                                        <div className="small mt-1">New Password</div>
                                    </div>
                                </div>

                                <form className="w-100" onSubmit={formik.handleSubmit}>
                                    <div className="row gx-3">
                                        {/* Step 1: Mobile Number */}
                                        {step === 1 && (
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <label className="form-label">
                                                    Mobile Number <small className="text-danger">*</small>
                                                </label>
                                                <input
                                                    className="form-control mb-3"
                                                    type="tel"
                                                    name="mobileNumber"
                                                    placeholder="Enter 10 digit mobile number"
                                                    value={formik.values.mobileNumber}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    disabled={loading}
                                                />
                                                {formik.touched.mobileNumber && formik.errors.mobileNumber ? (
                                                    <div className="text-danger formErrMsg mt-2 mb-3">
                                                        {formik.errors.mobileNumber}
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}

                                        {/* Step 2: OTP */}
                                        {step === 2 && (
                                            <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                                <label className="form-label">
                                                    OTP <small className="text-danger">*</small>
                                                </label>
                                                <p className="text-muted small">
                                                    OTP sent to {mobileNumber}
                                                </p>
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    name="otp"
                                                    placeholder="Enter 4 digit OTP"
                                                    maxLength="4"
                                                    style={{ letterSpacing: '8px', fontSize: '18px' }}
                                                    value={formik.values.otp}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        formik.setFieldValue("otp", value);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    disabled={loading}
                                                />
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
                                        )}

                                        {/* Step 3: Password */}
                                        {step === 3 && (
                                            <>
                                                <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                                    <label className="form-label">
                                                        New Password <small className="text-danger">*</small>
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        name="password"
                                                        placeholder="Enter new password"
                                                        value={formik.values.password}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        disabled={loading}
                                                    />
                                                    {formik.touched.password && formik.errors.password ? (
                                                        <div className="text-danger formErrMsg mt-2 mb-1">
                                                            {formik.errors.password}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                                    <label className="form-label">
                                                        Confirm Password <small className="text-danger">*</small>
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        name="passwordconfirmation"
                                                        placeholder="Confirm new password"
                                                        value={formik.values.passwordconfirmation}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        disabled={loading}
                                                    />
                                                    {formik.touched.passwordconfirmation &&
                                                        formik.errors.passwordconfirmation ? (
                                                        <div className="text-danger formErrMsg mt-2 mb-1">
                                                            {formik.errors.passwordconfirmation}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-100 text-center mb-3 mt-2">
                                        <button
                                            type="submit"
                                            className="w-100 py-2 fw-bold btn btn-md rounded-5 text-uppercase loginBtn"
                                            disabled={loading}
                                        >
                                            {loading ? "Processing..." :
                                                step === 1 ? "Send OTP" :
                                                    step === 2 ? "Verify OTP" :
                                                        "Update Password"}
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

export default ForgetPassword;