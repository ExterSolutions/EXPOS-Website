import React from 'react';
import backgroundImage from '../../assets/images/download-bg.jpg';
import { Link } from 'react-router-dom';
import appStore from '../../assets/images/appstore.svg';
import playStore from '../../assets/images/playstore.svg';
import '../../assets/styles/downloadsection.css';

const DownloadSection = () => {
    return (
        <div className="px-0 d-nones pt-5">
            <div id="czparallaxcmsblock">
                <div className="czparallax" >
                    <div className="parallax czparallax_1" style={{ background: `url(${backgroundImage})` }}>
                        <div className="parallax_container container">
                            <div className="parallaxcms">
                                <div className="parallaxcms-inner">
                                    <div className="parallaxcms-content">
                                        <div className="main-title">Download The App <span>And Order.</span></div>
                                        <div className="parallaxcms-img">
                                            <Link className="banner-anchor" href="#">
                                                <img className="banner-image3" alt="google play" src={playStore} width="238" height="71" />
                                            </Link>
                                            <Link className="banner-anchor" href="#">
                                                <img className="banner-image4" alt="app store" src={appStore} width="238" height="71" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadSection;