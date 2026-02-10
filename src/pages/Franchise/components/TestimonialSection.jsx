import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const TestimonialSection = ({ testimonials, currentSlide, nextSlide, prevSlide, goToSlide }) => {

      const { theme, colors } = useTheme();

    return (
        <section className="testimonial-section-perfect">
            <div className="testimonial-header">
                <span className="testimonial-badge">Satisfied</span>
                <h2 className="testimonial-title"
                style={{ color: colors?.subprimary }}
                >Clients</h2>
            </div>

            <div className="testimonial-slider" >
                <button className="testimonial-nav-btn prev-btn" onClick={prevSlide} >
                    ‹
                </button>

                <div className="testimonial-content">
                    <div className="testimonial-track">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`testimonial-card ${index === currentSlide ? 'active-testimonial' : ''}`}
                                style={{
                                    transform: `translateX(${(index - currentSlide) * 100}%)`,
                                    opacity: index === currentSlide ? 1 : 0,
                                    transition: 'all 0.5s ease'
                                }}
                            >
                                <p className="testimonial-text">{testimonial.text}</p>
                                <div className="testimonial-author-section">
                                    <p className="testimonial-author">{testimonial.author}</p>
                                    <div className="testimonial-rating">
                                        {'★'.repeat(testimonial.rating)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="testimonial-nav-btn next-btn" onClick={nextSlide}>
                    ›
                </button>

                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === currentSlide ? 'active-dot' : ''}`}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;