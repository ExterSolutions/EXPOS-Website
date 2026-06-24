/**
 * src/components/_main/PageSEO.jsx
 *
 * Fully dynamic SEO component — pulls EVERY value from the admin API
 * via SiteDataContext. Zero hardcoded brand, location, or locale values.
 *
 * Usage:
 *   <PageSEO pageKey="home" />
 *   <PageSEO pageKey="signaturePizza" />
 *
 * Optional overrides (all optional — use when a page needs custom text):
 *   <PageSEO pageKey="home" titleOverride="..." descriptionOverride="..." />
 */

import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSiteDataContext } from '../../context/SiteDataContext';

// ── Per-page keyword & description templates ──────────────────────────────────
// {name}, {city}, {cuisine} are runtime placeholders filled from admin data.
const PAGE_TEMPLATES = {
    home: {
        titleTpl:       '{name} | Best {cuisine}Pizza in {city} — Delivery & Pickup',
        descriptionTpl: 'Order the best pizza in {city} from {name}. {cuisine}pizza, signature pizzas & more. Hot fresh delivery or pickup. Order online now!',
        keywords: [
            'best pizza in {city}',
            'pizza near me {city}',
            'pizza delivery {city}',
            'pizza pickup {city}',
            'pizza restaurant {city}',
            'pizza place near me',
            'order pizza online {city}',
            'pizza delivery near me',
            'pizza takeout {city}',
            'best pizza restaurant near me',
            'tandoori pizza {city}',
            'shahi paneer pizza',
            'butter chicken pizza {city}',
            'Indian pizza {city}',
            'halal pizza {city}',
            'desi pizza {city}',
            'paneer pizza near me',
            'chicken tikka pizza',
            'masala pizza {city}',
            'vegetarian pizza {city}',
            'pizza near me',
            'best pizza near me',
            'pizza online order',
            'hot fresh pizza',
            'pizza home delivery',
            'fast pizza delivery',
            'pizza open now {city}',
            'pizza tonight {city}',
            'pizza {city} Canada',
            'best Canadian pizza',
        ],
    },
    menu: {
        titleTpl:       'Full Menu | {name} — Pizza, Sides & Drinks in {city}',
        descriptionTpl: 'Browse the full {name} menu in {city}. Signature pizzas, tandoori pizza, paneer pizza, sides, dips, wings, drinks and more. Order online for delivery or pickup.',
        keywords: [
            'full pizza menu {city}',
            'pizza menu near me',
            'tandoori pizza menu',
            'pizza delivery menu {city}',
            'Indian pizza menu {city}',
            'halal pizza menu {city}',
            'online pizza menu',
            'pizza menu with prices {city}',
            'vegetarian pizza menu',
            'chicken pizza menu',
            'pizza and wings menu {city}',
            'pizza sides menu',
            'pizza combo menu {city}',
        ],
    },
    signaturePizza: {
        titleTpl:       'Signature Pizzas | {name} — Best Tandoori & Paneer Pizza in {city}',
        descriptionTpl: 'Try our award-winning signature pizzas at {name} in {city} — tandoori chicken pizza, shahi paneer pizza, butter chicken pizza, BBQ chicken pizza & more. Fast delivery or pickup.',
        keywords: [
            'signature pizza {city}',
            'tandoori chicken pizza {city}',
            'butter chicken pizza {city}',
            'shahi paneer pizza {city}',
            'paneer pizza near me',
            'best signature pizza near me',
            'Indian pizza {city}',
            'halal chicken pizza {city}',
            'BBQ chicken pizza {city}',
            'tikka masala pizza',
            'gourmet pizza {city}',
            'specialty pizza {city}',
            'unique pizza flavours {city}',
            'chef special pizza {city}',
            'best chicken pizza near me',
        ],
    },
    createYourOwn: {
        titleTpl:       'Build Your Own Pizza | {name} in {city}',
        descriptionTpl: 'Customise your perfect pizza at {name} in {city}. Pick your crust, sauce, cheese, and toppings — chicken, paneer, veggie & more. Fresh made to order. Order online now.',
        keywords: [
            'custom pizza {city}',
            'build your own pizza {city}',
            'create your own pizza near me',
            'design your own pizza {city}',
            'make your own pizza {city}',
            'pizza toppings {city}',
            'custom tandoori pizza',
            'custom paneer pizza',
            'pizza crust options {city}',
            'thin crust pizza {city}',
            'stuffed crust pizza {city}',
            'pizza with extra toppings',
            'vegetarian custom pizza',
            'halal custom pizza {city}',
        ],
    },
    flexDeals: {
        titleTpl:       'Pizza Deals & Combos | {name} in {city}',
        descriptionTpl: 'Best pizza deals in {city} at {name}! Combo meals, family packs, group deals & more. Great prices on pizza delivery and pickup. Order online and save today.',
        keywords: [
            'pizza deals near me',
            'pizza combo deal {city}',
            'family pizza deal {city}',
            'pizza discount {city}',
            'cheap pizza near me',
            'pizza specials {city}',
            'pizza combo {city}',
            'pizza meal deal {city}',
            'group pizza deal {city}',
            'large pizza deal {city}',
            'pizza offer {city}',
            'best value pizza {city}',
            'pizza bundle deal',
            'pizza party deal {city}',
        ],
    },
    sides: {
        titleTpl:       'Sides & Snacks | {name} in {city}',
        descriptionTpl: 'Complete your meal with sides at {name} in {city}. Garlic bread, chicken wings, poutine, onion rings, breadsticks & more. Add to your pizza order online.',
        keywords: [
            'garlic bread near me',
            'chicken wings delivery {city}',
            'pizza sides near me',
            'poutine near me',
            'snacks {city}',
            'onion rings delivery {city}',
            'breadsticks {city}',
            'pizza appetizers {city}',
            'side dishes pizza {city}',
            'wings and pizza {city}',
            'buffalo wings near me',
            'garlic knots delivery',
            'pizza extras {city}',
        ],
    },
    drinks: {
        titleTpl:       'Drinks | {name} in {city}',
        descriptionTpl: 'Pair your pizza order with refreshing drinks at {name} in {city}. Pop, juice, bottled water, energy drinks and more. Add drinks to your online order.',
        keywords: [
            'drinks with pizza {city}',
            'pop delivery near me',
            'cold drinks pizza',
            'soft drinks pizza order',
            'juice delivery {city}',
            'bottled water pizza',
            'pizza and drinks deal {city}',
            'beverages near me',
        ],
    },
    dips: {
        titleTpl:       'Dips & Sauces | {name} in {city}',
        descriptionTpl: 'Elevate your pizza with signature dips & sauces at {name} in {city}. Garlic dip, ranch, marinara, honey mustard, chipotle & more. Order with your pizza online.',
        keywords: [
            'pizza dips near me',
            'garlic dip pizza {city}',
            'pizza sauce {city}',
            'ranch dip pizza',
            'marinara sauce delivery',
            'chipotle dip pizza',
            'honey mustard pizza dip',
            'dipping sauce {city}',
            'pizza condiments near me',
        ],
    },
    cart: {
        titleTpl:       'Your Cart | {name}',
        descriptionTpl: 'Review your pizza order at {name} in {city}. Add more items or proceed to checkout for fast delivery or convenient pickup.',
        keywords: [
            'pizza order {city}',
            'pizza checkout',
            'order pizza {city}',
            'pizza basket {city}',
        ],
    },
    checkout: {
        titleTpl:       'Checkout | {name} — Secure Order in {city}',
        descriptionTpl: 'Complete your pizza order at {name} in {city}. Choose pickup or delivery, enter your address, and pay securely online. Fast, easy, and delicious.',
        keywords: [
            'pizza checkout {city}',
            'order pizza online {city}',
            'pizza delivery checkout',
            'pizza pickup checkout {city}',
            'secure pizza order',
        ],
    },
    otherPizza: {
        titleTpl:       'Popular Pizzas | {name} — Order Online in {city}',
        descriptionTpl: 'Order our most popular pizzas at {name} in {city}. From classic favourites to bold new flavours — fresh made, fast delivery or easy pickup. Order online now.',
        keywords: [
            'popular pizza {city}',
            'best pizza near me',
            'classic pizza {city}',
            'pizza delivery {city}',
            'pizza pickup {city}',
            'most loved pizza {city}',
            'pizza flavours {city}',
            'hot pizza near me',
            'online pizza order {city}',
        ],
    },
};

