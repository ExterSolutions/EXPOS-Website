
import { useContext, useEffect, useState } from "react";
import { CgMail, CgPhone } from "react-icons/cg";
import { FaLinkedinIn, FaSnapchatGhost, FaTiktok, FaTwitter } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";
import appLogo from "../../assets/images/logo.png";
import { GlobalContext } from "../../context/GlobalContext";
import { footerContent } from "../../services";

const Footer = ({ isdemo }) => {
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;

    // API Integration States
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_APP_BASE_URL;

    useEffect(() => {
        const fetchFooterData = async () => {
            await footerContent().then((res) => {
                setFooterData(res.data);
            }).catch((error) => {
                console.error("Error fetching footer data:", error);
            }).finally(() => {
                setLoading(false);
            });
        }

        fetchFooterData();
    }, [baseUrl]);


    // Get logo source
    const logoSrc = footerData?.logo || appLogo;

    // Get footer note
    const footerNote = footerData?.footer_note ||
        "At Chandigarh  Pizza, we craft delicious, handmade pizzas with the freshest ingredients to bring you a slice of happiness in every bite.";

    // Get copyright text
    const copyrightText = footerData?.copyright_text ||
        "2024 CopyRight. All Rights Reserved. Designed by ";

    // Social media icons mapping
    const getSocialIcon = (platform) => {
        const icons = {
            facebook: <FiFacebook />,
            instagram: <FiInstagram />,
            twitter: <FaTwitter />,
            linkedin: <FaLinkedinIn />,
            youtube: <FiYoutube />,
            tiktok: <FaTiktok />,
            snapchat: <FaSnapchatGhost />
        };
        return icons[platform] || null;
    };

    // Filter and render social links
    const renderSocialLinks = () => {
        if (!footerData?.social_links) {
            // Fallback to default empty links
            return (
                <>
                    <li>
                        <Link to="#">
                            <FiInstagram />
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <FiFacebook />
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <FaLinkedinIn />
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <FiYoutube />
                        </Link>
                    </li>
                </>
            );
        }

        return Object.entries(footerData.social_links)
            .filter(([platform, url]) => url && url.trim() !== "")
            .map(([platform, url]) => (
                <li key={platform}>
                    <Link to={url} target="_blank" rel="noopener noreferrer">
                        {getSocialIcon(platform)}
                    </Link>
                </li>
            ));
    };

    return (
        <footer className="main-footer"
        // style={{marginTop:"10px"}}
        >
            <div className={`container`}>
                <div className="row text-light ">
                    <div className="col-12 col-md-5 sm-center mb-3">
                        <div className="logo">
                            <Link to={"/"}>
                                <img
                                    src={logoSrc}
                                    alt="Chandigarh Pizza Official Logo"
                                    className="img-fluid"
                                    style={{ width: "72px" }}
                                />
                            </Link>
                        </div>

                        <p className="my-3 lh-sm">
                            <span>{footerData?.contact_info?.metaTitle}</span><br /><br />
                            {/* {footerNote.includes("Chandigarh Pizza")
                                ? footerNote.replace("Chandigarh Pizza", "").trim()
                                : ` ${footerNote}`
                            } */}
                        </p>

                        <div className="py-3 d-flex flex-column gap-3 w-100">
                            <div className="d-flex justify-content-start  align-items-center gap-1">
                                <Link
                                    to={`mailto:${footerData?.contact_info?.email}?subject=Contact`}
                                    className="text-decoration-none"
                                    style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}
                                >
                                    <CgMail size={18} className="me-2" />
                                    <span>{footerData?.contact_info?.email}</span>
                                </Link>
                            </div>
                            <div
                                className="d-flex justify-content-start align-items-center gap-1"
                                style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                }}
                            >
                                <Link
                                    to={`tel:${footerData?.contact_info?.phone}`}
                                    className="text-decoration-none"
                                    style={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}
                                >
                                    <CgPhone size={16} className="me-2" />
                                    <span className="">{footerData?.contact_info?.phone}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-2"></div>
                    <div className="col-12 col-md-5 mb-3">
                        <div className="row">
                            <div className="col col-sm-6">
                                <h5 className="main fs-6 fw-bold">Quick Links</h5>
                                <div className="py-3 d-flex flex-column gap-2">
                                    <Link to={"/"} className="text-decoration-none">
                                        <span className="">Home</span>
                                    </Link>
                                    {/* <Link to={"/franchise"} className="text-decoration-none">
                                        <span className="">Franchise</span>
                                    </Link>
                                    <Link to={"/stores"} className="text-decoration-none">
                                        <span className="">Stores</span>
                                    </Link>
                                    <Link to={"/about-us"} className="text-decoration-none">
                                        <span className="">About</span>
                                    </Link> */}
                                    {/* <Link to={"/contact-us"} className="text-decoration-none">
                                        <span className="">Contact</span>
                                    </Link> */}
                                    <Link to={"/menu"} className="text-decoration-none">
                                        <span className="">Menu</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="col col-sm-6">
                                <h5 className="main fs-6 fw-bold">Useful Links</h5>
                                <div className="py-3 d-flex flex-column gap-2">
                                    <Link
                                        to={"/terms-conditions"}
                                        className="text-decoration-none"
                                    >
                                        <span className="">Terms & Conditions</span>
                                    </Link>
                                    <Link to={"/privacy-policy"} className="text-decoration-none">
                                        <span className="">Privacy Policy</span>
                                    </Link>
                                    <Link to={"/refund-policy"} className="text-decoration-none">
                                        <span className="">Refund Policy</span>
                                    </Link>
                                    <Link
                                        to={isAuthenticated ? "/my-account" : "/login"}
                                        className="text-decoration-none"
                                    >
                                        <span className="">
                                            {isAuthenticated ? "My Account" : "Login"}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="copy-right">
                            <p>
                                {copyrightText}
                                {!copyrightText.toLowerCase().includes("exter") && (
                                    <Link to={`https://www.exter.ca/`}> EXTER</Link>
                                )}
                            </p>
                            <ul className="social-nav">
                                {renderSocialLinks()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;