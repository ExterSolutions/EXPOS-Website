import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import bgImage from "../../assets/images/ptrn1.jpg";
import LoadingLayout from "../../layouts/LoadingLayout";
import { sendContactUsEmail } from "../../services";


const canadianPhoneNumberRegExp = /^\d{3}\d{3}\d{4}$/;

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

function Contact() {
    const [loading, setLoading] = useState(false);


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
    // Use Formik
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

    if (loading) return <LoadingLayout />;

    return (
        <>
            <section className="container-fluid new-block m-0 p-0 w-100">
                <div class="center-wrapper cn-us new-block primary-background-color">
                    <div
                        class="fixed-bg parallax"
                        style={{ background: `url(${bgImage})` }}
                    ></div>
                    <div class="overlay"></div>
                    <div class="my-3 px-2 form-block1 ">
                        <div className="container ">
                            <div className="text-center">
                                <p className="mb-3 fs-3 fw-bold">Contact Us</p>
                            </div>
                            <div className="row gx-3  justify-content-center align-items-center">
                                {/* <div className="content col-xl-5 col-lg-7 col-md-12 col-sm-12 rounded px-lg-4 px-md-5 px-sm-1 py-4 "> */}
                                <form className="col-lg-7 card-background-color p-5" onSubmit={formik.handleSubmit}>
                                    <div className="row gx-3">
                                        {/* FirstName */}
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <input
                                                className="form-control mb-3"
                                                type="text"
                                                name="firstname"
                                                value={formik.values.firstname}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="First Name"
                                            />
                                            {formik.touched.firstname && formik.errors.firstname ? (
                                                <div className="text-danger formErrMsg mt-2 mb-3">
                                                    {formik.errors.firstname} 
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* LastName */}
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <input
                                                className="form-control mb-3 "
                                                type="text"
                                                name="lastname"
                                                value={formik.values.lastname}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Last Name"
                                            />
                                            {formik.touched.lastname && formik.errors.lastname ? (
                                                <div className="text-danger formErrMsg mt-2 mb-3">
                                                    {formik.errors.lastname}
                                                </div>
                                            ) : null}
                                        </div>
                                        {/* Phone Number */}
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <input
                                                className=" form-control mb-3 "
                                                type="tel"
                                                name="phoneno"
                                                value={formik.values.phoneno}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Mobile Number"
                                            />
                                            {formik.touched.phoneno && formik.errors.phoneno ? (
                                                <div className="text-danger formErrMsg mt-2 mb-3">
                                                    {formik.errors.phoneno}
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Email */}
                                        <div className="col-lg-6 col-md-12 col-sm-12">
                                            <input
                                                className=" form-control mb-3 "
                                                type="email"
                                                name="email"
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                placeholder="Email"
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className="text-danger formErrMsg mt-2 mb-3">
                                                    {formik.errors.email}
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Message */}
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <textarea
                                                className=" form-control mb-3 "
                                                name="message"
                                                value={formik.values.message}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                rows={4}
                                                placeholder="Message"
                                            ></textarea>
                                        </div>
                                        {formik.touched.message && formik.errors.message ? (
                                            <div className="text-danger formErrMsg mt-2 mb-3">
                                                {formik.errors.message}
                                            </div>
                                        ) : null}

                                        <div class="col-lg-12 col-md-12 text-center ">
                                            <button type="submit" className="btn btn3 regBtn py-2">
                                                Send Message
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Contact;
