import { Helmet } from 'react-helmet-async';
import { useSiteDataContext } from '../context/SiteDataContext';

export const DynamicSEO = () => {
    const { siteData } = useSiteDataContext();

    // 1. Prepare strings first
    const brandName = siteData?.site_name || "Pizza";
    const seoTitle = siteData?.site_name ? brandName : "Authentic Style Pizza";
    
    // Always provide a real string, never null/undefined
    const seoDesc = siteData?.description 
        ? siteData.description 
        : "Serves delicious pizzas. Fresh ingredients and bold flavours.";
        
    const seoFavicon = siteData?.favicon || "/logo.png";

    return (
        <Helmet defer={false}>
            {/* Standard Title */}
            <title>{seoTitle}</title>

            {/* Essential Meta Tags */}
            <meta name="description" content={seoDesc} />
            <link rel="icon" href={seoFavicon} />

            {/* Open Graph (Socials) */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDesc} />
            <meta property="og:image" content={siteData?.logo || "/logo.png"} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Restaurant",
                    "name": brandName,
                    "description": seoDesc,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": siteData?.address || "Calgary, AB"
                    }
                })}
            </script>
        </Helmet>
    );
};