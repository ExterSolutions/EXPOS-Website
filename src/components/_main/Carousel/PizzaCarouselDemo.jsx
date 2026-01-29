import React from "react";
import { Link } from "react-router-dom";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "./style-pizza-carousel.css";
import "../../../assets/styles/grid-cards.css";
import pizzaLeft from "../../../assets/images/pizza-left.png";
import pizzaRight from "../../../assets/images/pizza-right.png";

import { FaChevronRight, FaEdit } from "react-icons/fa";

const PizzaCarouselDemo = ({ sectionTitle, pizzas, redirectBase, isdemo }) => {

    return (
        <div className="section" >
            <div className={isdemo ? "container-fluid" : "container"}>
                <div className="section-header" >
                    <h3 className="section-title" >

                        {sectionTitle}

                    </h3>
                    {/* <Link className="more-link" to={`${redirectBase}`}>
                        View All
                        <FaChevronRight />
                    </Link> */}
                </div>
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, A11y]}
                    autoplay={{
                        delay: 1500,
                        disableOnInteraction: false, // This ensures autoplay continues after user interaction
                    }}
                    loop={true}
                    slidesPerView={4.2}
                    spaceBetween={10}
                    breakpoints={{
                        0: {
                            slidesPerView: isdemo ? 1.2 : 1.2,
                        },
                        576: {
                            slidesPerView: isdemo ? 2.2 : 2.2,
                        },
                        992: {
                            slidesPerView: isdemo ? 4.2 : 3.2,
                        },
                        1024: {
                            slidesPerView: isdemo ? 5.2 : 4.2,
                        },
                    }}
                    navigation={false}
                    pagination={{ clickable: true }}
                >
                    <div className="grid-container">
                        {pizzas?.map((item, index) => (
                            <SwiperSlide key={item.code}>
                                <div className="grid-card-outer" key={"signature-pz-card-" + index}>
                                    <Link to={`${redirectBase}/${item?.code}`}
                                        className="grid-card-placeholder"
                                    >
                                        <div className="grid-top-container">
                                            <img
                                                src={item?.pizzaImage}
                                                alt={item?.pizzaName}
                                                className="bestseller-placeholder"

                                            />
                                        </div>
                                        <div className="grid-card-detail">
                                            <div className="pizzaSubTitleDiv">
                                                <div className="pizzaSubTitle">
                                                    <p className="mb-1 text-decoration-none">
                                                        {item?.pizzaSubtitle ? item?.pizzaSubtitle : <>&nbsp;</>}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pizzaTitleDiv">
                                                <div className="pizzaTitle">
                                                    <h5 className="mb-1 text-decoration-none">
                                                        {item?.pizzaName}
                                                    </h5>
                                                </div>
                                            </div>


                                            <div className="btn-container">
                                                <div className="pz-card-right">
                                                    <span className="view-btn">View</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </div>
                </Swiper>
            </div>
        </div>
    );
};

export default PizzaCarouselDemo;
