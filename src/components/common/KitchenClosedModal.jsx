/**
 * KitchenClosedModal.jsx
 *
 * A premium popup shown when a user attempts to place an order while
 * the kitchen / store is closed. Reads hours from GlobalContext.
 *
 * Usage:
 *   <KitchenClosedModal isOpen={showClosed} onClose={() => setShowClosed(false)} />
 */
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

const KitchenClosedModal = ({ isOpen, onClose }) => {
    const ctx = useContext(GlobalContext);
    const storeHoursString = ctx?.storeHoursString ?? window.__storeHoursString ?? null;

    if (!isOpen) return null;

    return (
        <>
            {/* ── Backdrop ── */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.55)',
                    zIndex: 100000,
                    backdropFilter: 'blur(3px)',
                    WebkitBackdropFilter: 'blur(3px)',
                    animation: 'kcm-fade-in 0.18s ease',
                }}
                aria-hidden="true"
            />

            {/* ── Modal card ── */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="kcm-title"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 100001,
                    width: '90%',
                    maxWidth: 420,
                    background: '#fff',
                    borderRadius: 20,
                    boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
                    overflow: 'hidden',
                    animation: 'kcm-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1)',
                }}
            >
                {/* Red gradient header */}
                <div style={{
                    background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                    padding: '28px 24px 22px',
                    textAlign: 'center',
                }}>
                    {/* Animated lock icon */}
                    <div style={{
                        fontSize: '3.2rem',
                        marginBottom: 8,
                        display: 'inline-block',
                        animation: 'kcm-bounce 0.5s 0.2s ease both',
                    }}>
                        🍕
                    </div>
                    <h2
                        id="kcm-title"
                        style={{
                            margin: 0,
                            color: '#fff',
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 800,
                            fontSize: '1.45rem',
                            letterSpacing: '-0.3px',
                        }}
                    >
                        Kitchen is Closed
                    </h2>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 28px 20px', textAlign: 'center' }}>
                    <p style={{
                        margin: '0 0 12px',
                        color: '#424242',
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        fontFamily: "'Inter', sans-serif",
                    }}>
                        We're not currently accepting orders. Please come back during our opening hours.
                    </p>

                    {storeHoursString && (
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            background: '#fff3e0',
                            border: '1.5px solid #ffb74d',
                            borderRadius: 10,
                            padding: '9px 18px',
                            marginTop: 4,
                            marginBottom: 4,
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>🕐</span>
                            <span style={{
                                color: '#e65100',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                fontFamily: "'Inter', sans-serif",
                            }}>
                                Hours: {storeHoursString}
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer button */}
                <div style={{ padding: '0 28px 28px', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onClose}
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '13px 0',
                            borderRadius: 12,
                            border: 'none',
                            background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            fontFamily: "'Inter', sans-serif",
                            cursor: 'pointer',
                            letterSpacing: '0.02em',
                            boxShadow: '0 4px 14px rgba(198,40,40,0.35)',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                        Got it
                    </button>
                </div>
            </div>

            {/* ── Keyframe animations injected once ── */}
            <style>{`
                @keyframes kcm-fade-in  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes kcm-slide-up {
                    from { opacity: 0; transform: translate(-50%, -44%) scale(0.92) }
                    to   { opacity: 1; transform: translate(-50%, -50%) scale(1) }
                }
                @keyframes kcm-bounce {
                    0%   { transform: scale(0.6) }
                    60%  { transform: scale(1.2) }
                    100% { transform: scale(1) }
                }
            `}</style>
        </>
    );
};

export default KitchenClosedModal;
