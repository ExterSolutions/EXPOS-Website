import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { GlobalContext } from "../../../context/GlobalContext";
import { LOGIN_SUCCESS } from "../../../redux/authProvider/actionType";
import { customerLogin } from "../../../services";
import { useTheme } from '../../../context/ThemeContext';

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str} character`;
};
const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

const ValidateSchema = Yup.object({
    phoneno: Yup.string()
        .required("Phone Number is Required")
        .matches(canadianPhoneNumberRegExp, "Invalid Canadian phone number format"),
    password: Yup.string()
        .required("Password is Required")
        .min(6, "Password must have at least 6 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .matches(/[0-9]/, getCharacterValidationError("digit"))
        .matches(/[a-z]/, getCharacterValidationError("lowercase"))
        .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
});

function Login({ setLoading }) {
    const [showPassword, setShowPassword] = useState(false);
    const [loginObj] = useState({ phoneno: "", password: "" });
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
        };
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
            })
            .catch((err) => {
                if (err.response?.status === 400 || err.response?.status === 500) {
                    toast.error(err.response.data.message);
                }
                setLoading(false);
            }).finally(() => {
                setLoading(false);
            });
    };

    const formik = useFormik({
        initialValues: loginObj,
        validateOnBlur: true,
        validationSchema: ValidateSchema,
        onSubmit,
    });

    useEffect(() => {
        setUrl(location?.pathname);
    }, [location]);

    return (
        <div className="login-mobile-wrapper">
            <div className="login-mobile-card">
                {/* Brand Icon */}
                <div className="login-brand-icon">
                    <i className="bi bi-person-circle" style={{ fontSize: '2.5rem', color: 'var(--primary)' }} />
                </div>
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to your account</p>

                <form className="login-form" onSubmit={formik.handleSubmit}>
                    {/* Phone Number */}
                    <div className="login-field">
                        <label className="login-label">Phone Number</label>
                        <div className="login-input-wrap">
                            <i className="bi bi-telephone login-input-icon" />
                            <input
                                className={`login-input ${formik.touched.phoneno && formik.errors.phoneno ? 'login-input--error' : ''}`}
                                type="tel"
                                name="phoneno"
                                placeholder="e.g. 4161234567"
                                value={formik.values.phoneno}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete="tel"
                            />
                        </div>
                        {formik.touched.phoneno && formik.errors.phoneno && (
                            <div className="login-error">{formik.errors.phoneno}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrap">
                            <i className="bi bi-lock login-input-icon" />
                            <input
                                className={`login-input ${formik.touched.password && formik.errors.password ? 'login-input--error' : ''}`}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="login-eye-btn"
                                onClick={() => setShowPassword(p => !p)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                            </button>
                        </div>
                        {formik.touched.password && formik.errors.password && (
                            <div className="login-error">{formik.errors.password}</div>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="login-forgot">
                        <Link to="/forget-password" className="login-forgot-link">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-submit-btn"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : null}
                        Sign In
                    </button>
                </form>

                {/* Register link */}
                <div className="login-register-row">
                    <span>Don't have an account?</span>
                    <Link to="/registration" className="login-register-link">Create Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
