import React from 'react';
import Dips from '../../_main/Dips/Dips';
import CartFunction from '../../cart';

function DipsSelector({ dips }) {
    const cartFn = new CartFunction();
    if (!dips || dips.length === 0) return null;

    return (
        <section className="menu-section pt-4" id="dips">
            <div className="menu-section-header-wrapper d-flex align-items-end justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <span className="menu-section-pill-tag">🥣 FLAVOR BOOSTERS</span>
                    <h2 className="menu-section-heading mt-1 mb-0">Signature Dips</h2>
                    <p className="menu-section-subtext mb-0 mt-1">
                        Creamy garlic, cheddar jalapeño, ranch, and sweet chili sauces.
                    </p>
                </div>
            </div>
            <div className="row g-3 signature-grid" id="dipsmenucard">
                {dips.map((data) => (
                    <div
                        className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
                        key={'dips-card-' + data?.code}
                    >
                        <Dips key={data.dipsCode} data={data} cartFn={cartFn} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default DipsSelector;