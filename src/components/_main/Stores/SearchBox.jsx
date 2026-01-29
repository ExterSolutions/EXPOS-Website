import React from "react";
import { useTheme } from '../../../context/ThemeContext';

function SearchBox({ searchQuery, setSearchQuery, onClear }) {
    const { colors } = useTheme();

    return (
        <div
            className="search-container mb-3 mt-1 rounded-5 overflow-hidden"
            style={{
                borderColor: colors.primary
            }}
        >
            <input
                type="text"
                placeholder="Search by store or city"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=""
            />
            <button
                className="clear-btn"
                onClick={onClear}
                style={{
                    color: colors.primary
                }}
            >
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
}

export default SearchBox;