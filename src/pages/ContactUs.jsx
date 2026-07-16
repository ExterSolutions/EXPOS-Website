import React, { useContext, useEffect, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import { sendContactUsEmail } from "../services";
// import "../assets/styles/new/homepage/contact/contact-us.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useTheme } from '../context/ThemeContext';
import PageSEO from '../components/_main/PageSEO';
import { useSiteDataContext } from '../context/SiteDataContext';


// Validation Functions
const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str}`;
};
const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

const canadianPostalCode = Yup.string().test(
    "is-canadian-postal-code",
    "Invalid Canadian Postal Code",
    (value) => {
        if (!value) return true;
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
        const { theme, colors } = useTheme();
        return postalCodeRegex.test(value);
    }
);

const ValidateSchema = Yup.object({
    firstname: Yup.string()
        .required("First name is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "First name should only contain alphabetic characters, spaces"
        )
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name cannot be longer than 50 characters"),
    lastname: Yup.string()
        .required("Last name is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "Last name should only contain alphabetic characters, spaces"
        )
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name cannot be longer than 50 characters"),
    phoneno: Yup.string()
        .required("Phone number is required")
        .matches(
            canadianPhoneNumberRegExp,
            "Invalid Canadian phone number format."
        ),
    email: Yup.string()
        .email("Invalid email address...")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid Email Address"
        )
        .required("Email is required"),
    message: Yup.string()
        .required("Message is required")
        .min(3, "Message must be at least 3 characters")
        .max(800, "Message cannot be longer than 800 characters"),
});

function ContactUs() {
    const globalctx = useContext(GlobalContext);
    const [user, setUser] = globalctx.user;
    const [isAuthenticated, setIsAuthenticated] = globalctx.auth;
    const [regUser, setRegUser] = globalctx.regUser;
    const { theme, colors } = useTheme();
    const [loading, setLoading] = useState(false);

    // ── Pull all contact info from admin API — zero hardcoding ────────────────
    const { siteData } = useSiteDataContext();
    const siteName    = siteData.site_name     || '';
    const siteAddress = siteData.address       || '';
    const sitePhone   = siteData.contact_phone || '';
    const siteEmail   = siteData.contact_email || '';

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const onSubmit = async (values, { resetForm }) => {
        let payload = {
            firstName: values.firstname,
            lastName: values.lastname,
            mobileNumber: values.phoneno,
            email: values.email,
            message: values.message,
        };
        setLoading(true);
        await sendContactUsEmail(payload)
            .then((res) => {
                toast.success(res.message);
                setLoading(false);
                resetForm();
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
                setLoading(false);
            });
    };

    const formik = useFormik({
        initialValues: {
            firstname: "",
            lastname: "",
            phoneno: "",
            email: "",
            message: "",
        },
        validateOnBlur: true,
        validationSchema: ValidateSchema,
        onSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <PageSEO pageKey="contactUs" />
            <Header />
            <div className="contact-us-container">

                {/* Header Section */}
                <div className="contact-header text-center py-70">
                    <h1 className="contact-title">
                        Contact{' '}
                        <span className="brand-color" style={{ color: colors?.primary }}>
                            {siteName}
                        </span>
                    </h1>
                    <p className="contact-subtitle">
                        We'd love to hear from you! Send us a message and we'll respond as
                        soon as possible.
                    </p>
                </div>

                <div className="contact-content-grid">
                    {/* Left Side: Contact Information */}
                    <div className="contact-info-side">
                        <div className="info-card">
                            <h2 className="info-title">Our Information</h2>

                            <div className="info-items">
                                {/* Address — only shown when admin has configured it */}
                                {siteAddress && (
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaMapMarkerAlt size={20} color={colors?.primary || '#f26724'} />
                                        </div>
                                        <div className="info-content">
                                            <h3 className="info-label">Address</h3>
                                            <p className="info-text">{siteAddress}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Phone — only shown when admin has configured it */}
                                {sitePhone && (
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaPhoneAlt size={20} color={colors?.primary || '#f26724'} />
                                        </div>
                                        <div className="info-content">
                                            <h3 className="info-label">Phone</h3>
                                            <p className="info-text">
                                                <a href={`tel:${sitePhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {sitePhone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Email — only shown when admin has configured it */}
                                {siteEmail && (
                                    <div className="info-item">
                                        <div className="info-icon">
                                            <FaEnvelope size={20} color={colors?.primary || '#f26724'} />
                                        </div>
                                        <div className="info-content">
                                            <h3 className="info-label">Email</h3>
                                            <p className="info-text">
                                                <a href={`mailto:${siteEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                                    {siteEmail}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Right Side: Contact Form */}
                    <div className="contact-form-side">
                        <div className="form-card">
                            <h2 className="form-title">Send us a Message</h2>

                            <form onSubmit={formik.handleSubmit} className="contact-form">
                                {/* Name Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstname" className="form-label">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstname"
                                            name="firstname"
                                            value={formik.values.firstname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`form-input ${formik.touched.firstname && formik.errors.firstname
                                                ? "error"
                                                : ""
                                                }`}
                                            placeholder="Enter your first name"
                                        />
                                        {formik.touched.firstname && formik.errors.firstname ? (
                                            <div className="error-message">
                                                {formik.errors.firstname}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="lastname" className="form-label">
                                            Last Name <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastname"
                                            name="lastname"
                                            value={formik.values.lastname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`form-input ${formik.touched.lastname && formik.errors.lastname
                                                ? "error"
                                                : ""
                                                }`}
                                            placeholder="Enter your last name"
                                        />
                                        {formik.touched.lastname && formik.errors.lastname ? (
                                            <div className="error-message">
                                                {formik.errors.lastname}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Contact Row */}
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="phoneno" className="form-label">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phoneno"
                                            name="phoneno"
                                            value={formik.values.phoneno}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`form-input ${formik.touched.phoneno && formik.errors.phoneno
                                                ? "error"
                                                : ""
                                                }`}
                                            placeholder="(123) 456-7890"
                                        />
                                        {formik.touched.phoneno && formik.errors.phoneno ? (
                                            <div className="error-message">
                                                {formik.errors.phoneno}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            Email <span className="required">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`form-input ${formik.touched.email && formik.errors.email
                                                ? "error"
                                                : ""
                                                }`}
                                            placeholder="your@email.com"
                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="error-message">{formik.errors.email}</div>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="form-group-full">
                                    <label htmlFor="message" className="form-label">
                                        Message <span className="required">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formik.values.message}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        rows="6"
                                        className={`form-textarea ${formik.touched.message && formik.errors.message
                                            ? "error"
                                            : ""
                                            }`}
                                        placeholder="Tell us how we can help you..."
                                    />
                                    {formik.touched.message && formik.errors.message ? (
                                        <div className="error-message">{formik.errors.message}</div>
                                    ) : null}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-button"

                                >
                                    {loading ? (
                                        <span className="button-loading"

                                        >
                                            <span className="spinner"></span>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ContactUs;
