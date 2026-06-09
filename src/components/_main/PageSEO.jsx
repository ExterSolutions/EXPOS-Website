/**
 * src/components/_main/PageSEO.jsx
 *
 * Fully dynamic SEO component — pulls site name, phone, address, logo, city etc.
 * DIRECTLY from the admin API via SiteDataContext.
 *
 * NO manual configuration needed per client. Just deploy and it works. ✅
 *
 * Usage:
 *   <PageSEO pageKey="home" />
 *   <PageSEO pageKey="signaturePizza" />
 *
 * Optional overrides (all optional — use when a specific page needs custom text):
 *   <PageSEO pageKey="home" titleOverride="..." descriptionOverride="..." />
 */

import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useSiteDataContext } from '../../context/SiteDataContext';

// ── Per-page keyword & description templates ─────────────────────────────────
// Uses {name} and {city} placeholders — filled at runtime from admin data.
const PAGE_TEMPLATES = {
    home: {
        titleTpl:       '{name} | Best Pizza in {city} — Delivery & Pickup',
        descriptionTpl: 'Order the best pizza in {city} from {name}. Tandoori pizza, paneer pizza, butter chicken pizza, signature pizzas & more. Hot fresh delivery or pickup. Order online now!',
        keywords: [
            // Local high-intent
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
            // Cuisine-specific
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
            // Generic high-volume
            'pizza near me',
            'best pizza near me',
            'pizza online order',
            'hot fresh pizza',
            'pizza home delivery',
            'fast pizza delivery',
            'pizza open now {city}',
            'pizza tonight {city}',
            // Canadian market
            'pizza {city} Canada',
            'best Canadian pizza',
            'pizza poutine {city}',
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
            'pizza under 20 dollars {city}',
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
};

// Fill {name} and {city} placeholders
const fill = (str, name, city) =>
    str.replace(/\{name\}/g, name).replace(/\{city\}/g, city);

// ── Component ────────────────────────────────────────────────────────────────
const PageSEO = ({ pageKey = 'home', titleOverride, descriptionOverride }) => {
    const location = useLocation();
    const { siteData } = useSiteDataContext();

    // Pull live values from admin data
    const name          = siteData.site_name    || 'Our Pizza Restaurant';
    const city          = siteData.city         || '';
    const phone         = siteData.contact_phone || '';
    const address       = siteData.address      || '';
    const logo          = siteData.logo         || '';
    const siteUrl       = siteData.siteUrl      || window.location.origin;
    const geo           = siteData.geo          || { lat: '', lng: '' };
    const province      = siteData.province     || '';
    const country       = siteData.country      || 'CA';
    const twitterHandle = siteData.twitterHandle || '';
    const openingHours  = siteData.opening_hours || null;
    const priceRange    = siteData.price_range   || '';
    const servesCuisine = siteData.serves_cuisine && siteData.serves_cuisine.length > 0
        ? siteData.serves_cuisine
        : null; // omit from schema if admin hasn't set it;

    const tpl = PAGE_TEMPLATES[pageKey] || PAGE_TEMPLATES.home;

    const title       = titleOverride       || fill(tpl.titleTpl,       name, city);
    const description = descriptionOverride || fill(tpl.descriptionTpl, name, city);
    const keywords    = tpl.keywords.map(k => fill(k, name, city)).join(', ');

    const canonicalUrl = `${siteUrl}${location.pathname}`;

    // ── LocalBusiness JSON-LD — powers Google Maps "pizza near me" results ───
    const localBusinessSchema = {
        '@context':    'https://schema.org',
        '@type':       'Restaurant',
        name,
        url:           siteUrl,
        telephone:     phone,
        image:         logo,
        ...(servesCuisine && { servesCuisine }),
        ...(priceRange    && { priceRange }),
        ...(address && {
            address: {
                '@type':         'PostalAddress',
                streetAddress:   address,
                addressLocality: city,
                addressRegion:   province,
                addressCountry:  country,
            },
        }),
        ...(geo.lat && geo.lng && {
            geo: {
                '@type':    'GeoCoordinates',
                latitude:   geo.lat,
                longitude:  geo.lng,
            },
        }),
        // Use opening hours from admin if available, otherwise omit entirely
        ...(openingHours && Array.isArray(openingHours) && openingHours.length > 0 && {
            openingHoursSpecification: openingHours.map(h => ({
                '@type':   'OpeningHoursSpecification',
                dayOfWeek: Array.isArray(h.day) ? h.day : [h.day],
                opens:     h.opens,
                closes:    h.closes,
            })),
        }),
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
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
            ...(location.pathname !== '/' ? [{
                '@type':    'ListItem',
                position:   2,
                name:       title.split('|')[0].trim(),
                item:       canonicalUrl,
            }] : []),
        ],
    };

    return (
        <Helmet>
            {/* ── Basic ── */}
            <html lang="en" />
            <title>{title}</title>
            <meta name="description"         content={description} />
            <meta name="keywords"            content={keywords} />
            <meta name="robots"              content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            <meta name="author"              content={name} />
            <link rel="canonical"            href={canonicalUrl} />

            {/* ── Favicon (from admin) ── */}
            {siteData.favicon && <link rel="icon" href={siteData.favicon} />}

            {/* ── Geo / Local targeting ── */}
            {province && <meta name="geo.region"    content={`${country}-${province}`} />}
            {city     && <meta name="geo.placename" content={city} />}
            {geo.lat  && <meta name="geo.position"  content={`${geo.lat};${geo.lng}`} />}
            {geo.lat  && <meta name="ICBM"          content={`${geo.lat}, ${geo.lng}`} />}

            {/* ── Open Graph ── */}
            <meta property="og:type"         content="website" />
            <meta property="og:site_name"    content={name} />
            <meta property="og:title"        content={title} />
            <meta property="og:description"  content={description} />
            <meta property="og:url"          content={canonicalUrl} />
            {logo && <meta property="og:image" content={logo} />}
            <meta property="og:locale"       content="en_CA" />

            {/* ── Twitter Card ── */}
            <meta name="twitter:card"        content="summary_large_image" />
            {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
            <meta name="twitter:title"       content={title} />
            <meta name="twitter:description" content={description} />
            {logo && <meta name="twitter:image" content={logo} />}

            {/* ── Structured Data: LocalBusiness ── */}
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
