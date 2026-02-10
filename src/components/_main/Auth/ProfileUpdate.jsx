import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { updateProfile } from "../../../services";
import { useFormik } from "formik";
import defaultPhoto from "../../../assets/images/avatar.jpg";
import {GlobalContext} from "../../../context/GlobalContext";
import { useDispatch } from "react-redux";
import { UPDATEUSER } from "../../../redux/authProvider/actionType";

const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;
// const canadianPostalCode = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;

const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email Address")
        .required("Email is required"),
});

function ProfileUpdate() {
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const dispatch = useDispatch();

    const iniValues = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        mobileNumber: user?.mobileNumber,
        email: user?.email,
        customerCode: user?.customerCode,
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values) => {
        const formData = new FormData();

        formData.append("customerCode", user?.customerCode);
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("mobileNumber", values.mobileNumber);
        formData.append("email", values.email);
        if (selectedFile) {
            formData.append("profilePhoto", selectedFile);
        }

        try {
            const result = await updateProfile(formData);

            if (result.data) {
                document.getElementById("profilePhoto").value = null;
                setSelectedFile(null);
                setPreviewUrl(null);

                const data = result.data;
                localStorage.setItem("user", JSON.stringify(data));
                setUser(data);
                dispatch({ type: UPDATEUSER, payload: data });
                setTimeout(() => {
                    toast.success("Profile Updated Successfully.");
                }, 500);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.response.data.message);
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
        <div className="container py-3">
            <form className="row w-100" onSubmit={formik.handleSubmit}>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <label htmlFor="firstName" className="form-label profileLabel">
                        First Name <small className="text-danger">*</small>{" "}
                    </label>
                    <input
                        type="text"
                        className="form-control mb-3 profileInput"
                        id="firstName"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.firstName && formik.errors.firstName ? (
                        <small className="text-danger formErrMsg mt-2 mb-3">
                            {formik.errors.firstName}
                        </small>
                    ) : null}
                </div>

                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <label htmlFor="lastName" className="form-label profileLabel">
                        Last Name <small className="text-danger">*</small>{" "}
                    </label>
                    <input
                        type="text"
                        className="form-control mb-3 profileInput"
                        id="lastName"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.lastName && formik.errors.lastName ? (
                        <small className="text-danger formErrMsg mt-2 mb-3">
                            {formik.errors.lastName}
                        </small>
                    ) : null}
                </div>

                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <label htmlFor="mobileNumber" className="form-label profileLabel">
                        Phone Number
                    </label>
                    <p className="text-secondary noteTxt mb-2">
                        Please use a valid phone number.
                    </p>
                    <input
                        type="tel"
                        className="form-control mb-3 profileInput"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formik.values.mobileNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly
                    />
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <label htmlFor="lastName" className="form-label profileLabel">
                        Email Address <small className="text-danger">*</small>{" "}
                    </label>
                    <p className="text-secondary noteTxt mb-2">
                        Please use a valid email address.
                    </p>
                    <input
                        type="text"
                        className="form-control mb-3 profileInput"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <small className="text-danger formErrMsg mt-2 mb-3">
                            {formik.errors.email}
                        </small>
                    ) : null}
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                    <label htmlFor="mobileNumber" className="form-label profileLabel">
                        Updated Profile Photo
                    </label>
                    <p className="text-secondary noteTxt mb-2">
                        Format: .jpeg, .jpg, .png
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        className="form-control mb-3 profileInput"
                        id="profilePhoto"
                        name="profilePhoto"
                        onChange={handleFileChange}
                    />
                    {formik.touched.profilePhoto && formik.errors.profilePhoto ? (
                        <small className="text-danger formErrMsg mt-2 mb-3">
                            {formik.errors.profilePhoto}
                        </small>
                    ) : null}
                </div>
                <div className="col-lg-6 px-3">
                    <div
                        className="col-12 rounded-circle"
                        style={{ width: "4rem", height: "4rem", overflow: "hidden" }}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                className="profile-picture"
                                alt="Profile Preview"
                            />
                        ) : (
                            <img
                                src={user?.profilePhoto ? user?.profilePhoto : defaultPhoto}
                                className="profile-picture"
                                alt={user?.userName}
                            />
                        )}
                    </div>
                </div>
                <div className="w-100 text-start mb-3 mt-4">
                    <button
                        className="py-2 fw-bold btn btn-md profileUpdateBtn"
                        type="submit"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProfileUpdate;
