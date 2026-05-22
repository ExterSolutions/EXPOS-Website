/**
 * useBodyScrollLock  —  v3 (class-based, ref-counted, bulletproof)
 *
 * Strategy: add/remove a CSS class `.scroll-locked` on <html>.
 * The class is defined in index.css as:
 *
 *   html.scroll-locked,
 *   html.scroll-locked body { overflow: hidden !important; }
 *
 * Why NOT position:fixed on body:
 *   - position:fixed removes body from normal flow → page collapses to 0 height
 *   - If navigation occurs while locked, body stays fixed forever
 *   - Causes white blank screens and permanent scroll breakage
 *
 * Why a ref-counter:
 *   - Multiple sheets can be open simultaneously (e.g. parent + child sheet)
 *   - We only unlock when ALL sheets have closed (counter reaches 0)
 *
 * Usage:
 *   useBodyScrollLock(isOpen);  // auto-locks when true, auto-unlocks on false
 */
import { useEffect } from "react";

// Module-level counter — shared across all hook instances on the page
let lockCount = 0;

function lock() {
    lockCount++;
    document.documentElement.classList.add("scroll-locked");
}

function unlock() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
        document.documentElement.classList.remove("scroll-locked");
    }
}

export function useBodyScrollLock(isLocked) {
    useEffect(() => {
        if (!isLocked) return;

        // Lock on mount / when isLocked becomes true
        lock();

        // Unlock on cleanup (unmount or isLocked becoming false)
        return () => {
            unlock();
        };
    }, [isLocked]);
}

export default useBodyScrollLock;
