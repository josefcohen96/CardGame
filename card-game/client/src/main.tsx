import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { PlayerNameProvider } from './context/PlayerNameContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerNameProvider>
        <App />
      </PlayerNameProvider>
    </BrowserRouter>
  </React.StrictMode>
);
