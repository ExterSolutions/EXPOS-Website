import React from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

function DrinksSelector({ data, Drinks, handleDrinks }) {
    const isSelected = Drinks?.drinksCode === data?.code;

    const handleClick = () => {
        handleDrinks(data.code);
    };

    return (
        <div
            className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-2"
            style={{
                cursor: "pointer",
                border: `2px solid ${isSelected ? "var(--primary, #2d7a2d)" : "#e0e0e0"}`,
                background: isSelected ? "rgba(45,122,45,0.05)" : "#fff",
                transition: "border 0.2s ease, background 0.2s ease",
            }}
            onClick={handleClick}
        >
            <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex justify-content-center align-items-center"
                  style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isSelected ? "var(--primary, #2d7a2d)" : "#ccc"}`,
                      background: isSelected ? "var(--primary, #2d7a2d)" : "transparent",
                      transition: "all 0.2s ease"
                  }}
                >
                    {isSelected && <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#fff'}} />}
                </div>
                <div>
                    <div className="fw-semibold" style={{ fontSize: "0.92rem", color: "#1a1a1a" }}>
                        {data?.softDrinkName}
                    </div>
                </div>
            </div>
            
            <div style={{ fontSize: "0.78rem", color: "var(--primary, #2d7a2d)", fontWeight: 700, letterSpacing: "0.03em" }}>
                FREE
            </div>
        </div>
    );
}

export default DrinksSelector