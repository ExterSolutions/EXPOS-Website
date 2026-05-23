/**
 * useBodyScrollLock
 *
 * Prevents the background page from scrolling while a sheet/modal is open.
 *
 * iOS Safari problem:
 *   Setting `document.body.style.overflow = "hidden"` does NOT prevent body
 *   scroll on iOS — the page keeps sliding behind the modal.
 *
 * Fix:
 *   We snapshot `window.scrollY`, pin the body with `position: fixed; top: -scrollY`,
 *   then restore both on unlock so the user ends up at the same scroll position.
 *
 * Usage:
 *   useBodyScrollLock(isOpen);   // auto-locks when isOpen=true, auto-unlocks on false
 */
import { useEffect, useRef } from "react";

export function useBodyScrollLock(isLocked) {
    // Store the scroll position when we lock so we can restore it on unlock.
    const scrollRef = useRef(0);

    useEffect(() => {
        if (!isLocked) {
            // ── Unlock ─────────────────────────────────────────────────────
            // Only restore if we had actually locked (body.style.position is fixed)
            if (document.body.style.position === "fixed") {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.left = "";
                document.body.style.right = "";
                document.body.style.overflowY = "";
                // Restore exact scroll position
                window.scrollTo(0, scrollRef.current);
            }
            return;
        }

        // ── Lock ───────────────────────────────────────────────────────────
        scrollRef.current = window.scrollY;

        // Position the body so its visible top matches the current scroll.
        // This prevents a jarring jump when we add position:fixed.
        document.body.style.position   = "fixed";
        document.body.style.top        = `-${scrollRef.current}px`;
        document.body.style.left       = "0";
        document.body.style.right      = "0";
        // Keep overflow-y: scroll to prevent layout-shift from losing the scrollbar
        document.body.style.overflowY  = "scroll";

        return () => {
            // Cleanup in case component unmounts while still locked
            if (document.body.style.position === "fixed") {
                document.body.style.position  = "";
                document.body.style.top       = "";
                document.body.style.left      = "";
                document.body.style.right     = "";
                document.body.style.overflowY = "";
                window.scrollTo(0, scrollRef.current);
            }
        };
    }, [isLocked]);
}

export default useBodyScrollLock;
