import React, { useContext, useEffect, useState } from "react";
import Header from "../components/_main/Header/Header";
import Footer from "../components/_main/Footer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { sendContactUsEmail } from "../services";
import {
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaPaperPlane,
    FaCommentDots,
    FaExternalLinkAlt,
    FaStore,
    FaBolt,
    FaExclamationCircle
} from "react-icons/fa";
import { useTheme } from '../context/ThemeContext';
import PageSEO from '../components/_main/PageSEO';
import { useSiteDataContext } from '../context/SiteDataContext';
import "./contact-us.css";

// ── Validation Schema ──────────────────────────────────────────────────────────
const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

const ValidateSchema = Yup.object({
    firstname: Yup.string()
        .required("First name is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "First name should only contain alphabetic characters and spaces"
        )
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot be longer than 50 characters"),
    lastname: Yup.string()
        .required("Last name is required")
        .matches(
            /^[A-Za-z\ ]+$/,
            "Last name should only contain alphabetic characters and spaces"
        )
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot be longer than 50 characters"),
    phoneno: Yup.string()
        .required("Phone number is required")
        .matches(
            canadianPhoneNumberRegExp,
            "Enter a 10-digit phone number (e.g. 6041234567)"
        ),
    email: Yup.string()
        .email("Invalid email address")
        .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address"
        )
        .required("Email is required"),
    message: Yup.string()
        .required("Message is required")
        .min(5, "Message must be at least 5 characters")
        .max(800, "Message cannot be longer than 800 characters"),
});

