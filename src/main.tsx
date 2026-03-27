import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import i18n from './i18n';
import { AppLoader } from './components/public/AppLoader';
import './styles/global.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AppLoader>
          <App />
        </AppLoader>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
);
