/**
 * src/components/_main/StoreClosedBanner.jsx
 *
 * Reads storeOpen + storeHoursString from GlobalContext.
 * Shows a prominent banner at the TOP of the page when the store is closed.
 * Renders nothing when open — zero cost.
 */
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

const StoreClosedBanner = () => {
    const ctx = useContext(GlobalContext);
    const storeOpen       = ctx?.storeOpen       ?? true;
    const storeHoursString = ctx?.storeHoursString ?? null;

    if (storeOpen) return null;

    return (
        <>
            {/* ── Top sticky banner ── */}
            <div
                id="store-closed-banner"
                role="alert"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 99999,
                    background: 'linear-gradient(90deg, #b71c1c 0%, #d32f2f 100%)',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '10px 16px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                }}
            >
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <span>We're currently closed.</span>
                {storeHoursString && (
                    <span style={{ fontWeight: 400, opacity: 0.9 }}>
                        We accept orders: <strong>{storeHoursString}</strong>
                    </span>
                )}
            </div>
            {/* Spacer so page content isn't hidden behind the banner */}
            <div style={{ height: 44 }} aria-hidden="true" />
        </>
    );
};

export default StoreClosedBanner;
