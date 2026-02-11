import React from 'react';
import fallbackImage from '../../assets/images/default-pizza.jpg';
// import '../../assets/styles/offercard.css';
import { Link } from 'react-router-dom';

const OfferCards = ({ offers }) => {

    return (
        <div id="mz-offers">
            <div className="subbanners">

                {offers &&
                    offers.map((offer, index) => (
                        <div className="one-half subbanner-part1" key={`offer-card-${index + 1}`}>
                            <div className="subbanner-inner">
                                <div className="subbanner subbanner1">
                                    {offer.link ? (
                                        <Link className="banner-anchor" to={offer.link}>
                                            <img className="banner-image1" alt={offer.title || "Offer"} src={offer.picture} onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImage;
                                            }} />
                                        </Link>
                                    ) : (
                                        <div className="banner-anchor">
                                            <img className="banner-image1" alt={offer.title || "Offer"} src={offer.picture} onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = fallbackImage;
                                            }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default OfferCards;