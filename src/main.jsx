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
import { HelmetProvider } from 'react-helmet-async';
import { SiteDataProvider } from './context/SiteDataContext';

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