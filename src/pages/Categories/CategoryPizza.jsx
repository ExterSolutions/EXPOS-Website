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
import SignaturePizzaMain from "../../assets/images/download/new/cat/pizza-topping.png";
import dips from "../../assets/images/download/new/cat/Thumbails/dips-nw.png";
import drinks from "../../assets/images/download/new/cat/Thumbails/drinks-nw.png";
import { useTheme } from '../../context/ThemeContext';

const CategoryPizza = () => {

    const navigate = useNavigate();
    const { theme, colors } = useTheme();

    const categories = [
        { id: 8, name: 'Flex Deals',      image: Deals,             path: 'flex-deals',      alt: 'Flex Deals' },
        { id: 1, name: 'Signature Pizzas', image: SignaturePizzaMain, path: 'signaturepizza',  alt: 'Signature Pizza' },
        { id: 5, name: 'Create Your Own', image: createPizza,        path: 'create-your-own', alt: 'Create Your Own' },
        { id: 2, name: 'Sides',           image: Sides,              path: 'sides',           alt: 'Sides' },
        { id: 3, name: 'Dips',            image: dips,               path: 'dips',            alt: 'Dips' },
        { id: 4, name: 'Drinks',          image: drinks,             path: 'drinks',          alt: 'Drinks' },
    ];

    const handleCategorySelect = (id, path) => {
        navigate(`/${path}`);
    };

    return (
        <section className="category-section pt-60 text-center">
            <div className="container-fluid container-lg">
                <div className="d-flex align-items-center justify-content-center">
                    <div className="section-header w-100">
                        <span
                            className="category-subtitle text-center"
                            style={{ color: colors?.primary }}
                        >EXPLORE OUR MENU</span>
                        <div className="section-title text-center">Order by Category</div>
                    </div>
                </div>
                <div className="category-container category-swiper-wrap mt-4 mx-auto" style={{ maxWidth: '1100px' }}>
                    <Swiper
                        modules={[A11y, Autoplay, Pagination]}
                        autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        loop={false}
                        centeredSlides={false}
                        slidesPerView={2.5}
                        spaceBetween={12}
                        style={{ paddingBottom: '36px' }}
                        breakpoints={{
                            0: { slidesPerView: 2.5, spaceBetween: 10, centeredSlides: true },
                            480: { slidesPerView: 3.5, spaceBetween: 12, centeredSlides: true },
                            640: { slidesPerView: 4.5, spaceBetween: 15, centeredSlides: true },
                            768: { slidesPerView: 6, spaceBetween: 15, centeredSlides: false },
                            1024: { slidesPerView: 7, spaceBetween: 20, centeredSlides: false },
                        }}
                    >
                    {categories.map((cat, index) => (
                        <SwiperSlide key={index}>
                            <div className="category-card text-center" onClick={() => handleCategorySelect(cat.id, cat.path)}>
                                <div className="category-image-wrapper mx-auto">
                                    <img
                                        src={cat.image}
                                        alt={cat.alt}
                                        className="category-image"
                                    />
                                </div>
                                <div className="category-info text-center">
                                    <h3
                                        className="category-name text-center"
                                        style={{ color: colors.primary }}
                                    >
                                        {cat.name}
                                    </h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default CategoryPizza;
