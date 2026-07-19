/**
 * scripts/generate-sitemap.js
 *
 * Runs automatically as `prebuild` before every `npm run build`.
 * Can also be run manually: node scripts/generate-sitemap.js
 *
 * What this script does (in order):
 *
 *  1. Reads VITE_SITE_URL + VITE_APP_BASE_URL from .env / .env.local
 *  2. Fetches /api/v2/feed/site from the admin API to get favicon + logo URLs
 *  3. Generates public/sitemap.xml  — with image:image entries using the
 *     admin favicon URL (no hardcoded images; all from admin)
 *  4. Patches  public/robots.txt   — Sitemap: line updated to match VITE_SITE_URL
 *  5. Downloads the admin favicon  → public/favicon.ico
 *  6. Updates  public/manifest.json — rewrites icons[] to point at the
 *     admin favicon URL so PWA installs also get the correct branding
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

// ── Resolve paths ──────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = resolve(__dirname, '..');

// ── Load .env manually (ESM-compatible, no extra deps) ────────────────────────
function loadEnv(...files) {
    const env = {};
    for (const file of files) {
        try {
            const content = readFileSync(resolve(ROOT, file), 'utf-8');
            for (const line of content.split('\n')) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx === -1) continue;
                const key = trimmed.slice(0, eqIdx).trim();
                const val = trimmed.slice(eqIdx + 1).trim().replace(/^[\"']|[\"']$/g, '');
                env[key] = val;
            }
        } catch {
            // file doesn't exist — skip silently
        }
    }
    return env;
}

// .env.local overrides .env (mirrors Vite's behaviour)
const envVars = loadEnv('.env', '.env.local');
Object.assign(process.env, { ...envVars, ...process.env }); // process.env wins (CI overrides)

// ── Config ────────────────────────────────────────────────────────────────────
const SITE_URL = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
const API_BASE = (process.env.VITE_APP_BASE_URL || '').replace(/\/api\/v2$/, '');
const FEED_URL = API_BASE ? `${API_BASE}/api/v2/feed/site` : null;
const today    = new Date().toISOString().split('T')[0];

// ── Routes ────────────────────────────────────────────────────────────────────
// Do NOT include: /cart, /checkout, /login, /my-account, /payment, /order
// (those are blocked in robots.txt and should never be indexed)
const routes = [
    { path: '/',                 changefreq: 'daily',   priority: '1.0' },
    { path: '/menu',             changefreq: 'weekly',  priority: '0.9' },
    { path: '/signaturepizza',   changefreq: 'weekly',  priority: '0.9' },
    { path: '/create-your-own',  changefreq: 'monthly', priority: '0.8' },
    { path: '/flex-deals',       changefreq: 'daily',   priority: '0.9' },
    { path: '/sides',            changefreq: 'weekly',  priority: '0.7' },
    { path: '/dips',             changefreq: 'weekly',  priority: '0.7' },
    { path: '/drinks',           changefreq: 'weekly',  priority: '0.7' },
    { path: '/privacy-policy',   changefreq: 'yearly',  priority: '0.3' },
    { path: '/terms-conditions', changefreq: 'yearly',  priority: '0.3' },
    { path: '/refund-policy',    changefreq: 'yearly',  priority: '0.3' },
    { path: '/about-us',         changefreq: 'monthly', priority: '0.6' },
    { path: '/contact-us',       changefreq: 'monthly', priority: '0.6' },
    { path: '/stores',           changefreq: 'weekly',  priority: '0.7' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
/** Follow redirects and download a URL to a Buffer. */
const downloadUrl = (url) => {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        client.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                downloadUrl(res.headers.location).then(resolve).catch(reject);
                return;
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
};

/** GET a URL and return parsed JSON (follows redirects via downloadUrl). */
const fetchJson = (url) =>
    downloadUrl(url).then(buf => JSON.parse(buf.toString('utf-8')));

// ── Step 1: Fetch admin site data (favicon + logo) ────────────────────────────
let adminFaviconUrl = null;
let adminLogoUrl    = null;
let adminSiteName   = null;

if (FEED_URL) {
    try {
        console.log(`🔍 Fetching admin site data from: ${FEED_URL}`);
        const json = await fetchJson(FEED_URL);
        adminFaviconUrl = json?.data?.favicon || json?.favicon || null;
        adminLogoUrl    = json?.data?.logo    || json?.logo    || null;
        adminSiteName   = json?.data?.site_name || json?.site_name || null;
        if (adminFaviconUrl) {
            console.log(`✅ Admin favicon URL: ${adminFaviconUrl}`);
        } else {
            console.warn('⚠️  No favicon found in admin API response');
        }
    } catch (err) {
        console.warn(`⚠️  Could not fetch admin site data: ${err.message}`);
    }
} else {
    console.warn('⚠️  VITE_APP_BASE_URL not set — skipping admin API fetch');
}

// ── Step 2: Build sitemap.xml with image entries from admin ───────────────────
// We include an image:image entry in every URL pointing at the admin favicon.
// This tells Google exactly which image belongs to this site — no guessing.
const imageXmlNs = adminFaviconUrl
    ? '\n       xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : '';

