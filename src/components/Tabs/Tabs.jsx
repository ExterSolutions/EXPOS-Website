import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import './style/style.css';

const Tabs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tabRefs = useRef({});

    useEffect(() => {
        // Scroll to the active tab when the location changes
        const activeTab = tabRefs.current[location.pathname];
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [location]);

    const tabItems = [
        { path: "/create-your-own", label: "Create Your Own" },
        { path: "/specialoffer", label: "Deals" },
        { path: "/signaturepizza", label: "Signature Pizzas" },
        { path: "/otherpizza", label: "Other Pizzas" },
        { path: "/sides", label: "Sides" },
        { path: "/dips", label: "Dips" },
        { path: "/drinks", label: "Drinks" },
    ];

    return (
        <div className="tabs-container">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12 pd0 BgsecondaryBlackColor">
                        <div className="tabs-block mt-1">
                            <ul className="tabs-list" role="tablist">
                                {tabItems.map(({ path, label }) => (
                                    <li className="tab-item" key={path}>
                                        <button
                                            ref={(el) => (tabRefs.current[path] = el)}
                                            onClick={() => navigate(path)}
                                            className={`tab-button ${location.pathname === path ? "active" : ""}`}
                                            id={`${label.toLowerCase().replace(/\s/g, "-")}-tab`}
                                            type="button"
                                            role="tab"
                                            aria-controls={label.toLowerCase().replace(/\s/g, "-")}
                                            aria-selected={location.pathname === path}
                                        >
                                            <span>{label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tabs;