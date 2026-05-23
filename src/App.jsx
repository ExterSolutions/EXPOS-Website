import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "animate.css";
import "./assets/styles/style.css";
import "./assets/styles/flex-deals.css";
import "react-toastify/dist/ReactToastify.css";
import AllRoutes from "./routes/AllRoutes";
import BottomNav from "./components/_main/BottomNav";
import StoreClosedBanner from "./components/_main/StoreClosedBanner";

/**
 * ScrollUnlocker — safety net that clears the scroll-locked class on every
 * route change. If any modal/sheet forgets to clean up (e.g. fast navigation,
 * error boundary, HMR), this guarantees the page is ALWAYS scrollable after
 * changing routes.
 */
function ScrollUnlocker() {
    const location = useLocation();
    useEffect(() => {
        // Small delay so any modal cleanup effects fire first
        const t = setTimeout(() => {
            document.documentElement.classList.remove("scroll-locked");
        }, 50);
        return () => clearTimeout(t);
    }, [location.pathname]);
    return null;
}

function App() {
    return (
        <div id="wrapper">
            <ScrollUnlocker />
            <AllRoutes />
            {/* Mobile Bottom Navigation Bar */}
            <BottomNav />
            {/* Store Closed Banner — shows automatically outside store hours */}
            <StoreClosedBanner />
            {/* Toast */}
            <ToastContainer hideProgressBar={false} position="top-right" />
        </div>
    );
}

export default App;