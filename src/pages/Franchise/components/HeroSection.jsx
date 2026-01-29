import React from 'react';

const HeroSection = ({ backgroundImage }) => {
    return (
        <section
            className="hero-section-perfect"
            style={
                backgroundImage
                    ? {
                        backgroundImage: `linear-gradient(135deg, rgba(241, 90, 36, 0.5) 0%, rgba(241, 90, 36, 0.45) 50%, rgba(255, 120, 70, 0.4) 100%), url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                    }
                    : {}
            }
        >
            <div className="hero-content-perfect">
                <h1 className="hero-title-perfect">Franchise</h1>
            </div>
        </section>
    );
};

export default HeroSection;