/**
 * scripts/generate-sitemap.js
 *
 * Generates public/sitemap.xml at build time using the VITE_SITE_URL
 * environment variable. Each customer deployment sets their own URL
 * in their .env file, so the sitemap is always correct per deployment.
 *
 * Usage (automatically runs as part of `npm run build`):
 *   node scripts/generate-sitemap.js
 *
 * Or manually:
 *   VITE_SITE_URL=https://brampton.exter.ca node scripts/generate-sitemap.js
 */

import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

// ── Resolve paths ─────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = resolve(__dirname, '..');

// ── Load .env manually (dotenv is not available in ESM via import easily) ─────
// We parse .env files ourselves so this script works without extra dependencies.
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
                const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
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

// ── Read VITE_SITE_URL from environment ───────────────────────────────────────
// Each customer's .env file should have:
//   VITE_SITE_URL=https://brampton.exter.ca
//
// Falls back to window.location.origin equivalent for local dev.
const SITE_URL = (process.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '');

// ── Today's date in YYYY-MM-DD (used for <lastmod>) ──────────────────────────
const today = new Date().toISOString().split('T')[0];

// ── All public indexable routes ───────────────────────────────────────────────
// Do NOT include: /cart, /checkout, /login, /my-account, /payment, /order
// (those are blocked in robots.txt and should never be indexed)
const routes = [
    { path: '/',                              changefreq: 'daily',   priority: '1.0' },
    { path: '/menu',                          changefreq: 'weekly',  priority: '0.9' },
    { path: '/signaturepizza',                changefreq: 'weekly',  priority: '0.9' },
    { path: '/create-your-own',               changefreq: 'monthly', priority: '0.8' },
    { path: '/flex-deals',                    changefreq: 'daily',   priority: '0.9' },
    { path: '/sides',                         changefreq: 'weekly',  priority: '0.7' },
    { path: '/dips',                          changefreq: 'weekly',  priority: '0.7' },
    { path: '/drinks',                        changefreq: 'weekly',  priority: '0.7' },
    { path: '/privacy-policy',               changefreq: 'yearly',  priority: '0.3' },
    { path: '/terms-conditions',             changefreq: 'yearly',  priority: '0.3' },
    { path: '/refund-policy',                changefreq: 'yearly',  priority: '0.3' },
    { path: '/about-us',                      changefreq: 'monthly', priority: '0.6' },
    { path: '/contact-us',                    changefreq: 'monthly', priority: '0.6' },
    { path: '/stores',                        changefreq: 'weekly',  priority: '0.7' },
];

// ── Build XML ─────────────────────────────────────────────────────────────────
const urlEntries = routes.map(({ path, changefreq, priority }) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>
`;

// ── Write to public/sitemap.xml ───────────────────────────────────────────────
const outPath = resolve(ROOT, 'public', 'sitemap.xml');
mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(outPath, xml, 'utf-8');

console.log(`✅ sitemap.xml generated for: ${SITE_URL}`);
console.log(`   → ${outPath}`);
console.log(`   → ${routes.length} URLs written`);

// ── Also patch robots.txt with the correct Sitemap: URL ──────────────────────
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

// ── Download favicon from admin API → save as public/favicon.ico ─────────────
// This ensures the browser tab favicon is correct even for:
//   - First-time visitors (before localStorage cache is populated)
//   - The sitemap.xml page (plain XML — JavaScript doesn’t run there)
//
// The admin API endpoint: GET /feed/site → data.favicon (URL)
// We download whatever image URL the admin has set and save it as favicon.ico.
const API_BASE  = (process.env.VITE_APP_BASE_URL || '').replace(/\/api\/v2$/, '');
const FEED_URL  = API_BASE ? `${API_BASE}/api/v2/feed/site` : null;

const downloadFavicon = (faviconUrl) => {
    return new Promise((resolve, reject) => {
        const client = faviconUrl.startsWith('https') ? https : http;
        client.get(faviconUrl, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                // Follow redirect
                downloadFavicon(res.headers.location).then(resolve).catch(reject);
                return;
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
};

if (FEED_URL) {
    try {
        const client = FEED_URL.startsWith('https') ? https : http;
        await new Promise((res, rej) => {
            client.get(FEED_URL, { headers: { Accept: 'application/json' } }, (response) => {
                let body = '';
                response.on('data', d => body += d);
                response.on('end', async () => {
                    try {
                        const json = JSON.parse(body);
                        const faviconUrl = json?.data?.favicon || json?.favicon || null;
                        if (faviconUrl) {
                            const imgBuffer = await downloadFavicon(faviconUrl);
                            const faviconPath = resolve(ROOT, 'public', 'favicon.ico');
                            writeFileSync(faviconPath, imgBuffer);
                            console.log(`✅ favicon.ico downloaded from admin API: ${faviconUrl}`);
                        } else {
                            console.log('⚠️  favicon not found in admin API response — using existing favicon.ico');
                        }
                        res();
                    } catch (e) {
                        console.warn(`⚠️  Could not parse admin API response for favicon: ${e.message}`);
                        res();
                    }
                });
                response.on('error', (e) => { console.warn(`⚠️  favicon API request failed: ${e.message}`); res(); });
            }).on('error', (e) => { console.warn(`⚠️  favicon API request failed: ${e.message}`); res(); });
        });
    } catch (err) {
        console.warn(`⚠️  favicon download skipped: ${err.message}`);
    }
} else {
    console.log('⚠️  VITE_APP_BASE_URL not set — favicon.ico not downloaded from API');
}
