// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalProvider } from './context/GlobalContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './redux/store';
import App from './App';
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/style.css";
// import "./assets/styles/colors.css";
// import "./assets/styles/custom.css";
// import "./assets/styles/responsive.css";
// import "./assets/styles/main-item-card.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Provider store={store}>
          <HelmetProvider>
            <ThemeProvider>
              <GlobalProvider>
                <App />
              </GlobalProvider>
            </ThemeProvider>
          </HelmetProvider>
        </Provider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);