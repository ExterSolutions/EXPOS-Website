/**
 * src/hooks/useStoreHours.js
 *
 * Reads store open/close times from the settings API (via GlobalContext).
 * Returns whether the store is currently open and the hours string.
 *
 * The settings API should have shortCodes:
 *   open_time  → e.g. "11:00"  (24h or 12h format)
 *   close_time → e.g. "23:00"
 *
 * If those shortCodes are missing the store is assumed to be always open.
 */
import { useContext, useMemo } from 'react';
import { GlobalContext } from '../context/GlobalContext';

// Parse "11:00 AM", "11:00", "1100" → { h: 11, m: 0 }
const parseTime = (str) => {
    if (!str) return null;
    const s = str.toString().trim().toUpperCase();

    // "HH:MM AM/PM"
    const ampm = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
    if (ampm) {
        let h = parseInt(ampm[1], 10);
        const m = parseInt(ampm[2], 10);
        if (ampm[3] === 'PM' && h !== 12) h += 12;
        if (ampm[3] === 'AM' && h === 12) h = 0;
        return { h, m };
    }

    // "HH:MM" (24h)
    const hhmm = s.match(/^(\d{1,2}):(\d{2})$/);
    if (hhmm) return { h: parseInt(hhmm[1], 10), m: parseInt(hhmm[2], 10) };

    // "HHMM" (e.g. "1100")
    const compact = s.match(/^(\d{2})(\d{2})$/);
    if (compact) return { h: parseInt(compact[1], 10), m: parseInt(compact[2], 10) };

    return null;
};

const toMinutes = ({ h, m }) => h * 60 + m;

const useStoreHours = () => {
    const globalCtx = useContext(GlobalContext);
    const [settings] = globalCtx.settings || [null];

    return useMemo(() => {
        if (!settings || !Array.isArray(settings)) {
            // No settings loaded yet — assume open
            return { isOpen: true, openTime: null, closeTime: null, hoursString: null };
        }

        const find = (code) =>
            settings.find((s) => s.shortCode === code)?.settingValue ?? null;

        const openRaw  = find('open_time')  ?? find('opening_time')  ?? find('store_open_time');
        const closeRaw = find('close_time') ?? find('closing_time') ?? find('store_close_time');

        if (!openRaw || !closeRaw) {
            // shortCodes not set — assume always open
            return { isOpen: true, openTime: openRaw, closeTime: closeRaw, hoursString: null };
        }

        const openParsed  = parseTime(openRaw);
        const closeParsed = parseTime(closeRaw);

        if (!openParsed || !closeParsed) {
            return { isOpen: true, openTime: openRaw, closeTime: closeRaw, hoursString: null };
        }

        const now     = new Date();
        const current = now.getHours() * 60 + now.getMinutes();
        const openMin = toMinutes(openParsed);
        const closeMin = toMinutes(closeParsed);

        let isOpen;
        if (closeMin > openMin) {
            // Same-day hours: 11:00 – 23:00
            isOpen = current >= openMin && current < closeMin;
        } else {
            // Overnight hours: e.g. 18:00 – 02:00
            isOpen = current >= openMin || current < closeMin;
        }

        // Format for display: "11:00 AM – 11:00 PM"
        const fmt = ({ h, m }) => {
            const period = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 === 0 ? 12 : h % 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
        };
        const hoursString = `${fmt(openParsed)} – ${fmt(closeParsed)}`;

        return { isOpen, openTime: openRaw, closeTime: closeRaw, hoursString };
    }, [settings]);
};

export default useStoreHours;
