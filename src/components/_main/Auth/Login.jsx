import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GlobalContext } from "../../../context/GlobalContext";
import { LOGIN_SUCCESS } from "../../../redux/authProvider/actionType";
import {
    customerLogin,
    customerResendOtp,
    customerResetPassword,
    customerUpdatePassword,
    customerVerifyOtp,
} from "../../../services";

const cleanTenDigitPhone = (raw = "") => {
    const digits = String(raw).replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
        return digits.slice(1);
    }
    return digits.slice(0, 10);
};

const formatDisplayPhone = (digits = "") => {
    if (digits.length !== 10) return digits;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

function Login({ setLoading }) {
    const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter 4-digit OTP
    const [phoneInput, setPhoneInput] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
    const [otpError, setOtpError] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const globalctx = useContext(GlobalContext);
    const [, setUser] = globalctx.user;
    const [, setIsAuthenticated] = globalctx.auth;
    const [, setUrl] = globalctx.urlPath;
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        setUrl(location?.pathname);
    }, [location, setUrl]);

    // Countdown timer for Resend OTP
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    // Auto-focus first OTP box when entering step 2
    useEffect(() => {
        if (step === 2) {
            setTimeout(() => otpRefs[0]?.current?.focus(), 80);
        }
    }, [step]);

    const completeLogin = (customerData, authToken) => {
        toast.success("Signed in successfully!");
        setIsAuthenticated(true);
        setUser(customerData);
        dispatch({ type: LOGIN_SUCCESS, payload: customerData, token: authToken });
        localStorage.setItem("user", JSON.stringify(customerData));
        localStorage.setItem("token", authToken);

        const savedRedirect = localStorage.getItem("redirectTo");
        if (savedRedirect) {
            localStorage.removeItem("redirectTo");
            navigate(savedRedirect);
            return;
        }
        const redirectParams = params || {};
        navigate(redirectParams.redirect || "/");
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const cleaned = cleanTenDigitPhone(phoneInput);
        if (cleaned.length !== 10) {
            setPhoneError("Please enter a valid 10-digit Canadian phone number");
            return;
        }
        setPhoneError("");
        setSubmitting(true);

        try {
            const res = await customerResetPassword({ mobileNumber: cleaned });
            const msgLower = String(res?.message || "").toLowerCase();
            const isUnregistered =
                res?.isRegistered === false ||
                msgLower.includes("no account") ||
                msgLower.includes("no users") ||
                msgLower.includes("does not exist") ||
                msgLower.includes("not found");

            if (isUnregistered) {
                toast.info(res?.message || "No account found with this number. Let's create your account!");
                navigate("/registration", { state: { mobileNumber: cleaned } });
                return;
            }

            if (res?.otpSent === false || (!res?.resetToken && String(res?.status) === "300")) {
                toast.error(res?.message || "Failed to send OTP. Please try again.");
                return;
            }

            if (res?.resetToken || String(res?.status) === "200") {
                setResetToken(res.resetToken || "");
                setPhoneInput(cleaned);
                setOtpDigits(["", "", "", ""]);
                setOtpError("");
                setStep(2);
                setResendCooldown(30);
                toast.success(res.message || "4-digit verification code sent to your phone");
            } else {
                toast.error(res?.message || "Failed to send OTP. Please try again.");
            }
        } catch (err) {
            const data = err?.response?.data;
            const errMsgLower = String(data?.message || "").toLowerCase();
            if (
                data?.isRegistered === false ||
                errMsgLower.includes("no account") ||
                errMsgLower.includes("no users") ||
                errMsgLower.includes("does not exist")
            ) {
                toast.info(data?.message || "No account found. Redirecting to registration...");
                navigate("/registration", { state: { mobileNumber: cleaned } });
                return;
            }
            toast.error(data?.message || "Unable to send verification code. Please try again.");
        } finally {
            setSubmitting(false);
            if (setLoading) setLoading(false);
        }
    };

    const verifyOtpCode = async (codeToVerify) => {
        const otpString = (codeToVerify ?? otpDigits.join("")).trim();
        if (!/^\d{4}$/.test(otpString)) {
            setOtpError("Please enter the 4-digit verification code");
            return;
        }
        setOtpError("");
        setSubmitting(true);

        try {
            const res = await customerVerifyOtp({
                mobileNumber: phoneInput,
                otp: otpString,
                token: resetToken,
            });

            if (String(res?.status) === "200" && res?.data && res?.token) {
                completeLogin(res.data, res.token);
                return;
            }

            // Backward-compatible bridge if backend verify_otp returned verified=true without profile payload
            if ((String(res?.status) === "200" || res?.verified) && (res?.token || resetToken)) {
                const verifyTok = res.token || resetToken;
                const bridgeKey = `OtpBridge${otpString}A1`;
                const updRes = await customerUpdatePassword({
                    token: verifyTok,
                    mobileNumber: phoneInput,
                    password: bridgeKey,
                    password_confirmation: bridgeKey,
                });
                if (updRes?.data && updRes?.token) {
                    completeLogin(updRes.data, updRes.token);
                    return;
                }
                const loginRes = await customerLogin({
                    username: phoneInput,
                    mobileNumber: phoneInput,
                    password: bridgeKey,
                });
                if (loginRes?.data && loginRes?.token) {
                    completeLogin(loginRes.data, loginRes.token);
                    return;
                }
            }

            setOtpError(res?.message || "Invalid or expired OTP. Please try again.");
            toast.error(res?.message || "Invalid or expired OTP.");
        } catch (err) {
            const msg = err?.response?.data?.message || "OTP verification failed. Please try again.";
            setOtpError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
            if (setLoading) setLoading(false);
        }
    };

    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        await verifyOtpCode(otpDigits.join(""));
    };

    const handleOtpBoxChange = (idx, rawVal) => {
        const digitsOnly = String(rawVal).replace(/\D/g, "");
        if (!digitsOnly) {
            const next = [...otpDigits];
            next[idx] = "";
            setOtpDigits(next);
            return;
        }

        // Handle paste or multi-digit autofill (e.g. iOS/Android SMS autofill)
        if (digitsOnly.length > 1) {
            const chars = digitsOnly.slice(0, 4).split("");
            const next = ["", "", "", ""];
            chars.forEach((c, i) => {
                next[i] = c;
            });
            setOtpDigits(next);
            setOtpError("");
            const focusIdx = Math.min(chars.length, 3);
            otpRefs[focusIdx]?.current?.focus();
            if (chars.length === 4) {
                verifyOtpCode(chars.join(""));
            }
            return;
        }

        const next = [...otpDigits];
        next[idx] = digitsOnly;
        setOtpDigits(next);
        setOtpError("");

        if (idx < 3) {
            otpRefs[idx + 1]?.current?.focus();
        } else if (next.every((d) => d.length === 1)) {
            verifyOtpCode(next.join(""));
        }
    };

    const handleOtpKeyDown = (idx, e) => {
        if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
            otpRefs[idx - 1]?.current?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 4);
        if (pasted.length > 0) {
            e.preventDefault();
            const next = ["", "", "", ""];
            pasted.split("").forEach((c, i) => {
                next[i] = c;
            });
            setOtpDigits(next);
            setOtpError("");
            if (pasted.length === 4) {
                verifyOtpCode(pasted);
            } else {
                otpRefs[pasted.length]?.current?.focus();
            }
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0 || resendLoading) return;
        setResendLoading(true);
        try {
            const res = await customerResendOtp({ mobileNumber: phoneInput });
            if (String(res?.status) === "200" || res?.otpSent) {
                if (res?.resetToken) setResetToken(res.resetToken);
                setOtpDigits(["", "", "", ""]);
                setOtpError("");
                setResendCooldown(30);
                toast.success(res.message || "New verification code sent!");
                otpRefs[0]?.current?.focus();
            } else {
                toast.error(res?.message || "Could not resend OTP.");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="login-mobile-wrapper">
            <div className="login-mobile-card">
                <div className="login-brand-icon">
                    <i
                        className={`bi ${step === 1 ? "bi-shield-lock-fill" : "bi-chat-square-dots-fill"}`}
                        style={{ fontSize: "2.5rem", color: "var(--primary, #2d7a2d)" }}
                    />
                </div>

                <h2 className="login-title">
                    {step === 1 ? "Welcome Back" : "Verify Your Phone"}
                </h2>
                <p className="login-subtitle">
                    {step === 1
                        ? "Sign in instantly with a 4-digit SMS code — no password needed"
                        : `Enter the 4-digit code sent to ${formatDisplayPhone(phoneInput)}`}
                </p>

                {step === 1 ? (
                    <form className="login-form" onSubmit={handleSendOtp} noValidate>
                        <div className="login-field">
                            <label className="login-label" htmlFor="login-phone-input">
                                Mobile Number
                            </label>
                            <div className="login-input-wrap">
                                <i className="bi bi-telephone login-input-icon" />
                                <input
                                    id="login-phone-input"
                                    className={`login-input ${phoneError ? "login-input--error" : ""}`}
                                    type="tel"
                                    inputMode="numeric"
                                    name="phoneno"
                                    placeholder="e.g. 5195740074"
                                    value={phoneInput}
                                    onChange={(e) => {
                                        setPhoneInput(cleanTenDigitPhone(e.target.value));
                                        if (phoneError) setPhoneError("");
                                    }}
                                    autoComplete="tel"
                                    disabled={submitting}
                                />
                            </div>
                            {phoneError && <div className="login-error">{phoneError}</div>}
                        </div>

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Sending OTP...
                                </>
                            ) : (
                                "Send Verification Code"
                            )}
                        </button>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handleVerifySubmit} noValidate>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "12px",
                                margin: "6px 0 8px",
                            }}
                            onPaste={handleOtpPaste}
                        >
                            {otpDigits.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={otpRefs[idx]}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete={idx === 0 ? "one-time-code" : "off"}
                                    maxLength={idx === 0 ? 4 : 1}
                                    value={digit}
                                    onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    disabled={submitting}
                                    aria-label={`OTP digit ${idx + 1}`}
                                    style={{
                                        width: "58px",
                                        height: "60px",
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        fontWeight: 700,
                                        borderRadius: "14px",
                                        border: otpError
                                            ? "2px solid #e53935"
                                            : digit
                                            ? "2px solid var(--primary, #2d7a2d)"
                                            : "1.5px solid #d6d6d6",
                                        background: digit ? "#fff" : "#fafafa",
                                        color: "#1a1a1a",
                                        outline: "none",
                                        transition: "all 0.18s ease",
                                    }}
                                />
                            ))}
                        </div>

                        {otpError && (
                            <div className="login-error" style={{ textAlign: "center" }}>
                                {otpError}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify & Sign In"
                            )}
                        </button>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "6px",
                                fontSize: "0.86rem",
                                flexWrap: "wrap",
                                gap: "8px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtpDigits(["", "", "", ""]);
                                    setOtpError("");
                                }}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#666",
                                    padding: 0,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                ← Change Number
                            </button>

                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0 || resendLoading}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color:
                                        resendCooldown > 0
                                            ? "#999"
                                            : "var(--primary, #2d7a2d)",
                                    padding: 0,
                                    fontWeight: 700,
                                    cursor:
                                        resendCooldown > 0 ? "not-allowed" : "pointer",
                                }}
                            >
                                {resendLoading
                                    ? "Sending..."
                                    : resendCooldown > 0
                                    ? `Resend Code in ${resendCooldown}s`
                                    : "Resend OTP"}
                            </button>
                        </div>
                    </form>
                )}

                <div className="login-register-row">
                    <span>New customer?</span>
                    <Link
                        to="/registration"
                        state={{ mobileNumber: phoneInput }}
                        className="login-register-link"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