function ContactUs() {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    // ── Pull dynamic site contact info from admin API ──────────────────────────
    const { siteData } = useSiteDataContext();
    const siteName    = siteData.site_name     || 'Our Restaurant';
    const siteAddress = siteData.address       || '';
    const sitePhone   = siteData.contact_phone || '';
    const siteEmail   = siteData.contact_email || '';

    const brandPrimary = colors?.primary || '#f26724';

    const onSubmit = async (values, { resetForm }) => {
        const payload = {
            firstName: values.firstname.trim(),
            lastName: values.lastname.trim(),
            mobileNumber: values.phoneno.trim(),
            email: values.email.trim(),
            message: values.message.trim(),
        };

        setLoading(true);
        try {
            const res = await sendContactUsEmail(payload);
            toast.success(res?.message || "Thank you! Your message has been sent successfully.");
            resetForm();
        } catch (err) {
            const errorMsg = err?.response?.data?.message || "Unable to send message. Please try again or call us directly.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
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

    // Format phone for display if 10 digits
    const formattedPhone = sitePhone.length === 10
        ? `(${sitePhone.slice(0, 3)}) ${sitePhone.slice(3, 6)}-${sitePhone.slice(6)}`
        : sitePhone;

    return (
        <div className="contact-us-page" style={{ '--contact-primary': brandPrimary }}>
            <PageSEO pageKey="contactUs" />
            <Header />

            {/* ── Hero Banner Section ────────────────────────────────────────── */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <div className="contact-badge">
                        <FaCommentDots className="contact-badge-icon" />
                        <span>We're Here For You</span>
                    </div>
                    <h1 className="contact-title">
                        Get in Touch with <span className="brand-accent">{siteName}</span>
                    </h1>
                    <p className="contact-subtitle">
                        Have a question about our menu, need custom catering, or want to share your feedback?
                        Send us a message or reach out directly.
                    </p>
                </div>
            </section>

            {/* ── Main 2-Column Content ─────────────────────────────────────── */}
            <main className="contact-main-wrapper">
                <div className="contact-grid">

                    {/* ── Left Column: Contact Info Cards ──────────────────────── */}
                    <div className="contact-info-column">
                        <div className="contact-info-card">
                            <div className="info-header">
                                <span className="info-header-tag">Direct Contact</span>
                                <h2 className="info-title">Let's Connect</h2>
                                <p className="info-desc">
                                    Our team is happy to assist you during business hours. Choose the most convenient way to reach us.
                                </p>
                            </div>

                            <div className="info-items-list">
                                {/* Address Card */}
                                {siteAddress && (
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(siteAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="info-row"
                                        title="View on Google Maps"
                                    >
                                        <div className="info-icon-box">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div className="info-details">
                                            <div className="info-label">Visit Our Location</div>
                                            <p className="info-val">{siteAddress}</p>
                                            <span className="info-action-hint">
                                                Get Directions <FaExternalLinkAlt size={10} />
                                            </span>
                                        </div>
                                    </a>
                                )}

                                {/* Phone Card */}
                                {sitePhone && (
                                    <a
                                        href={`tel:${sitePhone}`}
                                        className="info-row"
                                        title="Call our store"
                                    >
                                        <div className="info-icon-box">
                                            <FaPhoneAlt />
                                        </div>
                                        <div className="info-details">
                                            <div className="info-label">Phone Support</div>
                                            <p className="info-val">{formattedPhone}</p>
                                            <span className="info-action-hint">
                                                Tap to call now
                                            </span>
                                        </div>
                                    </a>
                                )}

                                {/* Email Card */}
                                {siteEmail && (
                                    <a
                                        href={`mailto:${siteEmail}`}
                                        className="info-row"
                                        title="Send an email"
                                    >
                                        <div className="info-icon-box">
                                            <FaEnvelope />
                                        </div>
                                        <div className="info-details">
                                            <div className="info-label">Email Inquiries</div>
                                            <p className="info-val">{siteEmail}</p>
                                            <span className="info-action-hint">
                                                Write to us
                                            </span>
                                        </div>
                                    </a>
                                )}

                                {/* Store Locations Link */}
                                <Link to="/stores" className="info-row" title="Explore all store locations">
                                    <div className="info-icon-box">
                                        <FaStore />
                                    </div>
                                    <div className="info-details">
                                        <div className="info-label">Store Directory</div>
                                        <p className="info-val">Find All Locations & Hours</p>
                                        <span className="info-action-hint">
                                            View store list →
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Fast Response Assurance */}
                        <div className="response-promise-box">
                            <div className="promise-icon">⚡</div>
                            <div>
                                <h4 className="promise-title">Fast Response Guarantee</h4>
                                <p className="promise-sub">
                                    Online messages are typically reviewed and answered within 1–2 hours during operating hours.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Interactive Form ──────────────────────── */}
                    <div className="contact-form-column">
                        <div className="contact-form-card">
                            <div className="form-header">
                                <span className="form-header-badge">Online Inquiry</span>
                                <h2 className="form-title">Send Us a Message</h2>
                                <p className="form-subtitle">
                                    Fill out the quick form below and our team will get in touch as soon as possible.
                                </p>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="contact-form" noValidate>
                                {/* Name Row */}
                                <div className="form-grid-row">
                                    <div className="form-field-group">
                                        <label htmlFor="firstname" className="field-label">
                                            <span>First Name <span className="required-dot">*</span></span>
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                id="firstname"
                                                name="firstname"
                                                value={formik.values.firstname}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`modern-input ${formik.touched.firstname && formik.errors.firstname ? "field-error" : ""}`}
                                                placeholder="e.g. John"
                                                autoComplete="given-name"
                                            />
                                        </div>
                                        {formik.touched.firstname && formik.errors.firstname && (
                                            <div className="field-error-text">
                                                <FaExclamationCircle size={12} />
                                                <span>{formik.errors.firstname}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field-group">
                                        <label htmlFor="lastname" className="field-label">
                                            <span>Last Name <span className="required-dot">*</span></span>
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                id="lastname"
                                                name="lastname"
                                                value={formik.values.lastname}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`modern-input ${formik.touched.lastname && formik.errors.lastname ? "field-error" : ""}`}
                                                placeholder="e.g. Doe"
                                                autoComplete="family-name"
                                            />
                                        </div>
                                        {formik.touched.lastname && formik.errors.lastname && (
                                            <div className="field-error-text">
                                                <FaExclamationCircle size={12} />
                                                <span>{formik.errors.lastname}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Row */}
                                <div className="form-grid-row">
                                    <div className="form-field-group">
                                        <label htmlFor="phoneno" className="field-label">
                                            <span>Phone Number <span className="required-dot">*</span></span>
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="tel"
                                                id="phoneno"
                                                name="phoneno"
                                                value={formik.values.phoneno}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`modern-input ${formik.touched.phoneno && formik.errors.phoneno ? "field-error" : ""}`}
                                                placeholder="e.g. 6041234567"
                                                autoComplete="tel"
                                            />
                                        </div>
                                        {formik.touched.phoneno && formik.errors.phoneno && (
                                            <div className="field-error-text">
                                                <FaExclamationCircle size={12} />
                                                <span>{formik.errors.phoneno}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-field-group">
                                        <label htmlFor="email" className="field-label">
                                            <span>Email Address <span className="required-dot">*</span></span>
                                        </label>
                                        <div className="input-container">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                className={`modern-input ${formik.touched.email && formik.errors.email ? "field-error" : ""}`}
                                                placeholder="e.g. john@example.com"
                                                autoComplete="email"
                                            />
                                        </div>
                                        {formik.touched.email && formik.errors.email && (
                                            <div className="field-error-text">
                                                <FaExclamationCircle size={12} />
                                                <span>{formik.errors.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Field */}
                                <div className="form-field-group full-width">
                                    <label htmlFor="message" className="field-label">
                                        <span>Your Message <span className="required-dot">*</span></span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>
                                            {formik.values.message.length} / 800
                                        </span>
                                    </label>
                                    <div className="input-container">
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formik.values.message}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            rows="5"
                                            className={`modern-textarea ${formik.touched.message && formik.errors.message ? "field-error" : ""}`}
                                            placeholder="Write your message here... Mention your order number if applicable."
                                        />
                                    </div>
                                    {formik.touched.message && formik.errors.message && (
                                        <div className="field-error-text">
                                            <FaExclamationCircle size={12} />
                                            <span>{formik.errors.message}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Action */}
                                <div className="submit-btn-wrapper">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="modern-submit-btn"
                                        aria-label="Send Message"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-dot" />
                                                <span>Sending Your Message...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <FaPaperPlane className="btn-icon-send" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="form-footer-privacy">
                                    🔒 We value your privacy. Your personal information is kept secure and never shared.
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </main>

            {/* ── Footer ────────────────────────────────────────────────────── */}
            <div className="container-fluid px-0">
                <Footer />
            </div>
        </div>
    );
}

export default ContactUs;
