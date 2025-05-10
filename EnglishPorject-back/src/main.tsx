import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './phone-input.css';
import './input-styles.css'; 
// Detectar idioma del navegador y establecer idioma base
const userLang = navigator.language.startsWith('es') ? 'es' : 'en';
localStorage.setItem('preferredLang', userLang); // Guardar preferencia en localStorage
// Importar los nuevos estilos para inputs

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
