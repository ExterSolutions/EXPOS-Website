import { useState, useEffect } from 'react';

/**
 * CountdownTimer
 *
 * Self-managing countdown. Restarts whenever `resetKey` changes.
 *
 * Props:
 *   durationSeconds  Starting seconds (default 180 = 3 min)
 *   onExpire         Called once when remaining reaches 0
 *   resetKey         Increment this to restart the timer
 *   label            Text shown before the MM:SS value
 */
export function CountdownTimer({
    durationSeconds = 180,
    onExpire,
    resetKey = 0,
    label = 'Price locked for',
}) {
    const [remaining, setRemaining] = useState(durationSeconds);

    // Restart whenever resetKey or durationSeconds changes
    useEffect(() => {
        setRemaining(durationSeconds);
    }, [resetKey, durationSeconds]);

    useEffect(() => {
        if (remaining <= 0) {
            onExpire?.();
            return;
        }
        const tick = setTimeout(() => setRemaining((r) => r - 1), 1000);
        return () => clearTimeout(tick);
    }, [remaining, onExpire]);

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;

    const isUrgent  = remaining <= 30;
    const isWarning = !isUrgent && remaining <= 60;
    const color     = isUrgent ? '#dc3545' : isWarning ? '#fd7e14' : '#198754';

    return (
        <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '8px',
            padding:        '8px 14px',
            borderRadius:   '8px',
            background:     `${color}18`,
            border:         `1.5px solid ${color}55`,
            transition:     'all 0.4s ease',
        }}>
            <span style={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>{label}</span>
            <span style={{
                fontSize:   '18px',
                fontWeight: 700,
                color,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.5px',
                minWidth: '42px',
                textAlign: 'center',
                transition: 'color 0.4s ease',
            }}>
                {formatted}
            </span>
            {isUrgent && (
                <span style={{ fontSize: '16px', animation: 'pulse 0.8s ease-in-out infinite' }}>⚡</span>
            )}
        </div>
    );
}

export default CountdownTimer;
