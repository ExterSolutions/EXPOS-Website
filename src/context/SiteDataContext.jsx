// src/context/SiteDataContext.jsx
//
// Fetches site identity from the admin API (/feed/site) once on mount.
// PageSEO reads from here — zero manual config per client deployment.
//
// Every field defaults to '' / null / [] — never to a hardcoded brand value.
// The only safe default is country: '' (not 'CA') so the schema only includes
// country when the admin has actually configured it.
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
        // ── Identity ──────────────────────────────────────────────────────────
        site_name:      '',
        logo:           null,
        favicon:        null,
        qrcode:         null,

        // ── Contact ──────────────────────────────────────────────────────────
        contact_email:  '',
        contact_phone:  '',
        address:        '',
        postal_code:    '',   // for LocalBusiness schema postalCode field

        // ── Location — all empty until API responds ───────────────────────────
        // NOTE: no 'CA' default for country — omit the field unless admin set it
        siteUrl:        window.location.origin,
        city:           '',
        province:       '',
        country:        '',

        // ── Language — drives html lang="" + og:locale ────────────────────────
        language:       '',   // e.g. 'en', 'fr', 'es'

        // ── Coordinates — populated only when admin provides them ─────────────
        geo:            { lat: '', lng: '' },

        // ── Social ───────────────────────────────────────────────────────────
        twitterHandle:  '',

        // ── Business details for JSON-LD schema ───────────────────────────────
        opening_hours:  null,   // [{ day, opens, closes }] from admin
        price_range:    '',     // e.g. '$$'
        serves_cuisine: [],     // e.g. ['Pizza', 'Indian', 'Halal']

        // ── Branding extras ──────────────────────────────────────────────────
        tagline:        '',     // e.g. 'Fresh. Hot. Delivered.' — shown in header top bar
        rating:         null,   // { value, count } — feeds aggregateRating JSON-LD
    });

    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const fetchSiteData = async () => {
        try {
            setLoading(true);
            const response = await getSiteData();
            if (response.status && response.data) {
                const d = response.data;

                // ── Resolve city / province / country ──────────────────────────
                // Prefer explicit fields from API; fall back to parsing address.
                const addressStr = d.address || '';
                let city     = d.city     || d.store_city     || '';
                let province = d.province || d.state          || d.store_province || '';
                let country  = d.country  || d.store_country  || '';

                if ((!city || !province) && addressStr) {
                    // Heuristic: "123 Main St, Surrey, BC V3R 4P1, Canada"
                    const parts = addressStr.split(',').map(p => p.trim()).filter(Boolean);
                    if (parts.length >= 2) {
                        if (!city)     city     = parts[parts.length - 3] || parts[parts.length - 2] || '';
                        if (!province) {
                            const provincePart = parts[parts.length - 2] || '';
                            // Strip embedded postal codes: "BC V3R 4P1" → "BC"
                            province = provincePart
                                .replace(/\b[A-Z]\d[A-Z]\s*\d[A-Z]\d\b/i, '')
                                .trim()
                                .split(' ')[0];
                        }
                        if (!country) country = parts[parts.length - 1] || '';
                    }
                }

                // ── Resolve postal code ────────────────────────────────────────
                const postalCode =
                    d.postal_code  ||
                    d.zip_code     ||
                    d.zipcode      ||
                    d.postcode     ||
                    '';

                // ── Resolve language ──────────────────────────────────────────
                // Admin might send 'en', 'en-CA', or 'English'
                const rawLang = d.language || d.site_language || d.lang || '';
                // Normalise to ISO 639-1 two-letter code
                const language = rawLang.toLowerCase().slice(0, 2);

                setSiteData({
                    site_name:      d.site_name      || '',
                    logo:           d.logo           || null,
                    favicon:        d.favicon        || null,
                    qrcode:         d.qrcode         || null,
                    contact_email:  d.contact_email  || '',
                    contact_phone:  d.contact_phone  || '',
                    address:        addressStr,
                    postal_code:    postalCode,
                    // Use admin's site_url if set; browser origin is always correct fallback
                    siteUrl:        d.site_url       || window.location.origin,
                    city,
                    province,
                    country,
                    language,
                    geo: {
                        lat: d.latitude  || d.lat  || '',
                        lng: d.longitude || d.lng  || d.long || '',
                    },
                    twitterHandle:  d.twitter_handle || d.twitter || '',
                    opening_hours:  d.opening_hours  || null,
                    price_range:    d.price_range    || d.priceRange || '',
                    serves_cuisine: d.serves_cuisine || d.servesCuisine || [],
                    tagline:        d.tagline        || d.site_tagline || '',
                    // rating: { value, count } — only set when admin provides both
                    rating: (d.rating_value && d.rating_count)
                        ? { value: d.rating_value, count: d.rating_count }
                        : (d.rating && d.rating.value && d.rating.count)
                            ? d.rating
                            : null,
                });
            }
        } catch (err) {
            console.error('[SiteDataContext] Failed to fetch site data:', err);
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