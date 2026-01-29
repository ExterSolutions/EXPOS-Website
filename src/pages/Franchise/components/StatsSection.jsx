import React from 'react';
import { useTheme } from '../../../context/ThemeContext';


const StatsSection = ({ statsSectionData, statsMainTitle, statsSubTitle }) => {
    const { theme, colors } = useTheme();

    return (
        <section className="stats-section-perfect">
            <div className="stats-wrapper">
                <h2 className="stats-main-title "
                    style={{ color: colors?.primary }}
                    >{statsMainTitle}</h2>
                <p className="stats-sub-title"
                style={{ color: colors?.subprimary }}
                >{statsSubTitle}</p>
                <div className="stats-grid"
                >
                    {statsSectionData.map((item) => (
                        <div key={item.id} className="stat-item">
                            <div className="stat-img-wrapper">
                                <img
                                    src={item.image_path}
                                    alt={item.title}
                                    className="img-fluid stat-icon"
                                />
                            </div>
                            <div className="stat-label"
                            style={{ color: colors?.subprimary }}
                            >{item.title}</div>
                            <h3 className="stat-value"
                            style={{ color: colors?.primary }}
                            >{item.counter}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;