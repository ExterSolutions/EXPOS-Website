// src/TestAllProviders.jsx
import React from 'react';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {GlobalContext} from './context/GlobalContext';

const TestAllProviders = () => {
    // Test React Router
    let routerWorks = false;
    try {
        useNavigate();
        routerWorks = true;
    } catch (e) {
        routerWorks = false;
    }
    
    // Test Redux
    let reduxWorks = false;
    try {
        useSelector(state => state);
        reduxWorks = true;
    } catch (e) {
        reduxWorks = false;
    }
    
    // Test Global Context
    const globalCtx = useContext(GlobalContext);
    const contextWorks = !!globalCtx;
    
    return (
        <div style={{
            padding: '20px',
            margin: '10px',
            background: '#f0f0f0',
            border: '1px solid #ccc'
        }}>
            <h4>Provider Status:</h4>
            <div style={{color: routerWorks ? 'green' : 'red'}}>
                {routerWorks ? '✅ React Router' : '❌ React Router'}
            </div>
            <div style={{color: reduxWorks ? 'green' : 'red'}}>
                {reduxWorks ? '✅ Redux' : '❌ Redux'}
            </div>
            <div style={{color: contextWorks ? 'green' : 'red'}}>
                {contextWorks ? '✅ Global Context' : '❌ Global Context'}
            </div>
        </div>
    );
};

export default TestAllProviders;