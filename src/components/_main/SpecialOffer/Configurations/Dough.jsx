import React from 'react'
import SpecialCrust from './Dough/Crust';
import SpecialCrustType from './Dough/CrustType';
import SpecialSpecialBases from './SpecialBases';

function SpecialDough({ count, pizzaState, setPizzaState, specialOfferData }) {
    return (
        <>
            <SpecialCrust count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} />
            <SpecialCrustType count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} />
            <SpecialSpecialBases count={count} pizzaState={pizzaState} setPizzaState={setPizzaState} specialOfferData={specialOfferData} />
        </>
    )
}

export default SpecialDough