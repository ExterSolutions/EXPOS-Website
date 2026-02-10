import React, { useContext, useEffect, useState } from 'react';
import '../../assets/styles/locationaccess.css';
import { LuBike } from 'react-icons/lu';
import { FaPeopleCarry } from 'react-icons/fa';
import LocationAccessContent from './LocationAccessContent';
import {GlobalContext} from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

function LocationAccess({ signaturePizzaRef, isdemo }) {
    const [currentTab, setCurrentTab] = useState('delivery');
    const globalCtx = useContext(GlobalContext);
    const [selectedType, setSelectedType] = globalCtx.selectedType;
    const navigate = useNavigate();

    const handleTabChange = (tabName) => {
        setCurrentTab(tabName);
        setSelectedType(tabName);
        localStorage.setItem('selectedType', tabName);
    };
    const handleViewMenu = () => {
        navigate('/menu');
    }

    useEffect(() => {
        if (selectedType) {
            setCurrentTab(selectedType);
        }
    }, [selectedType]);

    return (
        <>
            <div className="section">
                <div className={isdemo ? "container-fluid" : 'container'}>
                    <div className='col-12'>
                        <div className='locationAccess card border rounded-4 overflow-hidden'>
                            <div className="block-inner ">
                                <div className='position-relative'>
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li className="nav-item " role="presentation">
                                            <a
                                                className={`rounded-start-5 nav-link ${currentTab === 'delivery' ? 'active' : ''}`}
                                                id="delivery-tab-0"
                                                data-bs-toggle="tab"
                                                href="#delivery-tabpanel-0"
                                                role="tab"
                                                aria-controls="delivery-tabpanel-0"
                                                aria-selected={currentTab === 'delivery'}
                                                onClick={() => handleTabChange('delivery')} // Update state on click
                                            >
                                                <LuBike /> Delivery
                                            </a>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <a
                                                className={`rounded-end-5 nav-link ${currentTab === 'pickup' ? 'active' : ''}`}
                                                id="pickup-tab-1"
                                                data-bs-toggle="tab"
                                                href="#pickup-tabpanel-1"
                                                role="tab"
                                                aria-controls="pickup-tabpanel-1"
                                                aria-selected={currentTab === 'pickup'}
                                                onClick={() => handleTabChange('pickup')} // Update state on click
                                            >
                                                <FaPeopleCarry /> Pickup
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content pt-3" id="tab-content">
                                        <LocationAccessContent currentTab={currentTab} signaturePizzaRef={signaturePizzaRef} /> {/* Pass the current tab as a prop */}
                                    </div>
                                    <div className='d-flex justify-content-end align-content-center'>
                                        <button className='btn btn-sm viewMenuBtn ' onClick={handleViewMenu}>VIEW MENU</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LocationAccess;
