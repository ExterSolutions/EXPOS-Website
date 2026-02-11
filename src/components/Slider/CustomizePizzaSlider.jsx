import React, { useEffect, useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
// import '../../assets/styles/slider.css';

function CustomizePizzaSlider({ List, ViewAllRedirect }) {
    const customizePizzaSliderRef = useRef(null);

    const CustomizePrevButton = (props) => {
        const { onClick, currentSlide } = props;
        return (
            <button
                className={`prev-button ${currentSlide === 0 ? "hide_button" : ""}`}
                onClick={onClick}
                disabled={currentSlide === 0}
            >
                <FaChevronLeft size={20} />
            </button>
        );
    };

    const CustomizeNextButton = (props) => {
        const { onClick, currentSlide, slideCount, slidesToShow } = props;
        const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow);

        // Update slidesToShow based on the current screen width
        useEffect(() => {
            const handleResize = () => {
                if (window.innerWidth < 768) {
                    setCurrentSlidesToShow(1); // for small screens
                } else if (window.innerWidth < 1024) {
                    setCurrentSlidesToShow(2); // for medium screens
                } else {
                    setCurrentSlidesToShow(3); // for large screens
                }
            };
            // Call handleResize when the component is mounted
            handleResize();
            // Add resize event listener to handle screen size change
            window.addEventListener('resize', handleResize);
            // Cleanup the event listener on component unmount
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        // Calculate whether to disable the next button
        const isLastSlide = currentSlide >= slideCount - currentSlidesToShow;

        return (
            <button
                className={`next-button ${isLastSlide ? "hide_button" : ""}`}
                onClick={onClick}
                disabled={isLastSlide}
            >
                <FaChevronRight size={20} />
            </button>
        );
    };



    const customizePizzaSliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        arrows: true,
        prevArrow: <CustomizePrevButton />,
        nextArrow: <CustomizeNextButton slidesToShow={3} />, // Pass slidesToShow explicitly if required
        autoplay: false, // Enable autoplay
        autoplaySpeed: 3000, // Autoplay interval
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    return (
        <div className="customizeSliderSection">
            <Slider ref={customizePizzaSliderRef}
                {...{
                    ...customizePizzaSliderSettings,
                    vertical: false, // Ensure vertical scrolling is disabled if unnecessary
                    adaptiveHeight: true, // Adjust height dynamically for content
                }}>
                {/* First 3 Pizzas from otherPizzaList */}
                {List?.map((data, index) => (
                    <div key={index}>
                        <div className="card BgternaryBlackColor boxShadow">
                            <div className="image-content">
                                <div
                                    className="product-image"
                                    style={{
                                        backgroundImage: `url(${data?.pizzaImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: '150px',
                                        height: '150px',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                ></div>
                            </div>
                            <div className=' d-flex justify-content-center align-items-center w-100 flex-column'>
                                <div className="card-content my-3 text-center w-100">
                                    <p className="fs-5 fw-bold primaryWhiteColor text-ellipsis">{data?.pizzaName}</p>
                                    <p className="text-white fs-6 my-3 text-ellipsis">{data?.pizzaSubtitle}</p>
                                </div>
                                <div className="card-content">
                                    <Link to={`${ViewAllRedirect}/${data?.code}`} className="btn1 stl2 text-decoration-none fs-6">
                                        CUSTOMIZE
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* View All Button */}
                <div>
                    <div className="card d-flex justify-content-center align-items-center BgternaryBlackColor boxShadow" style={{
                        position: 'relative',
                        backgroundImage: `url('https://www.engelvoelkers.com/wp-content/uploads/2014/07/pizza-stock.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}>
                        {/* Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with 40% opacity
                            zIndex: 1
                        }}></div>

                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <Link to={ViewAllRedirect} className="btn1 stl2 text-decoration-none fs-6">VIEW ALL</Link>
                        </div>
                    </div>
                </div>
            </Slider>

        </div>
    );
}

export default CustomizePizzaSlider;
