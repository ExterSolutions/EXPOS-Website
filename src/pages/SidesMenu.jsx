import { useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import "../assets/styles/menu-cards/sides.css";
import SideSlider from "../components/_main/Sides/SideSlider";
import CartFunction from "../components/cart";
import LoadingLayout from "../layouts/LoadingLayout";
import { getSidesTypeWise } from "../services";

function SidesMenu({ searchQuery, searchCode }) {
    const [sidesData, setSideData] = useState([]);
    const [loading, setLoading] = useState(true);
    const cartFn = new CartFunction();

    const fetchSides = async (query) => {
        setLoading(true);
        try {
            const res = await getSidesTypeWise(query);
            // Some APIs return data directly, others wrap it
            setSideData(res?.data || res || []);
        } catch (err) {
            console.error("ERROR From Sides Page API: ", err);
            setSideData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSides(searchQuery);
    }, [searchQuery]);

    // Frontend filtering as a fallback/refinement
    const filteredSides = searchCode || searchQuery
        ? sidesData.map(category => {
            const matchedItems = (category.sides || []).filter(item => {
                if (searchCode) {
                    return item.code === searchCode || item.sideCode === searchCode;
                }
                return item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       item.sideName?.toLowerCase().includes(searchQuery.toLowerCase());
            });
            return matchedItems.length > 0 ? { ...category, sides: matchedItems } : null;
        }).filter(Boolean)
        : sidesData;

    if (loading) {
        return <LoadingLayout />;
    }

    return (
        <>
            {filteredSides.length > 0 ? (
                filteredSides.map((data, index) => (
                    <div key={`sides-index-${index}`}>
                        <SideSlider data={data} cartFn={cartFn} />
                    </div>
                ))
            ) : (
                <div className="container text-center py-5">
                    <p className="text-muted">No sides found matching your search.</p>
                </div>
            )}
        </>
    );
}

export default SidesMenu;
