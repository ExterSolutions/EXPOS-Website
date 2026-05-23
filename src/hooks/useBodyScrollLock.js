/**
 * useBodyScrollLock  —  v4 (ref-based, StrictMode-safe, HMR-safe)
 *
 * Adds/removes "scroll-locked" class on <html> when a modal/sheet is open.
 *
 * Key improvements over v3:
 * - Uses a ref to track whether THIS instance has locked, not a module-level counter.
 *   This means React StrictMode double-invocation and HMR hot-reloads can't corrupt the count.
 * - The module-level counter is still used to handle MULTIPLE simultaneous locks correctly,
 *   but we also guard against double-lock from the same instance (StrictMode safety).
 *
 * CSS (in index.css):
 *   html.scroll-locked,
 *   html.scroll-locked body { overflow: hidden !important; touch-action: none; }
 */
import { useEffect, useRef } from "react";

// Shared counter — tracks how many active locks exist across all hook instances
let lockCount = 0;

function applyLock() {
    lockCount++;
    document.documentElement.classList.add("scroll-locked");
}

function releaseLock() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
        document.documentElement.classList.remove("scroll-locked");
    }
}

export function useBodyScrollLock(isLocked) {
    // Track whether this particular hook instance is currently holding a lock.
    // This prevents double-locks from StrictMode double-invocation and HMR.
    const hasLock = useRef(false);

    useEffect(() => {
        if (isLocked && !hasLock.current) {
            // Acquire lock
            hasLock.current = true;
            applyLock();
        } else if (!isLocked && hasLock.current) {
            // Release lock
            hasLock.current = false;
            releaseLock();
        }

        return () => {
            // Always release on cleanup if we were holding a lock
            if (hasLock.current) {
                hasLock.current = false;
                releaseLock();
            }
        };
    }, [isLocked]);
}

export default useBodyScrollLock;
