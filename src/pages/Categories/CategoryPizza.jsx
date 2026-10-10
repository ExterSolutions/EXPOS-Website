import { useNavigate, Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronRight } from 'react-icons/fa';
import createPizza from "../../assets/images/download/new/cat/Thumbails/Createyourown-1.png";
import Deals from "../../assets/images/download/new/cat/Thumbails/Deals-1.png";
import Sides from "../../assets/images/download/new/cat/Thumbails/Sides-nw.png";
import SignaturePizza from "../../assets/images/download/new/cat/Thumbails/SignaturePizza-1.png";
import dips from "../../assets/images/download/new/cat/Thumbails/dips-nw.png";
import drinks from "../../assets/images/download/new/cat/Thumbails/drinks-nw.png";
import { useTheme } from '../../context/ThemeContext';
import './category-3d.css';

const CategoryPizza = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();

    const categories = [
        {
            id: 8,
            name: 'Flex Deals',
            tagline: 'Up to 30% OFF',
            badge: '🔥 HOT',
            image: Deals,
            path: 'flex-deals',
            alt: 'Flex Deals',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fff7f2 100%)',
        },
        {
            id: 1,
            name: 'Signature Pizzas',
            tagline: 'Chef\'s Special',
            badge: '⭐ POPULAR',
            image: SignaturePizza,
            path: 'signaturepizza',
            alt: 'Signature Pizza',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fffbf2 100%)',
        },
        {
            id: 5,
            name: 'Create Your Own',
            tagline: 'Built Your Way',
            badge: '🎨 CUSTOM',
            image: createPizza,
            path: 'create-your-own',
            alt: 'Create Your Own',
            bg: 'linear-gradient(180deg, #ffffff 0%, #f2faf4 100%)',
        },
        {
            id: 2,
            name: 'Sides',
            tagline: 'Wings, Bread & More',
            image: Sides,
            path: 'sides',
            alt: 'Sides',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fef8f4 100%)',
        },
        {
            id: 3,
            name: 'Dips',
            tagline: 'Creamy & Savoury',
            image: dips,
            path: 'dips',
            alt: 'Dips',
            bg: 'linear-gradient(180deg, #ffffff 0%, #fbf5ff 100%)',
        },
        {
            id: 4,
            name: 'Drinks',
            tagline: 'Cold Refreshments',
            image: drinks,
            path: 'drinks',
            alt: 'Drinks',
            bg: 'linear-gradient(180deg, #ffffff 0%, #f0f7ff 100%)',
        },
    ];

    const handleCategorySelect = (id, path) => {
        navigate(`/${path}`);
    };

    return (
        <section className="category-section pt-60" id="categories-section">
            <div className="container">
                <div className="section-header pb-1">
                    <span
                        className="category-subtitle"
                        style={{ color: colors?.primary, display: 'block', marginBottom: '2px' }}
                    >
                        ✨ What Are You Craving?
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                            <div className="section-title" style={{ margin: 0 }}>Order by Category</div>
                        </div>
                        <Link
                            to="/menu"
                            className="section-view-all-btn"
                            style={{
                                color: colors?.primary,
                                border: `1.5px solid ${colors?.primary}`,
                                background: 'transparent',
                            }}
                        >
                            Full Menu →
                        </Link>
                    </div>
                </div>
            </div>

            <div className="category-container category-3d-wrap mt-3 mx-auto" style={{ maxWidth: '1140px' }}>
                    <Swiper
                        modules={[A11y, Pagination]}
                        pagination={{
                            clickable: true,
                        }}
                        loop={false}
                        centeredSlides={false}
                        className="category-3d-swiper"
                        breakpoints={{
                            0:    { slidesPerView: 2.2, spaceBetween: 12, centeredSlides: false },
                            380:  { slidesPerView: 2.3, spaceBetween: 14, centeredSlides: false },
                            540:  { slidesPerView: 3.2, spaceBetween: 16, centeredSlides: false },
                            768:  { slidesPerView: 4.2, spaceBetween: 18, centeredSlides: false },
                            1024: { slidesPerView: 6,   spaceBetween: 18, centeredSlides: false },
                        }}
                    >
                        {categories.map((cat, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className="category-3d-card"
                                    style={{ background: cat.bg }}
                                    onClick={() => handleCategorySelect(cat.id, cat.path)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleCategorySelect(cat.id, cat.path); }}
                                >
                                    {cat.badge && (
                                        <span className="category-3d-badge">{cat.badge}</span>
                                    )}

                                    <div className="category-3d-header">
                                        <h3 className="category-3d-name">{cat.name}</h3>
                                        <span className="category-3d-tagline">{cat.tagline}</span>
                                    </div>

                                    <div className="category-3d-stage">
                                        <img
                                            src={cat.image}
                                            alt={cat.alt}
                                            className="category-3d-img"
                                            loading="lazy"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="category-3d-btn"
                                        aria-label={`View ${cat.name}`}
                                    >
                                        <FaChevronRight size={10} />
                                    </button>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
        </section>
    );
};

export default CategoryPizza;
