
import { useContext, useEffect, useState } from 'react';
import { FaCheckCircle, FaMapMarkerAlt, FaPhone, FaSpinner, FaTimes } from 'react-icons/fa';
import { getStoreLocationByCity } from '../../services/index';
import { GlobalContext } from '../../context/GlobalContext';
import CartFunction from '../../components/cart';

function setStoreCookie(storeDetail) {
    try {
        const hostname = window.location.hostname;
        const domain = hostname.endsWith('exter.ca') ? '.exter.ca' : hostname;
        const json = JSON.stringify(storeDetail);

        // Use same XOR obfuscation for cookie
        const SECRET = "exter_store_pizza";
        const scrambled = json.split('').map((char, i) =>
            String.fromCharCode(char.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length))
        ).join('');
        const encoded = btoa(unescape(encodeURIComponent(scrambled)));

        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `ext_store=${encoded}; domain=${domain}; path=/; expires=${expires}; SameSite=Lax`;
    } catch (e) {
        console.error("Failed to set store cookie:", e);
    }
}

export default function StoreSelectModal({ onClose, required = false }) {
    const globalCtx = useContext(GlobalContext);
    const [selectedStore] = globalCtx.selectedStore ?? [null];
    const [, setCart] = globalCtx.cart ?? [null, null];
    const { updateSelectedStore } = globalCtx;
    const [cityGroups, setCityGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCode, setHoveredCode] = useState(null);

    const currentCity = selectedStore?.city || '';

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getStoreLocationByCity();
                const groups = Array.isArray(res?.data) ? res.data
                    : Array.isArray(res) ? res
                        : [];
                setCityGroups(groups);
            } catch {
                setError('Failed to load store locations.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSelectStore = (cityGroup, apiStore) => {
        const storeDetail = {
            code: apiStore.code,
            city: cityGroup.city,
            storeLocation: apiStore.storeLocation,
            storeAddress: apiStore.storeAddress,
            pickupNumber: apiStore.pickup_number || '',
            latitude: apiStore.latitude || '',
            longitude: apiStore.longitude || '',
        };

        if (cityGroup.city === currentCity) {
            setStoreCookie(storeDetail);
            updateSelectedStore(storeDetail);
            onClose();
        } else {
            // Clear cart when changing to a different city
            const cartFn = new CartFunction();
            cartFn.clearCart(setCart);

            setStoreCookie(storeDetail);
            const baseUrl = (cityGroup.site_url || '/').trim().replace(/\/$/, '');
            window.location.href = baseUrl;
        }
    };

    const handleBackdropClick = (e) => {
        if (required) return;
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.55)',
                zIndex: 1055,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '520px',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                    overflow: 'hidden',
                }}
            >
                {/* ── Header ──────────────────────────────────────────────── */}
                <div style={{
                    padding: '20px 24px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#111' }}>
                            {required ? 'Choose Your Store' : 'Change Store'}
                        </h5>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: required ? 'var(--primary,#E63946)' : '#888', marginTop: 2, fontWeight: required ? 600 : 400 }}>
                            {required ? 'Please select a store to continue' : 'Select a store to continue ordering'}
                        </p>
                    </div>
                    {/* Only show close button when modal is optional (not required) */}
                    {!required && (
                        <button
                            onClick={onClose}
                            style={{
                                border: 'none',
                                background: '#f5f5f5',
                                borderRadius: '50%',
                                width: 32, height: 32,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#555',
                            }}
                            aria-label="Close"
                        >
                            <FaTimes size={14} />
                        </button>
                    )}
                </div>

                {/* ── Scrollable body ─────────────────────────────────────── */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px 24px' }}>

                    {/* ── Currently selected store ────────────────────────── */}
                    {selectedStore && (
                        <>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                                Currently Selected
                            </p>
                            <div style={{
                                border: '2px solid var(--primary, #E63946)',
                                borderRadius: '14px',
                                padding: '14px 16px',
                                marginBottom: '20px',
                                background: 'rgba(230,57,70,0.04)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                            }}>
                                <FaCheckCircle size={16} style={{ color: 'var(--primary, #E63946)', flexShrink: 0, marginTop: 2 }} />
                                <div style={{ lineHeight: 1.5 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary, #E63946)' }}>
                                        {selectedStore.storeLocation || selectedStore.city}
                                    </div>
                                    {selectedStore.city && selectedStore.city !== selectedStore.storeLocation && (
                                        <div style={{ fontSize: '0.78rem', color: '#666' }}>
                                            {selectedStore.city}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '0.78rem', color: '#888', display: 'flex', alignItems: 'flex-start', gap: 4, marginTop: 2 }}>
                                        <FaMapMarkerAlt size={11} style={{ marginTop: 2, flexShrink: 0 }} />
                                        {selectedStore.storeAddress}
                                    </div>
                                    {selectedStore.pickupNumber && (
                                        <div style={{ fontSize: '0.78rem', color: '#888', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                            <FaPhone size={10} />
                                            {selectedStore.pickupNumber}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Store list ──────────────────────────────────────── */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa' }}>
                            <FaSpinner size={22} style={{ animation: 'spin 1s linear infinite' }} />
                            <p style={{ marginTop: 10, fontSize: '0.85rem' }}>Loading stores…</p>
                        </div>
                    )}

                    {error && (
                        <p style={{ color: '#E63946', textAlign: 'center', fontSize: '0.85rem' }}>{error}</p>
                    )}

                    {!loading && !error && cityGroups.map((cityGroup) => (
                        <div key={cityGroup.city} style={{ marginBottom: 20 }}>
                            {/* City label */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 10,
                            }}>
                                <span style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    color: '#4d4c4cff',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                }}>
                                    {cityGroup.city}
                                </span>
                            </div>

                            {/* Stores in this city */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {(cityGroup.storeLocations ?? []).map((store) => {
                                    const isActive = store.code === selectedStore?.code;
                                    const isHovered = hoveredCode === store.code;

                                    return (
                                        <button
                                            key={store.code}
                                            onMouseEnter={() => setHoveredCode(store.code)}
                                            onMouseLeave={() => setHoveredCode(null)}
                                            onClick={() => handleSelectStore(cityGroup, store)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 12,
                                                padding: '13px 16px',
                                                border: isActive
                                                    ? '2px solid var(--primary, #E63946)'
                                                    : isHovered
                                                        ? '2px solid rgba(230,57,70,0.4)'
                                                        : '2px solid #eee',
                                                borderRadius: '12px',
                                                background: isActive
                                                    ? 'rgba(230,57,70,0.04)'
                                                    : isHovered
                                                        ? 'rgba(230,57,70,0.02)'
                                                        : '#fff',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'border-color 0.18s, background 0.18s',
                                                width: '100%',
                                            }}
                                        >
                                            <FaMapMarkerAlt
                                                size={14}
                                                style={{
                                                    color: isActive ? 'var(--primary, #E63946)' : '#bbb',
                                                    flexShrink: 0,
                                                    marginTop: 2,
                                                    transition: 'color 0.18s',
                                                }}
                                            />
                                            <div style={{ flex: 1, lineHeight: 1.45 }}>
                                                <div style={{
                                                    fontWeight: 700,
                                                    fontSize: '0.88rem',
                                                    color: isActive ? 'var(--primary, #E63946)' : '#222',
                                                }}>
                                                    {store.storeLocation}
                                                    {isActive && (
                                                        <span style={{
                                                            marginLeft: 8,
                                                            fontSize: '0.65rem',
                                                            background: 'var(--primary, #E63946)',
                                                            color: '#fff',
                                                            borderRadius: '20px',
                                                            padding: '2px 8px',
                                                            fontWeight: 600,
                                                            verticalAlign: 'middle',
                                                        }}>
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2 }}>
                                                    {store.storeAddress}
                                                </div>
                                                {store.pickup_number && (
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        color: '#aaa',
                                                        marginTop: 2,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 4,
                                                    }}>
                                                        <FaPhone size={10} />
                                                        {store.pickup_number}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
