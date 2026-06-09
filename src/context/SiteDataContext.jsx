// src/context/SiteDataContext.jsx
//
// Fetches site identity from the admin API (/feed/site) once and exposes it
// app-wide.  PageSEO reads from here — zero manual config needed per client.
//
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
        // Identity
        site_name:      '',
        logo:           null,
        favicon:        null,
        qrcode:         null,
        // Contact
        contact_email:  '',
        contact_phone:  '',
        address:        '',
        // SEO helpers derived from above (filled after fetch)
        siteUrl:        window.location.origin,
        city:           '',
        province:       '',
        country:        'CA',
        // Coordinates — optional; populated if admin returns them
        geo:            { lat: '', lng: '' },
        twitterHandle:  '',
        // Business details for JSON-LD schema
        opening_hours:  null,   // array of { day, opens, closes } from admin
        price_range:    '',     // e.g. '$$'
        serves_cuisine: [],     // e.g. ['Pizza', 'Indian']
    });
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchSiteData = async () => {
        try {
            setLoading(true);
            const response = await getSiteData();
            if (response.status && response.data) {
                const d = response.data;

                // ── Try to extract city / province from the address string ──────
                // Expected format:  "123 Main St, Surrey, BC, Canada"  or similar
                const addressStr = d.address || '';
                let city = d.city || '';
                let province = d.province || d.state || '';
                let country = d.country || 'CA';

                if (!city && addressStr) {
                    // Heuristic: split by commas, city is usually second-to-last
                    const parts = addressStr.split(',').map(p => p.trim()).filter(Boolean);
                    if (parts.length >= 2) {
                        city = parts[parts.length - 3] || parts[parts.length - 2] || '';
                        // Province is often "BC" or "ON" — last part before country
                        const provincePart = parts[parts.length - 2] || '';
                        // Strip postal codes: "BC V3R 4P1" → "BC"
                        province = provincePart.replace(/\b[A-Z]\d[A-Z]\s*\d[A-Z]\d\b/i, '').trim().split(' ')[0];
                    }
                }

                setSiteData({
                    site_name:      d.site_name     || '',
                    logo:           d.logo          || null,
                    favicon:        d.favicon       || null,
                    qrcode:         d.qrcode        || null,
                    contact_email:  d.contact_email || '',
                    contact_phone:  d.contact_phone || '',
                    address:        addressStr,
                    siteUrl:        d.site_url      || window.location.origin,
                    city:           city,
                    province:       province,
                    country:        country,
                    geo: {
                        lat: d.latitude  || d.lat || '',
                        lng: d.longitude || d.lng || d.long || '',
                    },
                    twitterHandle:  d.twitter_handle || d.twitter || '',
                    // Business details for JSON-LD — use admin values when available
                    opening_hours:  d.opening_hours  || null,
                    price_range:    d.price_range    || d.priceRange || '',
                    serves_cuisine: d.serves_cuisine || d.servesCuisine || [],
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