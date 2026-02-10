// src/components/_main/Header/hooks/useSiteData.js
import { useState, useEffect } from 'react';
import { getSiteData } from '../../../../services'; 

export const useSiteData = () => {
    const [siteData, setSiteData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSiteData = async () => {
        try {
            setLoading(true);
            const response = await getSiteData(); 
            if (response.status && response.data) {
                setSiteData({
                    site_name: response.data.site_name ,
                    logo: response.data.logo || null,
                    contact_email: response.data.contact_email ,
                    contact_phone: response.data.contact_phone ,
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

    return {
        siteData,
        loading,
        error,
        refetch: fetchSiteData
    };
};