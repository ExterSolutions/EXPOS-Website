// src/context/SiteDataContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSiteData } from '../services';

const SiteDataContext = createContext();

export const useSiteDataContext = () => {
    const context = useContext(SiteDataContext);
    if (!context) {
        throw new Error('useSiteDataContext must be used within SiteDataProvider');
    }
    return context;
};

export const SiteDataProvider = ({ children }) => {
    const [siteData, setSiteData] = useState({
        site_name: "Chandigarh  Pizza",
        logo: null,
        contact_email: "contact@chandigarhpizza.ca",
        contact_phone: "+1 403 492 5500",
        address: "",
        favicon: null,
        qrcode: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSiteData = async () => {
        try {
            setLoading(true);
            const response = await getSiteData();
            if (response.status && response.data) {
                setSiteData({
                    site_name: response.data.site_name || "Chandigarh Pizza",
                    logo: response.data.logo || null,
                    contact_email: response.data.contact_email || "hello@chandigarhpizza.in",
                    contact_phone: response.data.contact_phone || "+1 403 492 5500",
                    address: response.data.address || "",
                    favicon: response.data.favicon || null,
                    qrcode: response.data.qrcode || null
                });
            }
        } catch (err) {
            console.error('Error fetching site data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSiteData();
    }, []);

    return (
        <SiteDataContext.Provider value={{ siteData, loading, error, refetch: fetchSiteData }}>
            {children}
        </SiteDataContext.Provider>
    );
};