import { useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../assets/styles/menu-cards/sides.css";
import SideSlider from "../components/_main/Sides/SideSlider";
import CartFunction from "../components/cart";
import LoadingLayout from "../layouts/LoadingLayout";
import { getSidesTypeWise } from "../services";

function SidesMenu({ searchQuery }) {
    const [sidesData, setSideData] = useState();
    const [loading, setLoading] = useState(true);
    const cartFn = new CartFunction();

    const sides = async (searchQuery) => {
        setLoading(true);
        await getSidesTypeWise(searchQuery)
            .then((res) => {
                setSideData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("ERROR From Sides Page API: ", err);
            }).finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        sides(searchQuery);
    }, [searchQuery]);

    if (loading) {
        return <LoadingLayout />;
    }

    return (
        <>
            {
                sidesData?.map((data, index) => {
                    return (
                        <div key={`sides-index-${index}`}>
                            <SideSlider data={data} cartFn={cartFn} />
                        </div>
                    );
                })
            }
        </>
    );
}

export default SidesMenu;
