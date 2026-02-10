import React from 'react';
import { A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../assets/styles/HeroSlider/heroSlider.css';

function HeroSliderNew({ sliderData }) {
  // Fallback if sliderData is empty or undefined
  if (!sliderData || !Array.isArray(sliderData) || sliderData.length === 0) {
    return <div className="top-slides">No slides available</div>;
  }

  return (
    <div className="top-slides">
      <Swiper
        modules={[Autoplay,  A11y]}
        slidesPerView={1}
        spaceBetween={0} 
        loop={true}
        autoplay={{
          delay: 5000,  
          disableOnInteraction: false,
        }}
        a11y={{ enabled: true }}
      >
        {sliderData.map((slide, index) => (
          <SwiperSlide key={index}>
            <picture>
              {slide?.background_image_sm && (
                <source media="(max-width: 600px)" srcSet={slide.background_image_sm} />
              )}
              {slide?.background_image_md && (
                <source media="(max-width: 1024px)" srcSet={slide.background_image_md} />
              )}
              <img
                src={slide?.background_image || '/path/to/fallback-image.jpg'}
                alt={slide?.alt_text || `Hero slide ${index + 1}`}
                className="hero-slide-img"
                loading="lazy"
              />
            </picture>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeroSliderNew;