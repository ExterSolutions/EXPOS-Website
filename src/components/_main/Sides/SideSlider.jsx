import { useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Sides from "./Sides";

function SideSlider({ data, cartFn }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current && prevRef.current && nextRef.current) {
            const swiperInstance = swiperRef.current.swiper;
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [data]); // Ensure this runs when data changes

    return (
        <div className="section" id="sidesmenucard">
            <div className="container">
                <h4 className="text-center text-capitalize mb-4 py-3">
                    <span className="sp-hr-left"></span>
                    <span>{data?.type}</span>
                    <span className="sp-hr-right"></span>
                </h4>
                <div className="row g-3 signature-grid">
                    {data?.sides?.map((side, index) => (
                        <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-3" key={`side-grid-card-${data?.code}`}>
                            <Sides data={side} cartFn={cartFn} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SideSlider;
