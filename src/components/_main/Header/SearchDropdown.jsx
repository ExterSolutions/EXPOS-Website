import React from 'react';

const SearchDropdown = ({ results, onClose }) => {
    if (!results || results.length === 0) {
        return (
            <div className="search-dropdown">
                <div className="dropdown-item text-muted py-3 text-center">No results found</div>
            </div>
        );
    }

    return (
        <div
            className="search-dropdown shadow-lg rounded-3 overflow-hidden"
            style={{ maxHeight: '400px', overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
            {results.map((item, index) => (
                <button
                    key={`${item.code}-${index}`}
                    type="button"
                    className="search-dropdown-item d-flex align-items-center p-3 text-decoration-none border-bottom w-100 text-start"
                    onClick={() => onClose(item)}
                    style={{
                        background: 'none',
                        border: 'none',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'background-color 0.15s',
                        cursor: 'pointer',
                    }}
                >
                    <div
                        className="search-item-image-wrapper me-3 flex-shrink-0"
                        style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' }}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                    <div className="search-item-content flex-grow-1" style={{ minWidth: 0 }}>
                        <div
                            className="fw-bold text-dark text-truncate mb-0"
                            style={{ fontSize: '0.92rem' }}
                        >
                            {item.name}
                        </div>
                        <small
                            className="text-muted text-truncate d-block"
                            style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}
                        >
                            {item.productType}
                        </small>
                    </div>
                    {/* Chevron hint */}
                    <span style={{ color: '#bbb', fontSize: '1rem', flexShrink: 0, marginLeft: 8 }}>›</span>
                </button>
            ))}
        </div>
    );
};

export default SearchDropdown;