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
    { path: '/otherpizza',                    changefreq: 'weekly',  priority: '0.8' },
    { path: '/create-your-own',               changefreq: 'monthly', priority: '0.8' },
    { path: '/specialoffer',                  changefreq: 'daily',   priority: '0.9' },
    { path: '/flex-deals',                    changefreq: 'daily',   priority: '0.9' },
    { path: '/special-offers-with-toppings',  changefreq: 'weekly',  priority: '0.8' },
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
// robots.txt is a static file — we replace the Sitemap: line with the real URL
// so search engines can find the sitemap immediately without JavaScript.
const robotsPath = resolve(ROOT, 'public', 'robots.txt');
try {
    let robotsContent = readFileSync(robotsPath, 'utf-8');
    // Replace any existing Sitemap: line (handles placeholder /sitemap.xml or old URLs)
    robotsContent = robotsContent.replace(
        /^Sitemap:.*$/m,
        `Sitemap: ${SITE_URL}/sitemap.xml`
    );
    writeFileSync(robotsPath, robotsContent, 'utf-8');
    console.log(`✅ robots.txt patched:  Sitemap: ${SITE_URL}/sitemap.xml`);
} catch (err) {
    console.warn(`⚠️  Could not patch robots.txt: ${err.message}`);
}
