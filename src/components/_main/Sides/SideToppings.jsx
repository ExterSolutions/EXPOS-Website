import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { toast } from "react-toastify";

function SideToppings({ tps, data, selectedTps, setSelectedTps }) {
  const [maxLimitExceeded, setMaxLimitExceeded] = useState(false);

  // handle toppings checkbox
  const handleCheckbox = (e) => {
    if (e.target.checked === true) {
      const filteredData = data?.sidesToppings.find(
        (item) => item.code === e.target.value
      );
      setSelectedTps([filteredData, ...selectedTps]);
    } else {
      const filteredData = selectedTps.filter(
        (item) => item.code !== e.target.value
      );
      setSelectedTps(filteredData);
    }
  };

  useEffect(() => {
    if (selectedTps.length >= data.nooftoppings) {
      setMaxLimitExceeded(true);
    } else {
      setMaxLimitExceeded(false);
    }
  }, [selectedTps]);

  return (
    <Col xs={12} md={6} lg={6} key={tps.code} className="pb-3 selectedToppings">
      <input
        id={`${tps.code}_toppings`}
        className="m-0 me-3 form-check-input tpsCheckbox"
        type="checkbox"
        value={tps.code}
        onChange={(e) => {
          handleCheckbox(e);
        }}
        disabled={maxLimitExceeded && !selectedTps.includes(tps) ? true : false}
      />
      <label
        htmlFor={`${tps.code}_toppings`}
        className="form-check-label tpsCheckboxLabel"
      >
        {tps.toppingsName}
      </label>
    </Col>
  );
}

export default SideToppings;
