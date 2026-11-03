import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { updateProfile } from "../../../services";
import { useFormik } from "formik";
import defaultPhoto from "../../../assets/images/avatar.jpg";
import { GlobalContext } from "../../../context/GlobalContext";
import { useDispatch } from "react-redux";
import { UPDATEUSER } from "../../../redux/authProvider/actionType";
import AddressAutofill, { extractCanadianAddressParts } from "../../common/AddressAutofill";

const validationSchema = Yup.object({
    firstName: Yup.string().min(2, "Minimum 2 characters").required("First name is required"),
    lastName: Yup.string().min(2, "Minimum 2 characters").required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address")
        .required("Email is required"),
    address: Yup.string().nullable(),
    city: Yup.string().nullable(),
    zipcode: Yup.string()
        .nullable()
        .test("is-canadian-postal", "Enter a valid Canadian postal code (e.g. N2A 4J3)", (val) => {
            if (!val || !val.trim()) return true;
            return /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/i.test(val.trim());
        }),
});

function ProfileUpdate() {
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [saving, setSaving] = useState(false);

    const dispatch = useDispatch();

    const profileData = user?.data || user || {};

    const formatPostalCode = (value = "") => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (cleaned.length <= 3) return cleaned;
        return cleaned.slice(0, 3) + " " + cleaned.slice(3, 6);
    };

    const iniValues = {
        firstName: profileData?.firstName || "",
        lastName: profileData?.lastName || "",
        mobileNumber: profileData?.mobileNumber || profileData?.phoneNo || "",
        email: profileData?.email || "",
        address: profileData?.address || "",
        city: profileData?.city || "",
        zipcode: profileData?.zipcode || "",
        customerCode: profileData?.code || profileData?.customerCode || "",
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values) => {
        setSaving(true);
        const formData = new FormData();

        formData.append("customerCode", profileData?.customerCode || profileData?.code || values.customerCode);
        formData.append("firstName", values.firstName.trim());
        formData.append("lastName", values.lastName.trim());
        formData.append("mobileNumber", values.mobileNumber);
        formData.append("email", values.email.trim());
        if (values.address) formData.append("address", values.address.trim());
        if (values.city) formData.append("city", values.city.trim());
        if (values.zipcode) formData.append("zipcode", values.zipcode.trim());
        if (selectedFile) {
            formData.append("profilePhoto", selectedFile);
        }

        try {
            const result = await updateProfile(formData);

            if (result?.data) {
                const fileInput = document.getElementById("profilePhoto");
                if (fileInput) fileInput.value = "";
                setSelectedFile(null);
                setPreviewUrl(null);

                const mergedData = {
                    ...profileData,
                    ...result.data,
                    address: result.data.address ?? values.address ?? profileData.address ?? "",
                    city: result.data.city ?? values.city ?? profileData.city ?? "",
                    zipcode: result.data.zipcode ?? values.zipcode ?? profileData.zipcode ?? "",
                };

                localStorage.setItem("user", JSON.stringify(mergedData));
                setUser(mergedData);
                dispatch({ type: UPDATEUSER, payload: mergedData });
                toast.success("Profile updated successfully!");
            } else {
                toast.error(result?.message || "Failed to update profile");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const formik = useFormik({
        initialValues: iniValues,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit,
        enableReinitialize: true,
    });

    return (
        <div className="container-fluid px-1 px-md-3 py-2">
            <form onSubmit={formik.handleSubmit} noValidate>
                {/* Avatar Upload Section */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "12px 14px",
                        background: "#f9fafb",
                        borderRadius: 12,
                        marginBottom: 20,
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            width: 68,
                            height: 68,
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "2px solid var(--primary, #2d7a2d)",
                            background: "#fff",
                        }}
                    >
                        <img
                            src={previewUrl || profileData?.profilePhoto || defaultPhoto}
                            alt="Profile"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => {
                                e.currentTarget.src = defaultPhoto;
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label
                            htmlFor="profilePhoto"
                            style={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "#222",
                                display: "block",
                                marginBottom: 4,
                            }}
                        >
                            Profile Photo
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            className="form-control form-control-sm"
                            id="profilePhoto"
                            name="profilePhoto"
                            onChange={handleFileChange}
                        />
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Supported formats: JPG, PNG
                        </small>
                    </div>
                </div>

                {/* Personal Details */}
                <h6 className="fw-bold mb-3" style={{ color: "#1a1a1a" }}>
                    Personal Information
                </h6>
                <div className="row g-3 mb-4">
                    <div className="col-md-6 col-12">
                        <label htmlFor="firstName" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            First Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            style={{ height: 46, borderRadius: 10 }}
                            id="firstName"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.firstName && formik.errors.firstName && (
                            <small className="text-danger d-block mt-1">{formik.errors.firstName}</small>
                        )}
                    </div>

                    <div className="col-md-6 col-12">
                        <label htmlFor="lastName" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            style={{ height: 46, borderRadius: 10 }}
                            id="lastName"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                            <small className="text-danger d-block mt-1">{formik.errors.lastName}</small>
                        )}
                    </div>

                    <div className="col-md-6 col-12">
                        <label htmlFor="mobileNumber" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            Mobile Number (OTP Login ID)
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            style={{ height: 46, borderRadius: 10, background: "#f3f4f6" }}
                            id="mobileNumber"
                            name="mobileNumber"
                            value={formik.values.mobileNumber}
                            readOnly
                        />
                        <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Verified mobile number used for OTP sign-in
                        </small>
                    </div>

                    <div className="col-md-6 col-12">
                        <label htmlFor="email" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            style={{ height: 46, borderRadius: 10 }}
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <small className="text-danger d-block mt-1">{formik.errors.email}</small>
                        )}
                    </div>
                </div>

                {/* Default Delivery Address */}
                <h6 className="fw-bold mb-3" style={{ color: "#1a1a1a" }}>
                    Saved Delivery Address
                </h6>
                <div className="row g-3 mb-4">
                    <div className="col-12">
                        <label htmlFor="address" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            Street Address
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
                                    formik.setFieldValue("zipcode", parts.postalCode);
                                }
                            }}
                        >
                            <input
                                type="text"
                                className="form-control"
                                style={{ height: 46, borderRadius: 10 }}
                                id="address"
                                name="address"
                                placeholder="Start typing street address..."
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete="off"
                            />
                        </AddressAutofill>
                    </div>

                    <div className="col-md-6 col-12">
                        <label htmlFor="city" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            City
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            style={{ height: 46, borderRadius: 10 }}
                            id="city"
                            name="city"
                            placeholder="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="col-md-6 col-12">
                        <label htmlFor="zipcode" className="form-label fw-semibold mb-1" style={{ fontSize: "0.86rem" }}>
                            Postal Code
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            style={{ height: 46, borderRadius: 10 }}
                            id="zipcode"
                            name="zipcode"
                            placeholder="e.g. N2A 4J3"
                            value={formik.values.zipcode}
                            onChange={(e) => {
                                formik.setFieldValue("zipcode", formatPostalCode(e.target.value));
                            }}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.zipcode && formik.errors.zipcode && (
                            <small className="text-danger d-block mt-1">{formik.errors.zipcode}</small>
                        )}
                    </div>
                </div>

                <div className="w-100 text-center mt-2">
                    <button
                        className="login-submit-btn"
                        type="submit"
                        disabled={saving}
                        style={{ maxWidth: 320, margin: "0 auto" }}
                    >
                        {saving ? "Saving Changes..." : "Save Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileUpdate;
