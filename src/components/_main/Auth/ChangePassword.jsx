import { useFormik } from "formik";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { changePassword } from "../../../services";
import { useSelector } from "react-redux";

const getCharacterValidationError = (str) => {
    return `Your password must have at least 1 ${str}`;
};

const validationSchema = Yup.object({
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must have at least 6 characters")
        .max(20, "Password cannot be longer than 20 characters")
        .matches(/[0-9]/, getCharacterValidationError("digit"))
        .matches(/[a-z]/, getCharacterValidationError("lowercase"))
        .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
    passwordconfirmation: Yup.string()
        .oneOf(
            [Yup.ref("password"), null],
            "Passwords and Confirm Password must be same"
        )
        .required("Confirm Password is required"),
});
function ChangePassword({ reset }) {
    const iniValues = {
        password: "",
        passwordconfirmation: "",
    };

    const { user } = useSelector((state) => ({ ...state }));

    const onSubmit = async (values) => {
        const payload = {
            customerCode: user?.data?.customerCode,
            password: values?.password,
            password_confirmation: values?.passwordconfirmation,
        };
        await changePassword(payload)
            .then((res) => {
                toast.success(res.message);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500) {
                    toast.error(err.response.data.message);
                }
            });
    };

    const formik = useFormik({
        initialValues: iniValues,
        validateOnBlur: true,
        validationSchema: validationSchema,
        onSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        if (reset === true) {
            formik.resetForm({
                values: iniValues, // Reset the form to initial values
            });
        }
    }, [reset]);
    return (
        <div className="container py-3">
            <div className="row justify-content-start">
                <div className="col-lg-5 col-md-12 col-sm-12">
                    <div className="row">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="col-lg-12 col-md-12 col-sm-12 py-2">
                                <label className="form-label cPasswordLabel">
                                    Password <small className="text-danger">*</small>
                                </label>
                                <p className="text-secondary noteTxt mb-2">
                                    Password must 6 characters. Characters must contain atleast 1
                                    digit, 1 uppercase, 1 lowercase
                                </p>
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
                            <div className="col-lg-12 py-2 w-100 mb-3 mt-4">
                                <button
                                    className="py-2 fw-bold btn btn-md cPasswordBtn"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
