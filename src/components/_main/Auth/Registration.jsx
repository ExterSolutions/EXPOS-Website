import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {GlobalContext} from "../../../context/GlobalContext";
import { LOGIN_SUCCESS } from "../../../redux/authProvider/actionType";
import { customerRegistration, getPostalcodeList } from "../../../services";

/* --------------------------
    VALIDATION (unchanged regex)
--------------------------- */

const getCharacterValidationError = (str) =>
    `Your password must have at least 1 ${str}`;

const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

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
        .matches(/^[A-Za-z\ ]+$/, "First name should only contain alphabetic characters, spaces")
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name cannot be longer than 50 characters"),

    lastname: Yup.string()
        .required("Last name is required")
        .matches(/^[A-Za-z\ ]+$/, "Last name should only contain alphabetic characters, spaces")
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name cannot be longer than 50 characters"),

    phoneno: Yup.string()
        .required("Phone number is required")
        .matches(
            canadianPhoneNumberRegExp,
            "Invalid Canadian phone number format. Use (XXX) XXX-XXXX."
        ),

    email: Yup.string()
        .email("Invalid email address...")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address")
        .required("Email is required"),

    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must have at least 6 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .matches(/[0-9]/, getCharacterValidationError("digit"))
        .matches(/[a-z]/, getCharacterValidationError("lowercase"))
        .matches(/[A-Z]/, getCharacterValidationError("uppercase")),

    city: Yup.string()
        .required("City is required")
        .matches(/^[A-Za-z\ ]+$/, "City name should only contain alphabetic characters, spaces")
        .min(3, "City must be at least 3 characters")
        .max(50, "City cannot be longer than 50 characters"),

    postalcode: canadianPostalCode.required("Postal Code is required"),

    address: Yup.string()
        .required("Address is required")
        .min(10, "Address must be at least 10 characters")
        .max(100, "Address cannot be longer than 100 characters"),

    passwordconfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Password and Confirm Password must be same")
        .required("Confirm Password is required"),
});

/* --------------------------
    COMPONENT
--------------------------- */

function Registration({ setLoading }) {
    const globalctx = useContext(GlobalContext);
    const [user, setUser] = globalctx.user;
    const [isAuthenticated, setIsAuthenticated] = globalctx.auth;
    const [postalOptions, setPostalOptions] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formatPostalCode = (value) => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        if (cleaned.length <= 3) return cleaned;
        return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6);
    };

    /* --------------------------
        FORMIK SETUP
    --------------------------- */

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            phoneno: "",
            email: "",
            password: "",
            passwordconfirmation: "",
            city: "",
            postalcode: "",
            address: "",
        },
        validationSchema: ValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        enableReinitialize: false,
        onSubmit: async (values, { setSubmitting }) => {

            const payload = {
                firstName: values.firstname,
                lastName: values.lastname,
                mobileNumber: values.phoneno,
                email: values.email,
                city: values.city,
                zipcode: values.postalcode,
                password: values.password,
                password_confirmation: values.passwordconfirmation,
                address: values.address,
                profilePhoto: "",
            };

            await customerRegistration(payload).then((res) => {
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

                toast.success("Account registered successfully...");

                setTimeout(() => {
                    let redirectTo = localStorage.getItem("redirectTo");
                    localStorage.removeItem("redirectTo");
                    navigate(redirectTo ? redirectTo : "/");
                }, 500);
            }).catch((error) => {
                const msg =
                    error?.response?.data?.message ||
                    (error?.response?.data?.errors &&
                        Object.values(error.response.data.errors)[0][0]) ||
                    "Something went wrong. Please try again.";
                toast.error(msg);
            }).finally(() => {
                setSubmitting(false);
            });




        },
    });

    /* --------------------------
        DEBOUNCED POSTAL LOOKUP
    --------------------------- */

    const fetchPostalCodes = useCallback(async () => {
        const cleanedSearch = formik.values.postalcode.replace(/\s/g, '').toUpperCase();
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

    /* --------------------------
        JSX
    --------------------------- */

    return (
        <div className="row gx-3 justify-content-center py-3">
            <div className="content card-background-color col-lg-10 rounded px-md-4 px-3 py-md-4 py-3">
                <h3 className="mb-4 primary-text-color"><strong>Create An Account</strong></h3>

                <form onSubmit={formik.handleSubmit} noValidate autoComplete="off">
                    <div className="row gx-3">

                        {/* FIRST NAME */}
                        <InputField
                            label="First Name"
                            name="firstname"
                            formik={formik}
                        />

                        {/* LAST NAME */}
                        <InputField
                            label="Last Name"
                            name="lastname"
                            formik={formik}
                        />

                        {/* PHONE */}
                        <InputField
                            label="Phone Number"
                            name="phoneno"
                            type="tel"
                            formik={formik}
                        />

                        {/* EMAIL */}
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            formik={formik}
                        />

                        {/* ADDRESS */}
                        <InputField
                            label="Address"
                            name="address"
                            formik={formik}
                        />

                        {/* CITY */}
                        <InputField
                            label="City"
                            name="city"
                            formik={formik}
                        />

                        {/* POSTAL CODE */}
                        <div className="col-lg-6 col-md-6 col-sm-12 pb-2">
                            <label className="form-label mb-2">
                                Postal Code <span className="text-danger">*</span>
                            </label>

                            <input
                                className="form-control mb-2"
                                type="text"
                                name="postalcode"
                                list="postalOptions"
                                value={formik.values.postalcode}
                                onChange={(e) => {
                                    const formatted = formatPostalCode(e.target.value);
                                    formik.setFieldValue('postalcode', formatted);
                                }}
                                onBlur={formik.handleBlur}
                            />

                            <datalist id="postalOptions">
                                {postalOptions.map((opt) => {
                                    const formattedZip = opt.zipcode.slice(0, 3) + ' ' + opt.zipcode.slice(3);
                                    return (
                                        <option key={opt.zipcode} value={formattedZip} />
                                    );
                                })}
                            </datalist>

                            {formik.touched.postalcode && formik.errors.postalcode && (
                                <div className="text-danger formErrMsg mb-1">
                                    {formik.errors.postalcode}
                                </div>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <InputField
                            label="Password"
                            name="password"
                            type="password"
                            formik={formik}
                        />

                        {/* PASSWORD CONFIRM */}
                        <InputField
                            label="Confirm Password"
                            name="passwordconfirmation"
                            type="password"
                            formik={formik}
                        />

                        {/* SUBMIT BUTTON */}
                        <div className="w-100 text-center mt-4 pb-2">
                            <button
                                className="view-button px-5"
                                type="submit"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? "Please wait....." : "Create An Account"}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

/* --------------------------
    REUSABLE INPUT COMPONENT
--------------------------- */

function InputField({ label, name, type = "text", formik }) {
    return (
        <div className="col-lg-6 col-md-6 col-sm-12 pb-2">
            <label className="form-label mb-2">
                {label} <span className="text-danger">*</span>
            </label>

            <input
                className="form-control mb-2"
                type={type}
                name={name}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            {formik.touched[name] && formik.errors[name] && (
                <div className="text-danger formErrMsg mb-1">
                    {formik.errors[name]}
                </div>
            )}
        </div>
    );
}

export default Registration;
