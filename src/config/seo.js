/**
 * src/config/seo.js
 *
 * ✅ This file is NO LONGER needed for per-client configuration.
 *
 * All SEO data (site name, phone, address, logo, city, coordinates)
 * is now pulled AUTOMATICALLY from the admin API via SiteDataContext.
 *
 * To update SEO for any client:
 *   → Log in to the admin panel
 *   → Update: Site Name, Phone, Address, Logo under Settings → Site Data
 *   → The website will reflect changes instantly on next page load
 *
 * Per-page keyword templates are managed in:
 *   → src/components/_main/PageSEO.jsx  (PAGE_TEMPLATES object)
 *
 * To add SEO to a new page:
 *   import PageSEO from '../components/_main/PageSEO';
 *   <PageSEO pageKey="home" />
 *
 * Available pageKey values:
 *   home | menu | signaturePizza | createYourOwn | flexDeals | sides | drinks | dips | cart
 */
