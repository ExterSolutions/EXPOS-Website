import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dips from "../components/_main/Dips/Dips";
import CartFunction from "../components/cart";
import { GlobalContext } from "../context/GlobalContext";
import LoadingLayout from "../layouts/LoadingLayout";
import { getDips } from "../services";

function DipsMenu() {
    const [dipsData, setDipsData] = useState([]);
    const [reset, setReset] = useState(false);
    const [loading, setLoading] = useState(true);

    // Memoize CartFunction instance to prevent recreation on every render
    const cartFn = useMemo(() => new CartFunction(), []);

    const globalctx = useContext(GlobalContext);
    const [cart, setCart] = globalctx.cart;
    const [payloadEdit, setPayloadEdit] = globalctx.productEdit;
    const [isAuthenticated, setIsAuthenticated] = globalctx.auth;

    const { user } = useSelector((state) => state);

    const location = useLocation();
    const navigate = useNavigate();

    // Memoize dips fetch function to prevent unnecessary re-fetches
    const dips = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDips();
            setDipsData(res.data || []);
        } catch (err) {
            setDipsData([]); // Fallback to empty array
        } finally {
            setLoading(false);
        }
    }, []);


    // Reset Controls - Memoized and debounced
    const resetControls = useCallback(() => {
        setReset(true);
        const timer = setTimeout(() => {
            setReset(false);
        }, 200);
        return () => clearTimeout(timer); // Cleanup
    }, []);

    useEffect(() => {
        dips();
    }, [dips]); // Depend on memoized dips

    // Only render if data is loaded; avoid partial renders
    if (loading) {
        return <LoadingLayout />;
    }

    return (
        <div className="section" id="dipsmenucard">
            <div className="container" style={{ marginBottom: "40px" }}>
                <div className="row g-3 signature-grid">
                    {dipsData.length > 0 ? (
                        dipsData.map((data, index) => (
                            <div
                                className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                                key={`dip-grid-card-${data?.code || data?.dipsCode || index}`}
                            >
                                <Dips
                                    // REMOVE this key prop - it's causing the conflict
                                    // key={data.dipsCode}
                                    data={data}
                                    cartFn={cartFn}
                                    reset={reset}
                                    onReset={resetControls}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-center col-12">No dips available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DipsMenu;