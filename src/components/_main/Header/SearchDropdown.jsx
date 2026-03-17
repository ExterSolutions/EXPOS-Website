import React from 'react';
import { Link } from 'react-router-dom';

const SearchDropdown = ({ results, onClose }) => {
    if (!results || results.length === 0) {
        return (
            <div className="search-dropdown">
                <div className="dropdown-item">No results found</div>
            </div>
        );
    }

    // Helper to get dynamic redirect path based on productType
    const getRedirectPath = (item) => {
        const type = item?.productType || '';
        const searchParam = `?search=${encodeURIComponent(item.name)}&code=${item.code}`;
        let basePath;
        switch (type.toLowerCase()) {
            case 'signature':
                basePath = `/signaturepizza/${item?.code}`;
                break;
            case 'other':
                basePath = `/otherpizza/${item?.code}`;
                break;
            case 'dips':
                basePath = `/dips${searchParam}`;
                break;
            case 'drinks':
                basePath = `/drinks${searchParam}`;
                break;
            case 'sides':
                basePath = `/sides${searchParam}`;
                break;
            default:
                basePath = '/menu';
        }
        return `${basePath}`;
    };

    return (
        <div className="search-dropdown shadow-lg rounded-3 overflow-hidden" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {results.map((item, index) => (
                <Link
                    key={`${item.code}-${index}`}
                    to={getRedirectPath(item)}
                    className="search-dropdown-item d-flex align-items-center p-3 text-decoration-none border-bottom"
                    onClick={() => onClose(item)}
                    style={{ transition: 'background-color 0.2s' }}
                >
                    <div className="search-item-image-wrapper me-3 flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-100 h-100 object-fit-cover rounded"
                        />
                    </div>
                    <div className="search-item-content flex-grow-1 min-width-0">
                        <div className="fw-bold text-dark text-truncate mb-0" style={{ fontSize: '0.95rem' }}>{item.name}</div>
                        <small className="text-muted text-truncate d-block" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{item.productType}</small>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchDropdown;