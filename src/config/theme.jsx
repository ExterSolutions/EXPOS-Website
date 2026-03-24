// config/theme.js

const envClient = (import.meta.env.VITE_SITE_CLIENT || '').toLowerCase();

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const bigint = parseInt(full, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function rgbToHex([r, g, b]) {
    return (
        '#' +
        [r, g, b]
            .map((v) => {
                const s = v.toString(16);
                return s.length === 1 ? '0' + s : s;
            })
            .join('')
    );
}

function shade(hex, percent, lighten = true) {
    const rgb = hexToRgb(hex);
    const p = Math.max(0, Math.min(1, percent));
    const out = rgb.map((c) => {
        return lighten ? Math.round(c + (255 - c) * p) : Math.round(c * (1 - p));
    });
    return rgbToHex(out);
}

function contrastForHex(hex) {
    const [r, g, b] = hexToRgb(hex);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 160 ? '#000000' : '#FFFFFF';
}

const clientPrimary = {
    chandigarh: '#e52c2c',
    panjabpizza: '#f16724',
    singhflames: '#ef4507',
    exter: '#238629',
};

const selectedMain = clientPrimary[envClient] || clientPrimary.exter;

export const theme = (() => {
    const main = selectedMain;
    const light = shade(main, 0.38, true);
    const dark = shade(main, 0.22, false);
    const contrast = contrastForHex(main);
    return {
        primary: { main, light, dark, contrast },
        subprimary: { main, light, dark, contrast },
        secondary: { main, light, dark, contrast },
    };
})();

export const colors = {
    primary: theme.primary.main,
    'primary-light': theme.primary.light,
    'primary-dark': theme.primary.dark,
    subprimary: theme.subprimary.main,
    'subprimary-light': theme.subprimary.light,
    'subprimary-dark': theme.subprimary.dark,
    secondary: theme.secondary.main,
    'secondary-light': theme.secondary.light,
    'secondary-dark': theme.secondary.dark,
};

/*
  Available clients and their primary colors:
   - Chandigarh:   #e52c2c
   - Panjabpizza:  #f16724
   - Singhflames:  #ef4507
   - Exter (default): #238629

  Set the active client via `VITE_SITE_CLIENT` in your .env (e.g. "chandigarh").
*/