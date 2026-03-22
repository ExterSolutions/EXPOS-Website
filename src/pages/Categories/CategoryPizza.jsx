import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import createPizza from "../../assets/images/download/new/cat/Thumbails/Createyourown-1.png";
import Deals from "../../assets/images/download/new/cat/Thumbails/Deals-1.png";
import Sides from "../../assets/images/download/new/cat/Thumbails/Sides-nw.png";
import SignaturePizza from "../../assets/images/download/new/cat/Thumbails/SignaturePizza-1.png";
import dips from "../../assets/images/download/new/cat/Thumbails/dips-nw.png";
import drinks from "../../assets/images/download/new/cat/Thumbails/drinks-nw.png";
import { useTheme } from '../../context/ThemeContext';

const CategoryPizza = () => {

    const navigate = useNavigate();
    const { theme, colors } = useTheme();

    const categories = [
        { id: 6, name: 'Deals', image: Deals, path: 'specialoffer', alt: 'Deals' },
        { id: 1, name: 'Signature Pizzas', image: SignaturePizza, path: 'signaturepizza', alt: 'Signature Pizza' },
        { id: 2, name: 'Sides', image: Sides, path: 'sides', alt: 'Sides' },
        { id: 3, name: 'Dips', image: dips, path: 'dips', alt: 'Dips' },
        { id: 4, name: 'Drinks', image: drinks, path: 'drinks', alt: 'Drinks' },
        { id: 5, name: 'Create Your Own', image: createPizza, path: 'create-your-own', alt: 'Create Your Own' },
    ];

    const handleCategorySelect = (id, path) => {
        navigate(`/${path}`);
    };


    return (
        <section className="category-section pt-60">
            <div className="d-flex align-items-center justify-content-between">
                <div className="flex-grow-1 section-header">
                    <span
                        className="category-subtitle"
                        style={{ color: colors?.primary }}
                    >CHOOSE YOUR FLAVOR</span>
                    <div className="section-title">Shop By Category</div>
                </div>
            </div>
            <div className="category-container">
                <Swiper
                    slidesPerView={2}
                    spaceBetween={12}
                    loop={true}
                    autoplay={{
                        delay: 2800,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    breakpoints={{
                        0: { slidesPerView: 2.3, spaceBetween: 10 },
                        480: { slidesPerView: 2.5, spaceBetween: 10 },
                        640: { slidesPerView: 3, spaceBetween: 12 },
                        768: { slidesPerView: 4, spaceBetween: 14 },
                        1024: { slidesPerView: 6, spaceBetween: 14 },
                    }}
                    modules={[A11y, Autoplay, Pagination]}
                    className="category-swiper"
                >
                    {
                        categories.map((cat, index) => (
                            <SwiperSlide key={index}>
                                <div key={cat.id} className="category-card" onClick={() => handleCategorySelect(cat.id, cat.path)}>
                                    <div className="category-image-wrapper">
                                        <img
                                            src={cat.image}
                                            alt={cat.alt}
                                            className="category-image"
                                        />
                                    </div>
                                    <div className="category-info ">
                                        <h3
                                            className="category-name"
                                            style={{ color: colors.primary }}
                                        >
                                            {cat.name}
                                        </h3>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryPizza;