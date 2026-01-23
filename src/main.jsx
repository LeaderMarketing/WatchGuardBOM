import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { QuoteProvider } from './context/QuoteContext.jsx';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuoteProvider>
      <App />
    </QuoteProvider>
  </React.StrictMode>
);
