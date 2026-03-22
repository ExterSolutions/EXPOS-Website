import { useEffect } from "react";

/**
 * SEOHead - Lightweight per-page SEO component (no external library).
 * Sets document.title and updates/creates meta description dynamically.
 *
 * Usage:
 *   <SEOHead
 *     title="Signature Pizzas | Exter Pizza"
 *     description="Browse our chef-crafted signature pizzas, made fresh to order."
 *   />
 */
const SEOHead = ({ title, description, canonical }) => {
  useEffect(() => {
    // Page title
    if (title) document.title = title;

    // Meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (description) {
      if (descTag) {
        descTag.setAttribute("content", description);
      } else {
        descTag = document.createElement("meta");
        descTag.name = "description";
        descTag.content = description;
        document.head.appendChild(descTag);
      }
    }

    // OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (title && ogTitle) ogTitle.setAttribute("content", title);

    // OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (description && ogDesc) ogDesc.setAttribute("content", description);

    // Canonical
    if (canonical) {
      let canonTag = document.querySelector('link[rel="canonical"]');
      if (canonTag) canonTag.setAttribute("href", canonical);
    }

    // Cleanup: restore default values when component unmounts
    return () => {
      document.title = "Exter Pizza - Order Fresh Pizza Online | Delivery & Pickup";
      const defaultDesc = "Order fresh, handcrafted pizza online from Exter Pizza. Choose from signature pizzas, build your own, special deals, and more. Fast delivery and pickup available.";
      if (descTag) descTag.setAttribute("content", defaultDesc);
      if (ogTitle) ogTitle.setAttribute("content", "Exter Pizza - Order Fresh Pizza Online");
      if (ogDesc) ogDesc.setAttribute("content", defaultDesc);
    };
  }, [title, description, canonical]);

  return null; // renders nothing — side-effect only
};

export default SEOHead;