const buildImageEntry = (faviconUrl, siteUrl, siteName) => {
    if (!faviconUrl) return '';
    const title = siteName ? `\n      <image:title>${siteName}</image:title>` : '';
    return `
    <image:image>
      <image:loc>${faviconUrl}</image:loc>${title}
      <image:caption>Site logo for ${siteUrl}</image:caption>
    </image:image>`;
};

const urlEntries = routes.map(({ path, changefreq, priority }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${buildImageEntry(adminFaviconUrl, SITE_URL, adminSiteName)}
  </url>`).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageXmlNs}>${urlEntries}
</urlset>
`;

const outPath = resolve(ROOT, 'public', 'sitemap.xml');
mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(outPath, xml, 'utf-8');

console.log(`✅ sitemap.xml generated for: ${SITE_URL}`);
console.log(`   → ${outPath}`);
console.log(`   → ${routes.length} URLs written`);
if (adminFaviconUrl) {
    console.log(`   → image:image entries use admin favicon: ${adminFaviconUrl}`);
}

// ── Step 3: Patch robots.txt ──────────────────────────────────────────────────
const robotsPath = resolve(ROOT, 'public', 'robots.txt');
try {
    let robotsContent = readFileSync(robotsPath, 'utf-8');
    robotsContent = robotsContent.replace(
        /^Sitemap:.*$/m,
        `Sitemap: ${SITE_URL}/sitemap.xml`
    );
    writeFileSync(robotsPath, robotsContent, 'utf-8');
    console.log(`✅ robots.txt patched:  Sitemap: ${SITE_URL}/sitemap.xml`);
} catch (err) {
    console.warn(`⚠️  Could not patch robots.txt: ${err.message}`);
}

// ── Step 4: Download favicon → public/favicon.ico ────────────────────────────
// Ensures the browser tab icon is correct for:
//   - First-time visitors (before localStorage cache is populated)
//   - Plain XML pages like sitemap.xml (JavaScript doesn't execute there)
if (adminFaviconUrl) {
    try {
        const imgBuffer  = await downloadUrl(adminFaviconUrl);
        const faviconOut = resolve(ROOT, 'public', 'favicon.ico');
        writeFileSync(faviconOut, imgBuffer);
        console.log(`✅ favicon.ico downloaded from admin: ${adminFaviconUrl}`);
    } catch (err) {
        console.warn(`⚠️  favicon.ico download failed: ${err.message}`);
    }
} else {
    console.warn('⚠️  No admin favicon URL — favicon.ico not updated');
}

// ── Step 5: Update public/manifest.json with admin favicon ───────────────────
// PWA installs (Add to Home Screen) use manifest.json icons[].
// We rewrite icons[] to reference the live admin favicon URL so the installed
// PWA icon always matches the correct client brand — no hardcoded asset paths.
const manifestPath = resolve(ROOT, 'public', 'manifest.json');
try {
    const manifestRaw  = readFileSync(manifestPath, 'utf-8');
    const manifest     = JSON.parse(manifestRaw);

    // Always update the app name from admin if available
    if (adminSiteName) {
        manifest.name       = adminSiteName;
        manifest.short_name = adminSiteName;
    }

    // Replace icons[] with admin favicon URL in standard PWA sizes
    if (adminFaviconUrl) {
        manifest.icons = [
            { src: adminFaviconUrl, sizes: '192x192', type: 'image/png' },
            { src: adminFaviconUrl, sizes: '512x512', type: 'image/png' },
        ];
        console.log(`✅ manifest.json icons updated to admin favicon: ${adminFaviconUrl}`);
    } else {
        // Remove stale hardcoded icons so no wrong branding leaks through
        manifest.icons = [];
        console.warn('⚠️  manifest.json icons cleared (no admin favicon available)');
    }

    writeFileSync(manifestPath, JSON.stringify(manifest, null, 1), 'utf-8');
} catch (err) {
    console.warn(`⚠️  Could not update manifest.json: ${err.message}`);
}

// ── Step 6: Rewrite browserconfig.xml with admin favicon ─────────────────────
// This removes the hardcoded exter-ms-*.png tiles used by Windows pinned sites
// (IE/legacy Edge). We use the admin favicon URL for all tile sizes.
const browserConfigPath = resolve(ROOT, 'public', 'browserconfig.xml');
try {
    const tileImage = adminFaviconUrl || '';
    const bConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="${tileImage}"/>
      <square150x150logo src="${tileImage}"/>
      <square310x310logo src="${tileImage}"/>
      <TileColor>#ffffff</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`;
    writeFileSync(browserConfigPath, bConfig, 'utf-8');
    if (adminFaviconUrl) {
        console.log(`✅ browserconfig.xml updated with admin favicon`);
    } else {
        console.warn('⚠️  browserconfig.xml written with empty image (no admin favicon available)');
    }
} catch (err) {
    console.warn(`⚠️  Could not update browserconfig.xml: ${err.message}`);
}
