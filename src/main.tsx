import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClanProvider } from './context/ClanContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClanProvider>
      <App />
    </ClanProvider>
  </StrictMode>,
);
