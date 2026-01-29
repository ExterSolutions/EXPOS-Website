import React from 'react'
import { CrustSelector } from './CrustSelector';
import { CrustTypeSelector } from './CrustTypeSelector';
import { CookSelector } from './CookSelector';
import { SpecialBasesSelector } from './SpecialBasesSelector';

function DoughSelector({ Ingredients, Crust, setCrust, CrustType, setCrustType, SpecialBases, setSpecialBases }) {
    return (
        <>
            {/* crust */}
            <div className="">
                <div className="fw-medium mb-1 text-secondary" style={{ fontSize: "0.9rem" }}>Crust</div>
                <div className="d-flex flex-wrap gap-2">
                    {Ingredients?.crust?.map((data, index) => {
                        return (
                            <CrustSelector data={data} Crust={Crust} handleCrust={(payload) => setCrust(payload)} />
                        );
                    })}
                </div>
            </div>

            {/* crust type */}
            <div className="mt-3">
                <div className="fw-medium mb-1 text-secondary" style={{ fontSize: "0.9rem" }}>Crust Type</div>
                <div className="d-flex flex-wrap gap-2">
                    {Ingredients?.crustType?.map((data, index) => {
                        return (
                            <CrustTypeSelector data={data} CrustType={CrustType} handleCrustType={(payload) => setCrustType(payload)} />
                        );
                    })}
                </div>

            </div>

            {/* cook */}
            <div className="mt-3">
                <div className="fw-medium mb-1 text-secondary" style={{ fontSize: "0.9rem" }}>Special Base</div>
                <div className="d-flex flex-wrap gap-2">
                    {Ingredients?.specialbases?.map((data, index) => {
                        return (
                            <SpecialBasesSelector data={data} SpecialBases={SpecialBases} handleSpecialBases={(payload) => setSpecialBases(payload)} />
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default DoughSelector