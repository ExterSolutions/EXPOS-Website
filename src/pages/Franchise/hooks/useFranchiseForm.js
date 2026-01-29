import { useState } from "react";
import { franchiseRequest } from "../../../services";
import { toast } from "react-toastify";

export const useFranchiseForm = () => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        city: "",
        province: "",
        country: "",
        preferred_area: "",
        total_liquid_assets: "",
        timeframe: "",
        preferred_language: "",
        marketing_consent: false,
        terms_consent: false,
    });

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "first_name":
                if (!value.trim()) {
                    error = "First Name is required.";
                } else if (value.length > 255) {
                    error = "First Name may not exceed 255 characters.";
                }
                break;

            case "last_name":
                if (!value.trim()) {
                    error = "Last Name is required.";
                } else if (value.length > 255) {
                    error = "Last Name may not exceed 255 characters.";
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email is required.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Please enter a valid email address.";
                } else if (value.length > 255) {
                    error = "Email may not exceed 255 characters.";
                }
                break;

            case "phone":
                if (!value.trim()) {
                    error = "Phone is required.";
                } else if (!/^\d+$/.test(value)) {
                    error = "Phone must contain only numbers.";
                } else if (value.length !== 10) {
                    error = "Phone must be exactly 10 digits.";
                }
                break;

            case "city":
                if (!value.trim()) {
                    error = "City is required.";
                }
                break;

            case "province":
                if (!value.trim()) {
                    error = "Province is required.";
                }
                break;

            case "country":
                if (!value.trim()) {
                    error = "Country is required.";
                }
                break;

            case "preferred_area":
                if (!value.trim()) {
                    error = "Preferred Area is required.";
                }
                break;

            case "total_liquid_assets":
                if (!value.trim()) {
                    error = "Total liquid assets is required.";
                }
                break;

            case "timeframe":
                if (!value.trim()) {
                    error = "Timeframe for starting a business is required.";
                } else if (!["Immediately", "1-2 months", "3-6 months", "Greater than 1 year"].includes(value)) {
                    error = "Timeframe must be one of: Immediately, 1-2 months, 3-6 months, Greater than 1 year.";
                }
                break;

            case "preferred_language":
                if (!value.trim()) {
                    error = "Preferred Language is required.";
                } else if (value.length > 255) {
                    error = "Preferred Language may not exceed 255 characters.";
                }
                break;

            case "marketing_consent":
                if (value !== true) {
                    error = "You must consent to receive marketing messages.";
                }
                break;

            case "terms_consent":
                if (value !== true) {
                    error = "You must consent to the terms and conditions.";
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateAllFields = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }
        });
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: fieldValue,
        }));

        const error = validateField(name, fieldValue);
        setErrors(prev => ({
            ...prev,
            [name]: error,
        }));
    };

    const resetForm = () => {
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            city: "",
            province: "",
            country: "",
            preferred_area: "",
            total_liquid_assets: "",
            timeframe: "",
            preferred_language: "",
            marketing_consent: false,
            terms_consent: false,
        });
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateAllFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];
            toast.error(firstError);
            return;
        }

        setErrors({});

        const trimmedFormData = Object.keys(formData).reduce((acc, key) => {
            if (typeof formData[key] === 'string') {
                acc[key] = formData[key].trim();
            } else {
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        setLoading(true);

        try {
            const res = await franchiseRequest(trimmedFormData);
            if (res.status === 200) {
                toast.success(res.message);
                resetForm();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                const firstError = Object.values(error.response.data.errors)[0];
                toast.error(firstError);
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.error) {
                console.error("⚠️ Backend error:", error.response.data.error);
                toast.error(error.response.data.error);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        loading,
        handleChange,
        handleSubmit,
        resetForm
    };
};