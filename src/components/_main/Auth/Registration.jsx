import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { GlobalContext } from "../../../context/GlobalContext";
import { LOGIN_SUCCESS } from "../../../redux/authProvider/actionType";
import { customerRegistration, getPostalcodeList } from "../../../services";
import AddressAutofill, { extractCanadianAddressParts } from "../../common/AddressAutofill";

const canadianPhoneNumberRegExp = /^\d{10}$/;

const canadianPostalCode = Yup.string().test(
    "is-canadian-postal-code",
    "Invalid Canadian Postal Code",
    (value) => {
        if (!value) return true;
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/i;
        return postalCodeRegex.test(value);
    }
);

const ValidationSchema = Yup.object({
    firstname: Yup.string()
        .required("First name is required")
        .matches(/^[A-Za-z\s]+$/, "First name should only contain alphabetic characters and spaces")
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot be longer than 50 characters"),

    lastname: Yup.string()
        .required("Last name is required")
        .matches(/^[A-Za-z\s]+$/, "Last name should only contain alphabetic characters and spaces")
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot be longer than 50 characters"),

    phoneno: Yup.string()
        .required("Phone number is required")
        .matches(canadianPhoneNumberRegExp, "Enter a valid 10-digit Canadian phone number"),

    email: Yup.string()
        .email("Invalid email address")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address")
        .required("Email is required"),

    city: Yup.string()
        .required("City is required")
        .matches(/^[A-Za-z\s.\-']+$/, "City name should only contain alphabetic characters and spaces")
        .min(2, "City must be at least 2 characters")
        .max(50, "City cannot be longer than 50 characters"),

    postalcode: canadianPostalCode.required("Postal Code is required"),

    address: Yup.string()
        .required("Address is required")
        .min(5, "Address must be at least 5 characters")
        .max(100, "Address cannot be longer than 100 characters"),
});

function Registration({ setLoading }) {
    const globalctx = useContext(GlobalContext);
    const [, setUser] = globalctx.user;
    const [, setIsAuthenticated] = globalctx.auth;
    const [postalOptions, setPostalOptions] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const prefilledPhone = (location?.state?.mobileNumber || "")
        .replace(/\D/g, "")
        .slice(0, 10);

    const formatPostalCode = (value) => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (cleaned.length <= 3) return cleaned;
        return cleaned.slice(0, 3) + " " + cleaned.slice(3, 6);
    };

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            phoneno: prefilledPhone,
            email: "",
            city: "",
            postalcode: "",
            address: "",
        },
        validationSchema: ValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            const payload = {
                firstName: values.firstname.trim(),
                lastName: values.lastname.trim(),
                mobileNumber: values.phoneno.replace(/\D/g, "").slice(0, 10),
                email: values.email.trim(),
                city: values.city.trim(),
                zipcode: values.postalcode.trim(),
                address: values.address.trim(),
                profilePhoto: "",
            };

            await customerRegistration(payload)
                .then((res) => {
                    dispatch({
                        type: LOGIN_SUCCESS,
                        payload: res.data,
                        token: res.token,
                    });

                    setIsAuthenticated(true);
                    setUser(res.data);
                    localStorage.setItem("user", JSON.stringify(res.data));
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("registeredUser", JSON.stringify(payload));

                    toast.success("Account created! You're now signed in.");

                    setTimeout(() => {
                        const redirectTo = localStorage.getItem("redirectTo");
                        localStorage.removeItem("redirectTo");
                        navigate(redirectTo ? redirectTo : "/");
                    }, 400);
                })
                .catch((error) => {
                    const msg =
                        error?.response?.data?.message ||
                        (error?.response?.data?.errors &&
                            Object.values(error.response.data.errors)[0][0]) ||
                        "Something went wrong. Please try again.";
                    toast.error(msg);
                })
                .finally(() => {
                    setSubmitting(false);
                    if (setLoading) setLoading(false);
                });
        },
    });

    const fetchPostalCodes = useCallback(async () => {
        const cleanedSearch = formik.values.postalcode.replace(/\s/g, "").toUpperCase();
        if (cleanedSearch.length < 3) {
            setPostalOptions([]);
            return;
        }

        try {
            const res = await getPostalcodeList({
                search: cleanedSearch,
            });
            setPostalOptions(res.data || []);
        } catch (err) {
            console.error("Postal code lookup failed:", err?.response?.data?.message);
        }
    }, [formik.values.postalcode]);

    useEffect(() => {
        const delay = setTimeout(fetchPostalCodes, 400);
        return () => clearTimeout(delay);
    }, [fetchPostalCodes]);

    return (
        <div className="row gx-3 justify-content-center py-3 px-2">
            <div
                className="content card-background-color col-lg-10 col-12 rounded-4 px-md-4 px-3 py-md-4 py-3"
                style={{
                    background: "#fff",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.08)",
                    maxWidth: "680px",
                }}
            >
                <div className="text-center mb-3">
                    <h3 className="mb-1 primary-text-color" style={{ fontWeight: 700 }}>
                        Create Your Account
                    </h3>
                    <p className="text-muted small mb-0">
                        Passwordless account — sign in anytime with a 4-digit SMS code
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} noValidate autoComplete="off">
                    <div className="row gx-3">
                        <InputField
                            label="First Name"
                            name="firstname"
                            placeholder="First name"
                            formik={formik}
                        />

                        <InputField
                            label="Last Name"
                            name="lastname"
                            placeholder="Last name"
                            formik={formik}
                        />

                        <div className="col-lg-6 col-md-6 col-sm-12 pb-2">
                            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.88rem" }}>
                                Phone Number <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-control mb-1"
                                style={{ height: "46px", borderRadius: "10px" }}
                                type="tel"
                                inputMode="numeric"
                                name="phoneno"
                                placeholder="10-digit mobile number"
                                value={formik.values.phoneno}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                                    formik.setFieldValue("phoneno", digits);
                                }}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.phoneno && formik.errors.phoneno && (
                                <div className="text-danger formErrMsg mb-1" style={{ fontSize: "0.78rem" }}>
                                    {formik.errors.phoneno}
                                </div>
                            )}
                        </div>

                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            formik={formik}
                        />

                        <div className="col-lg-6 col-md-6 col-sm-12 pb-2">
                            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.88rem" }}>
                                Street Address <span className="text-danger">*</span>
                            </label>
                            <AddressAutofill
                                options={{ country: "CA", language: "en" }}
                                onRetrieve={(res) => {
                                    const feature = res?.features?.[0];
                                    if (!feature) return;
                                    if (feature.properties?._streetOnly) {
                                        formik.setFieldValue("address", feature.properties.address_line1 || "");
                                        return;
                                    }
                                    const parts = extractCanadianAddressParts(feature);
                                    const resolvedAddress = (parts.fullAddress || parts.streetAddress || "").slice(0, 100);
                                    if (resolvedAddress) {
                                        formik.setFieldValue("address", resolvedAddress);
                                    }
                                    if (parts.city) {
                                        formik.setFieldValue("city", parts.city);
                                    }
                                    if (parts.postalCode) {
                                        formik.setFieldValue("postalcode", parts.postalCode);
                                    }
                                }}
                            >
                                <input
                                    className="form-control mb-1"
                                    style={{ height: "46px", borderRadius: "10px" }}
                                    type="text"
                                    name="address"
                                    placeholder="Start typing street address..."
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                />
                            </AddressAutofill>
                            {formik.touched.address && formik.errors.address && (
                                <div className="text-danger formErrMsg mb-1" style={{ fontSize: "0.78rem" }}>
                                    {formik.errors.address}
                                </div>
                            )}
                        </div>

                        <InputField
                            label="City"
                            name="city"
                            placeholder="City"
                            formik={formik}
                        />

                        <div className="col-lg-6 col-md-6 col-sm-12 pb-2">
                            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.88rem" }}>
                                Postal Code <span className="text-danger">*</span>
                            </label>

                            <input
                                className="form-control mb-1"
                                style={{ height: "46px", borderRadius: "10px" }}
                                type="text"
                                name="postalcode"
                                placeholder="e.g. N2A 4J3"
                                list="postalOptions"
                                value={formik.values.postalcode}
                                onChange={(e) => {
                                    const formatted = formatPostalCode(e.target.value);
                                    formik.setFieldValue("postalcode", formatted);
                                }}
                                onBlur={formik.handleBlur}
                            />

                            <datalist id="postalOptions">
                                {postalOptions.map((opt) => {
                                    const formattedZip = opt.zipcode.slice(0, 3) + " " + opt.zipcode.slice(3);
                                    return <option key={opt.zipcode} value={formattedZip} />;
                                })}
                            </datalist>

                            {formik.touched.postalcode && formik.errors.postalcode && (
                                <div className="text-danger formErrMsg mb-1" style={{ fontSize: "0.78rem" }}>
                                    {formik.errors.postalcode}
                                </div>
                            )}
                        </div>

                        <div className="w-100 text-center mt-3 pb-2">
                            <button
                                className="login-submit-btn"
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Creating Account..." : "Create Account"}
                            </button>
                        </div>

                        <div className="login-register-row mt-2">
                            <span>Already have an account?</span>
                            <Link to="/login" className="login-register-link">
                                Sign In with OTP
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function InputField({ label, name, type = "text", placeholder = "", formik }) {
    return (
        <div className="col-lg-6 col-md-6 col-sm-12 pb-2">
            <label className="form-label mb-1 fw-semibold" style={{ fontSize: "0.88rem" }}>
                {label} <span className="text-danger">*</span>
            </label>

            <input
                className="form-control mb-1"
                style={{ height: "46px", borderRadius: "10px" }}
                type={type}
                name={name}
                placeholder={placeholder}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            {formik.touched[name] && formik.errors[name] && (
                <div className="text-danger formErrMsg mb-1" style={{ fontSize: "0.78rem" }}>
                    {formik.errors[name]}
                </div>
            )}
        </div>
    );
}

export default Registration;
