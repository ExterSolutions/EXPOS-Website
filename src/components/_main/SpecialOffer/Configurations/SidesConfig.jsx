import React from "react";
import SidesSelector from "../Selector/SidesSelector";

function SidesConfig({
  Sides,
  setSides,
  specialOfferData,
  activeAccordion,
  toggleAccordion,
}) {
  const accordionId = `side-accordion`;
  const headerId = `side-header`;
  const collapseId = `side-collapse`;

  const handleSides = (code) => {
    const selected = specialOfferData?.freesides?.find(
      (side) => side?.code === code,
    );
    if (selected) {
      const payload = {
        sideCode: selected?.code,
        sideName: selected?.sideName,
        sideType: selected?.type,
        lineCode: selected?.lineEntries[0]?.code,
        sidePrice: selected?.lineEntries[0]?.price,
        sideSize: selected?.lineEntries[0]?.size,
        quantity: 1,
        totalPrice: Number(0.0).toFixed(2),
      };
      setSides([payload]);
    }
  };

  return (
    <div className="mb-3 mt-3">
      <div className="accordion mb-3" id={accordionId}>
        <div className="accordion-item">
          <h2 className="accordion-header" id={headerId}>
            <button
              className={`accordion-button fw-bold ${activeAccordion === "sides" ? "text-white" : "collapsed text-dark"} `}
              type="button"
              onClick={() => toggleAccordion("sides")}
              aria-expanded={activeAccordion === "sides" ? "true" : "false"}
              aria-controls={collapseId}
            >
              Choose Your Side
            </button>
          </h2>

          <div
            id={collapseId}
            className={`accordion-collapse collapse ${activeAccordion === "sides" ? "show" : ""}`}
            aria-labelledby={headerId}
            data-bs-parent={`#${accordionId}`}
          >
            <div className="accordion-body">
              <div className="d-flex flex-column gap-3">
                {specialOfferData?.freesides?.map((data, index) => (
                  <SidesSelector
                    key={`${index}-${data?.code}`}
                    Sides={Sides[0]}
                    data={data}
                    handleSides={handleSides}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidesConfig;
