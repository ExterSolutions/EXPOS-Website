
import { useContext, useEffect, useState } from "react";
import { CgPin, CgMail, CgPhone } from "react-icons/cg";
import { FaLinkedinIn, FaSnapchatGhost, FaTiktok, FaTwitter } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import { footerContent } from "../../services";

const Footer = ({ isdemo, showOnMobile = false }) => {
    const globalCtx = useContext(GlobalContext);
    const [isAuthenticated, setIsAuthenticated] = globalCtx.auth;
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [linksOpen, setLinksOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
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
        };
        fetchFooterData();
    }, [baseUrl]);

    const copyrightText = footerData?.copyright_text || "2024 CopyRight. All Rights Reserved. Designed by ";

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

    const socialLinks = footerData?.social_links
        ? Object.entries(footerData.social_links).filter(([, url]) => url && url.trim() !== "")
        : [["instagram", "#"], ["facebook", "#"]];

    return (
        <footer className={`main-footer footer-compact${showOnMobile ? ' footer-compact--visible' : ''}`}>
            <div className="footer-inner">
                {/* Top row: Logo + Contact + Social */}
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/">
                            {loading || logoError ? (
                                <div className="placeholder-glow d-inline-block">
                                    <span className="placeholder rounded-circle" style={{ backgroundColor: "#e0e0e0", display: 'block', width: '42px', height: '42px' }}></span>
                                </div>
                            ) : (
                                <img
                                    src={footerData?.logo}
                                    alt="Logo"
                                    className="footer-logo"
                                    onError={() => setLogoError(true)}
                                />
                            )}
                        </Link>
                        <div className="footer-contact-row">
                            {footerData?.contact_info?.phone && (
                                <Link to={`tel:${footerData.contact_info.phone}`} className="footer-contact-link">
                                    <CgPhone size={14} />
                                    <span>{footerData.contact_info.phone}</span>
                                </Link>
                            )}
                            {footerData?.contact_info?.email && (
                                <Link to={`mailto:${footerData.contact_info.email}`} className="footer-contact-link">
                                    <CgMail size={14} />
                                    <span>{footerData.contact_info.email}</span>
                                </Link>
                            )}
                            {footerData?.contact_info?.address && (
                                <span className="footer-contact-link">
                                    <CgPin size={14} />
                                    <span>{footerData.contact_info.address}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="footer-social">
                        {socialLinks.map(([platform, url]) => (
                            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label={platform}>
                                {getSocialIcon(platform)}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Collapsible links on mobile, always visible on desktop */}
                <div className="footer-links-section">
                    {/* Mobile toggle */}
                    <button
                        className="footer-links-toggle d-md-none"
                        onClick={() => setLinksOpen(p => !p)}
                        aria-expanded={linksOpen}
                    >
                        <span>Quick Links</span>
                        <i className={`bi ${linksOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} />
                    </button>

                    <div className={`footer-links-body ${linksOpen ? 'footer-links-body--open' : ''}`}>
                        <div className="footer-links-group">
                            <div className="footer-links-col">
                                <span className="footer-links-head">Navigate</span>
                                <Link to="/" className="footer-link">Home</Link>
                                <Link to="/menu" className="footer-link">Menu</Link>
                                <Link to={isAuthenticated ? "/my-account" : "/login"} className="footer-link">
                                    {isAuthenticated ? "My Account" : "Sign In"}
                                </Link>
                            </div>
                            <div className="footer-links-col">
                                <span className="footer-links-head">Legal</span>
                                <Link to="/terms-conditions" className="footer-link">Terms</Link>
                                <Link to="/privacy-policy" className="footer-link">Privacy</Link>
                                <Link to="/refund-policy" className="footer-link">Refund Policy</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright bar */}
                <div className="footer-bottom">
                    <span className="footer-copyright">
                        {(() => {
                            // Find "exter" in the copyright text (case-insensitive) and hyperlink it
                            const match = copyrightText.match(/exter/i);
                            if (match) {
                                const idx = copyrightText.toLowerCase().indexOf("exter");
                                return (
                                    <>
                                        {copyrightText.slice(0, idx)}
                                        <a href="https://www.exter.ca/" target="_blank" rel="noopener noreferrer">
                                            {copyrightText.slice(idx, idx + 5)}
                                        </a>
                                        {copyrightText.slice(idx + 5)}
                                    </>
                                );
                            }
                            // Fallback: append link if "exter" not found in text
                            return (
                                <>
                                    {copyrightText}
                                    <a href="https://www.exter.ca/" target="_blank" rel="noopener noreferrer"> EXTER</a>
                                </>
                            );
                        })()}
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;