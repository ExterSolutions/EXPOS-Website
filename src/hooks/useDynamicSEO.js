import { useEffect } from 'react';

export const useDynamicSEO = (data) => {
    useEffect(() => {
        if (!data) return;

        // 1. Title
        document.title = data.site_name || "Loading..";

        // 2. Meta Tags
        const updateMeta = (nameOrProperty, value) => {
            const isProperty = nameOrProperty.startsWith('og:');
            const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                isProperty ? el.setAttribute('property', nameOrProperty) : el.setAttribute('name', nameOrProperty);
                document.head.appendChild(el);
            }
            el.setAttribute('content', value);
        };

        const desc = `Order delicious pizzas from ${data.site_name}. Fresh ingredients in Calgary.`;
        updateMeta('description', desc);
        updateMeta('og:title', data.site_name);
        updateMeta('og:description', desc);
        updateMeta('og:image', data.fevicon);

        // 3. Favicon (The reliable way)
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        // Cache busting is key here
        link.href = `${data.favicon}?v=${new Date().getTime()}`;
        if (!document.querySelector("link[rel*='icon']")) document.head.appendChild(link);

    }, [data]);
};