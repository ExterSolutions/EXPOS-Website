// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { GlobalProvider } from './context/GlobalContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';
import './assets/styles/typography-modern.css';
import { HelmetProvider } from 'react-helmet-async';
import { SiteDataProvider } from './context/SiteDataContext';

// Normalize accidental double slashes in pathname (e.g. https://brampton.exter.ca//payment/success)
// before BrowserRouter mounts so React Router matches /payment/success cleanly.
if (typeof window !== 'undefined' && /^\/{2,}/.test(window.location.pathname)) {
  const cleanPath = window.location.pathname.replace(/\/+/g, '/');
  window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <SiteDataProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GlobalProvider>
              <ThemeProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </ThemeProvider>
            </GlobalProvider>
          </PersistGate>
        </Provider>
      </SiteDataProvider>
    </HelmetProvider>
  </React.StrictMode>
);