// ── Template filler ───────────────────────────────────────────────────────────
// Replaces {name}, {city}, {cuisine} with live admin values.
const fill = (str, name, city, cuisine) =>
    str
        .replace(/\{name\}/g,    name)
        .replace(/\{city\}/g,    city)
        .replace(/\{cuisine\}/g, cuisine);

// ── Derive OG locale from admin country + language ────────────────────────────
// e.g. country='CA', language='en' → 'en_CA'
//      country='US', language='es' → 'es_US'
// Falls back to 'en_CA' only when BOTH are missing from admin.
const buildOgLocale = (country, language) => {
    const lang = (language || '').toLowerCase().slice(0, 2) || 'en';
    const cntry = (country  || '').toUpperCase().slice(0, 2) || 'CA';
    return `${lang}_${cntry}`;
};

// ── Component ─────────────────────────────────────────────────────────────────
const PageSEO = ({ pageKey = 'home', titleOverride, descriptionOverride }) => {
    const location  = useLocation();
    const { siteData } = useSiteDataContext();

    // ── Pull every value from admin data — NO hardcoded brand/city/locale ─────
    const name          = siteData.site_name     || '';
    const city          = siteData.city          || '';
    const phone         = siteData.contact_phone || '';
    const address       = siteData.address       || '';
    const postalCode    = siteData.postal_code   || '';
    const logo          = siteData.logo          || '';
    const favicon       = siteData.favicon       || '';
    const siteUrl       = siteData.siteUrl       || window.location.origin;
    const geo           = siteData.geo           || { lat: '', lng: '' };
    const province      = siteData.province      || '';
    const country       = siteData.country       || '';
    const language      = siteData.language      || '';
    const twitterHandle = siteData.twitterHandle || '';
    const openingHours  = siteData.opening_hours || null;
    const priceRange    = siteData.price_range   || '';
    const cuisineList   = Array.isArray(siteData.serves_cuisine) && siteData.serves_cuisine.length > 0
        ? siteData.serves_cuisine
        : null;

    // Derive cuisine prefix for template placeholders
    // e.g. ['Pizza', 'Indian'] → 'Indian ' (used in "{cuisine}pizza")
    const cuisinePrefix = cuisineList && cuisineList.length > 1
        ? cuisineList.filter(c => c.toLowerCase() !== 'pizza').join(' / ') + ' '
        : '';

    // OG locale: fully derived from admin country + language fields
    const ogLocale = buildOgLocale(country, language);

    // HTML lang attribute: from admin language field
    const htmlLang = (language || '').toLowerCase().slice(0, 2) || 'en';

    const tpl = PAGE_TEMPLATES[pageKey] || PAGE_TEMPLATES.home;

    const title       = titleOverride       || fill(tpl.titleTpl,       name, city, cuisinePrefix);
    const description = descriptionOverride || fill(tpl.descriptionTpl, name, city, cuisinePrefix);
    const keywords    = tpl.keywords.map(k  => fill(k, name, city, cuisinePrefix)).join(', ');

    // ── Canonical URL — built from admin siteUrl + current pathname ───────────
    // siteUrl comes from d.site_url in the API (e.g. "https://brampton.exter.ca")
    // Falls back to window.location.origin — correct for any deployment
    const canonicalUrl = `${siteUrl}${location.pathname}`;

    // ── LocalBusiness JSON-LD — 100% from admin API ───────────────────────────
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type':    'Restaurant',
        // Core identity — all from admin
        ...(name     && { name }),
        ...(siteUrl  && { url: siteUrl }),
        ...(phone    && { telephone: phone }),
        ...(logo     && { image: logo }),
        ...(cuisineList && { servesCuisine: cuisineList }),
        ...(priceRange  && { priceRange }),

        // Address block — only included when admin has set address
        ...(address && {
            address: {
                '@type':          'PostalAddress',
                streetAddress:    address,
                ...(city        && { addressLocality: city }),
                ...(province    && { addressRegion:   province }),
                ...(postalCode  && { postalCode }),
                ...(country     && { addressCountry:  country }),
            },
        }),

        // Geo coordinates — only included when admin has set lat/lng
        ...(geo.lat && geo.lng && {
            geo: {
                '@type':    'GeoCoordinates',
                latitude:   geo.lat,
                longitude:  geo.lng,
            },
        }),

        // Opening hours — only included when admin has configured them
        ...(openingHours && Array.isArray(openingHours) && openingHours.length > 0 && {
            openingHoursSpecification: openingHours.map(h => ({
                '@type':   'OpeningHoursSpecification',
                dayOfWeek: Array.isArray(h.day) ? h.day : [h.day],
                opens:     h.opens,
                closes:    h.closes,
            })),
        }),

        // Order action — targets the menu page of this deployment
        potentialAction: {
            '@type':  'OrderAction',
            target:   `${siteUrl}/menu`,
        },
    };

    // ── BreadcrumbList JSON-LD ────────────────────────────────────────────────
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type':    'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: name || 'Home', item: siteUrl },
            ...(location.pathname !== '/' ? [{
                '@type':  'ListItem',
                position: 2,
                name:     title.split('|')[0].trim(),
                item:     canonicalUrl,
            }] : []),
        ],
    };

    return (
        <Helmet>
            {/* ── HTML lang — from admin language field ── */}
            <html lang={htmlLang} />

            {/* ── Basic ── */}
            <title>{title}</title>
            <meta name="description"  content={description} />
            <meta name="keywords"     content={keywords} />
            <meta name="robots"       content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            {name && <meta name="author" content={name} />}

            {/* ── Canonical URL — siteUrl from admin, path from router ── */}
            <link rel="canonical" href={canonicalUrl} />

            {/* ── Favicon — from admin ── */}
            {favicon && <link rel="icon" href={favicon} />}

            {/* ── Geo / Local targeting — all conditional on admin data ── */}
            {province && country && <meta name="geo.region"    content={`${country}-${province}`} />}
            {city               && <meta name="geo.placename" content={city} />}
            {geo.lat && geo.lng && <meta name="geo.position"  content={`${geo.lat};${geo.lng}`} />}
            {geo.lat && geo.lng && <meta name="ICBM"          content={`${geo.lat}, ${geo.lng}`} />}

            {/* ── Open Graph — locale derived from admin country+language ── */}
            <meta property="og:type"        content="website" />
            {name    && <meta property="og:site_name"   content={name} />}
            <meta property="og:title"       content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url"         content={canonicalUrl} />
            {logo    && <meta property="og:image"       content={logo} />}
            <meta property="og:locale"      content={ogLocale} />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card"        content="summary_large_image" />
            {twitterHandle && <meta name="twitter:site"  content={twitterHandle} />}
            <meta name="twitter:title"       content={title} />
            <meta name="twitter:description" content={description} />
            {logo && <meta name="twitter:image" content={logo} />}

            {/* ── Structured Data: LocalBusiness (Restaurant) ── */}
            <script type="application/ld+json">
                {JSON.stringify(localBusinessSchema)}
            </script>

            {/* ── Structured Data: BreadcrumbList ── */}
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
        </Helmet>
    );
};

export default PageSEO;
