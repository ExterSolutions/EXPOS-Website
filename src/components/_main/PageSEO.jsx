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
        descriptionTpl: 'Order the best pizza in {city}. Hot tandoori pizza, shahi paneer pizza, signature pizzas, burgers & more. Fast delivery or pickup. Order online now!',
        keywords: [
            'best pizza in {city}',
            'pizza near me {city}',
            'pizza delivery {city}',
            'pizza pickup {city}',
            'tandoori pizza {city}',
            'shahi paneer pizza',
            'Indian pizza {city}',
            'best pizza in town',
            'pizza near me',
            'burger {city}',
            'pizza online order',
            'best tandoori pizza',
        ],
    },
    menu: {
        titleTpl:       'Full Menu | {name} — Pizza, Sides & Drinks in {city}',
        descriptionTpl: 'Browse our full menu at {name} in {city}. Signature pizzas, tandoori pizza, shahi paneer pizza, sides, dips, drinks and more. Order online for delivery or pickup.',
        keywords: [
            'full pizza menu {city}',
            'pizza menu near me',
            'tandoori pizza menu',
            'pizza delivery menu {city}',
            'Indian pizza menu {city}',
        ],
    },
    signaturePizza: {
        titleTpl:       'Signature Pizzas | {name} — Best Tandoori & Paneer Pizza in {city}',
        descriptionTpl: 'Try our award-winning signature pizzas in {city} — tandoori chicken pizza, shahi paneer pizza, butter chicken pizza & more. Order online for fast delivery or pickup.',
        keywords: [
            'signature pizza {city}',
            'tandoori chicken pizza {city}',
            'butter chicken pizza {city}',
            'shahi paneer pizza {city}',
            'paneer pizza near me',
            'best signature pizza near me',
            'Indian pizza {city}',
        ],
    },
    createYourOwn: {
        titleTpl:       'Build Your Own Pizza | {name} in {city}',
        descriptionTpl: 'Customise your perfect pizza at {name} in {city}. Choose your crust, sauce, cheese and toppings — tandoori, paneer, chicken & veggie options. Order pizza online.',
        keywords: [
            'custom pizza {city}',
            'build your own pizza {city}',
            'create your own pizza near me',
            'pizza toppings {city}',
            'custom tandoori pizza',
        ],
    },
    flexDeals: {
        titleTpl:       'Pizza Deals & Combos | {name} in {city}',
        descriptionTpl: 'Get the best pizza deals in {city}! Combo deals, family packs, and flex meal deals at {name}. Order online and save. Delivery & pickup available.',
        keywords: [
            'pizza deals near me',
            'pizza combo deal {city}',
            'family pizza deal {city}',
            'pizza discount {city}',
            'cheap pizza near me',
            'pizza specials {city}',
        ],
    },
    sides: {
        titleTpl:       'Sides & Snacks | {name} in {city}',
        descriptionTpl: 'Complete your meal with our delicious sides at {name} in {city}. Garlic bread, chicken wings, poutine, onion rings & more. Order online now.',
        keywords: [
            'garlic bread near me',
            'chicken wings delivery {city}',
            'pizza sides near me',
            'poutine near me',
            'snacks {city}',
        ],
    },
    drinks: {
        titleTpl:       'Drinks | {name} in {city}',
        descriptionTpl: 'Pair your pizza with cold drinks at {name} in {city}. Pop, juice, water and more. Order online for delivery or pickup.',
        keywords: [
            'drinks with pizza {city}',
            'pop delivery near me',
            'cold drinks pizza',
        ],
    },
    dips: {
        titleTpl:       'Dips & Sauces | {name} in {city}',
        descriptionTpl: 'Level up your pizza with our signature dips and sauces at {name} in {city}. Garlic dip, ranch, marinara & more. Add to your online order.',
        keywords: [
            'pizza dips near me',
            'garlic dip pizza {city}',
            'pizza sauce {city}',
        ],
    },
    cart: {
        titleTpl:       'Your Cart | {name}',
        descriptionTpl: 'Review your order at {name} in {city}. Add more items or proceed to checkout for fast pizza delivery or pickup.',
        keywords: ['pizza order {city}', 'pizza checkout'],
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
    const name    = siteData.site_name  || 'Our Pizza Restaurant';
    const city    = siteData.city       || '';
    const phone   = siteData.contact_phone || '';
    const address = siteData.address    || '';
    const logo    = siteData.logo       || '';
    const siteUrl = siteData.siteUrl    || window.location.origin;
    const geo     = siteData.geo        || { lat: '', lng: '' };
    const province = siteData.province  || '';
    const country  = siteData.country   || 'CA';
    const twitterHandle = siteData.twitterHandle || '';

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
        servesCuisine: ['Pizza', 'Indian', 'Canadian', 'Tandoori', 'Halal'],
        priceRange:    '$$',
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
        openingHoursSpecification: [
            {
                '@type':   'OpeningHoursSpecification',
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                opens:     '11:00',
                closes:    '23:00',
            },
        ],
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
