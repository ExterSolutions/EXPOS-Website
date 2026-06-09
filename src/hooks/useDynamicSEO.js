import { useEffect } from 'react';

export const useDynamicSEO = (data) => {
    useEffect(() => {
        if (!data) return;

        // 1. Title
        if (data.site_name) {
            document.title = data.site_name;
        }

        // 2. Meta Tags
        const updateMeta = (nameOrProperty, value) => {
            if (!value) return;
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

        const desc = `Order delicious pizzas from ${data.site_name}.`;
        updateMeta('description', desc);
        updateMeta('og:title', data.site_name);
        updateMeta('og:description', desc);
        updateMeta('og:image', data.favicon);

        // 3. Favicon — only update when the admin URL is actually loaded
        //    Use a dedicated element (id="dynamic-favicon") so we never
        //    mutate the static fallback icons from public/index.html.
        if (data.favicon) {
            let link = document.getElementById('dynamic-favicon');
            if (!link) {
                link = document.createElement('link');
                link.id = 'dynamic-favicon';
                link.rel = 'shortcut icon';
                link.type = 'image/x-icon';
                document.head.appendChild(link);
            }
            // Cache-bust so the browser always fetches the latest icon
            link.href = `${data.favicon}?v=${new Date().getTime()}`;
        }

    }, [data]);
};