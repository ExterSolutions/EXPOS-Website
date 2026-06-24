/**
 * src/config/seo.js
 *
 * ✅ This file is documentation only — no code runs from here.
 *
 * ALL SEO values are pulled AUTOMATICALLY from the admin API (/feed/site).
 * Nothing is hardcoded — city, country, locale, language, name, address,
 * coordinates, opening hours are all dynamic per deployment.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * HOW IT WORKS
 * ──────────────────────────────────────────────────────────────────────────────
 *
 *   Admin Panel  ──→  GET /feed/site  ──→  SiteDataContext  ──→  PageSEO
 *
 * SiteDataContext maps these admin API fields:
 *
 *   Field              | Maps to siteData key   | Used in
 *   ──────────────────────────────────────────────────────────────────────────
 *   site_name          | site_name               | <title>, JSON-LD name
 *   logo               | logo                    | og:image, JSON-LD image
 *   favicon            | favicon                 | <link rel="icon">
 *   address            | address                 | JSON-LD streetAddress
 *   city               | city                    | {city} placeholder, geo tags
 *   province / state   | province                | geo.region, addressRegion
 *   country            | country                 | geo.region, addressCountry
 *   postal_code / zip_code | postal_code         | JSON-LD postalCode
 *   language / lang    | language                | <html lang="">, og:locale
 *   latitude / lat     | geo.lat                 | geo tags, JSON-LD GeoCoordinates
 *   longitude / lng    | geo.lng                 | geo tags, JSON-LD GeoCoordinates
 *   contact_phone      | contact_phone           | JSON-LD telephone
 *   twitter_handle     | twitterHandle           | twitter:site
 *   site_url           | siteUrl                 | Canonical URL, JSON-LD url
 *   opening_hours      | opening_hours           | JSON-LD openingHoursSpecification
 *   price_range        | price_range             | JSON-LD priceRange
 *   serves_cuisine     | serves_cuisine          | JSON-LD servesCuisine, {cuisine} placeholder
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * ADDING SEO TO A NEW PAGE
 * ──────────────────────────────────────────────────────────────────────────────
 *
 *   1. Add a template to PAGE_TEMPLATES in PageSEO.jsx:
 *        myPage: {
 *            titleTpl:       '{name} | My Page in {city}',
 *            descriptionTpl: 'Description using {name} and {city}.',
 *            keywords: ['keyword {city}', ...],
 *        }
 *
 *   2. In your page component:
 *        import PageSEO from '../components/_main/PageSEO';
 *        // inside JSX:
 *        <PageSEO pageKey="myPage" />
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * AVAILABLE pageKey VALUES
 * ──────────────────────────────────────────────────────────────────────────────
 *   home | menu | signaturePizza | createYourOwn | flexDeals |
 *   sides | drinks | dips | cart | checkout | otherPizza
 */
