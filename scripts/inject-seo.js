/* global process, Buffer */
/**
 * scripts/inject-seo.js
 *
 * Runs automatically as `postbuild` after every `npm run build`.
 * Injects client-specific homepage <title>, <meta name="description">, and Open Graph
 * tags into dist/index.html from the admin API (/api/v2/feed/site).
 *
 * Why:
 *  - Tracked index.html stays generic (zero cross-client branding leaks in Git).
 *  - `npm run dev` is untouched.
 *  - Production dist/index.html has real SEO & social preview tags immediately
 *    even for crawlers/link-previews that do not execute JavaScript.
 *  - Never fails the build if the API is unreachable.
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = resolve(__dirname, '..');
const DIST_HTML  = resolve(ROOT, 'dist', 'index.html');

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

const envVars = loadEnv('.env', '.env.local');
Object.assign(process.env, { ...envVars, ...process.env });

const SITE_URL = (process.env.VITE_SITE_URL || '').replace(/\/$/, '');
const API_BASE = (process.env.VITE_APP_BASE_URL || '').replace(/\/api\/v2$/, '');
const FEED_URL = API_BASE ? `${API_BASE}/api/v2/feed/site` : null;

const fetchJson = (url) =>
    new Promise((resolvePromise, rejectPromise) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
                fetchJson(res.headers.location).then(resolvePromise).catch(rejectPromise);
                return;
            }
            if (res.statusCode < 200 || res.statusCode >= 300) {
                rejectPromise(new Error(`HTTP ${res.statusCode} from ${url}`));
                return;
            }
            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                try {
                    resolvePromise(JSON.parse(Buffer.concat(chunks).toString('utf-8')));
                } catch (err) {
                    rejectPromise(err);
                }
            });
            res.on('error', rejectPromise);
        });
        req.setTimeout(8000, () => {
            req.destroy(new Error('Request timed out'));
        });
        req.on('error', rejectPromise);
    });

const escapeHtml = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const formatCuisineList = (list) => {
    if (!Array.isArray(list) || list.length === 0) return '';
    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} & ${list[1]}`;
    return `${list.slice(0, -1).join(', ')} & ${list[list.length - 1]}`;
};

if (!existsSync(DIST_HTML)) {
    console.warn('⚠️  dist/index.html not found — skipping SEO injection');
    process.exit(0);
}

if (!FEED_URL) {
    console.warn('⚠️  VITE_APP_BASE_URL not set — skipping dist/index.html SEO injection');
    process.exit(0);
}

try {
    const json = await fetchJson(FEED_URL);
    const d = json?.data || json || {};

    const name = (d.site_name || '').trim();
    const city = (d.city || d.store_city || '').trim();
    const cuisineList = Array.isArray(d.serves_cuisine) ? d.serves_cuisine.filter(Boolean) : [];
    const nonPizzaCuisines = cuisineList.filter((c) => c.toLowerCase() !== 'pizza');
    const cuisinePrefix = nonPizzaCuisines.length === 1 ? `${nonPizzaCuisines[0]} ` : '';
    const cuisineLabel = formatCuisineList(cuisineList) || 'pizza';

    const adminMetaTitle = (d.meta_site_title || '').trim();
    const adminMetaDesc  = (d.meta_site_description || '').trim();

    const defaultTitle = nonPizzaCuisines.length > 1
        ? `${name} | ${formatCuisineList(cuisineList)}${city ? ` in ${city}` : ''}`
        : `${name} | Best ${cuisinePrefix}Pizza${city ? ` in ${city}` : ''} — Delivery & Pickup`;

    const title = adminMetaTitle && adminMetaTitle.toLowerCase() !== name.toLowerCase()
        ? adminMetaTitle
        : (name ? defaultTitle : '');

    const defaultDesc = name
        ? `Order fresh ${cuisineLabel} from ${name}${city ? ` in ${city}` : ''}. Signature pizzas, deals, sides & more — hot delivery or fast pickup. Order online now!`
        : '';

    const description = adminMetaDesc.length >= 20 ? adminMetaDesc : defaultDesc;
    const ogImage     = d.logo || d.favicon || '';
    const canonical   = (d.site_url || SITE_URL || '').replace(/\/$/, '');

    let html = readFileSync(DIST_HTML, 'utf-8');

    if (title) {
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
        html = html.replace(
            /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:title" content="${escapeHtml(title)}" />`
        );
    }

    if (description) {
        html = html.replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="description" content="${escapeHtml(description)}" />`
        );
        html = html.replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:description" content="${escapeHtml(description)}" />`
        );
    }

    const extraOgTags = [
        ogImage   && !/property="og:image"/i.test(html) ? `  <meta property="og:image" content="${escapeHtml(ogImage)}" />` : '',
        canonical && !/property="og:url"/i.test(html)   ? `  <meta property="og:url" content="${escapeHtml(canonical)}" />` : '',
    ].filter(Boolean).join('\n');

    if (extraOgTags) {
        html = html.replace('</head>', `${extraOgTags}\n</head>`);
    }

    writeFileSync(DIST_HTML, html, 'utf-8');
    console.log(`✅ Injected SEO into dist/index.html (${title || 'no title'})`);
} catch (err) {
    console.warn(`⚠️  SEO injection skipped: ${err.message}`);
}
