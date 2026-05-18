import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ClanProvider} from './context/ClanContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClanProvider>
      <App />
    </ClanProvider>
  </StrictMode>,
);
