import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import bgSlider from "../../../assets/images/slider-bg1.jpg";
import pizzaImage from "../../../assets/images/pz.png";

const HeroSlider = ({ getSlider }) => {
    const fixedBgUrl = bgSlider;
    const containerStyle = {
        background: `url(${fixedBgUrl}) no-repeat center center`,
    };

    // Slick Slider settings
    const settings = {
        autoplay: true,
        autoplaySpeed: 5000,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // Separate static and dynamic slides
    const sortedSlides = (getSlider || []).sort((a, b) =>
        a.is_static === "true" && b.is_static !== "true" ? -1 : 1
    );

    return (
        <>
            <div className="banner slider1 new-block ">
                <div className="fixed-bg" style={containerStyle}></div>

                <Slider {...settings} className="slider slick-slider">
                    {/* Display sorted slides */}
                    {sortedSlides.length > 0 &&
                        sortedSlides.map((data, index) => (
                            <div className="item" key={index}>
                                {data.is_static === "true" ? (
                                    <div className="slider-block slide1 new-block">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-lg-6 col-md-6 col-sm-6 order-md-1 order-2">
                                                    <div className="text-block">
                                                        <h5 className="text-stl2">{data.subTitle}</h5>
                                                        <h1 className="text-stl1">{data.title}</h1>
                                                        <div
                                                            className="number-block"
                                                            data-animation-in="fadeInUp"
                                                            data-animation-out="animate-out fadeOutRight"
                                                        >
                                                            <div className="text-center">
                                                                <Link
                                                                    to={data.url}
                                                                    className="btn1 stl2 text-decoration-none"
                                                                >
                                                                    {data.btnName}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-md-6 col-sm-6 order-md-2 order-1">
                                                    <div className="img-block img2">
                                                        <div className="img-holder">
                                                            <img
                                                                src={pizzaImage}
                                                                alt=""
                                                                className="img-fluid"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="slider-block slide1 new-block mt-3">
                                        <div className="storeSlide container-fluid">
                                            <div className="row gx-3 justify-content-center align-items-center">
                                                <div className="col-md-10 col-sm-12 pb-5">
                                                    <div className="title text-center">
                                                        <h1 className="">{data.title}</h1>
                                                    </div>
                                                </div>
                                                {data?.lineentries?.length > 0 &&
                                                    data?.lineentries?.map((item, key) => (
                                                        <div
                                                            className="col-md-10 col-sm-12 px-3"
                                                            key={key}
                                                        >
                                                            <div className="storeList mb-4">
                                                                <h2 className="">
                                                                    {item.store_address}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                </Slider>
            </div>
        </>
    );
};

export default HeroSlider;
