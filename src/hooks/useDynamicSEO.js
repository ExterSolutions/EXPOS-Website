// src/hooks/useDynamicSEO.js
//
// Dynamically updates the browser tab favicon + basic meta from the admin API.
//
// Strategy (3 layers — fastest to most accurate):
//
//   Layer 1 — INSTANT (< 0ms):
//     On every visit, before the API responds, read the favicon URL that was
//     cached in localStorage on the PREVIOUS visit and apply it immediately.
//     Result: returning visitors NEVER see the Exter placeholder icon.
//
//   Layer 2 — FAST (API response, typically ~200ms):
//     When SiteDataContext resolves, update the favicon with the live URL,
//     write it to localStorage for the next visit.
//
//   Layer 3 — BUILD TIME (generate-sitemap.js prebuild script):
//     The build script downloads the favicon from the admin API and saves it
//     as public/favicon.ico so even first-time visitors and the sitemap.xml
//     tab show the correct icon.
//
import { useEffect } from 'react';

const CACHE_KEY = 'expos_favicon_url';

// ── Layer 1: Apply cached favicon immediately (runs at module import time) ────
// Runs synchronously before any React component mounts, so there's zero flash.
(() => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            let link = document.getElementById('dynamic-favicon');
            if (!link) {
                link = document.createElement('link');
                link.id   = 'dynamic-favicon';
                link.rel  = 'icon';
                document.head.appendChild(link);
            }
            link.href = cached;
        }
    } catch {
        // localStorage may be unavailable in private browsing — silently ignore
    }
})();

// ── Layer 2: Update with live API data + persist for next visit ───────────────
export const useDynamicSEO = (data) => {
    useEffect(() => {
        if (!data) return;

        // 1. Document title
        if (data.site_name) {
            document.title = data.site_name;
        }

        // 2. Meta tags
        const updateMeta = (nameOrProperty, value) => {
            if (!value) return;
            const isProperty = nameOrProperty.startsWith('og:');
            const selector   = isProperty
                ? `meta[property="${nameOrProperty}"]`
                : `meta[name="${nameOrProperty}"]`;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                isProperty
                    ? el.setAttribute('property', nameOrProperty)
                    : el.setAttribute('name', nameOrProperty);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        };

        const desc = `Order delicious pizzas from ${data.site_name}.`;
        updateMeta('description',    desc);
        updateMeta('og:title',       data.site_name);
        updateMeta('og:description', desc);
        updateMeta('og:image',       data.logo || data.favicon);

        // 3. Favicon — live update + cache for instant load on next visit
        if (data.favicon) {
            let link = document.getElementById('dynamic-favicon');
            if (!link) {
                link       = document.createElement('link');
                link.id    = 'dynamic-favicon';
                link.rel   = 'icon';
                document.head.appendChild(link);
            }
            // Cache-bust with timestamp so browser always fetches the latest icon
            link.href = `${data.favicon}?v=${Date.now()}`;

            // Persist the base URL (without cache-bust) for Layer 1 on next visit
            try {
                localStorage.setItem(CACHE_KEY, data.favicon);
            } catch {
                // Ignore localStorage errors (private/incognito mode)
            }
        }

    }, [data]);
};