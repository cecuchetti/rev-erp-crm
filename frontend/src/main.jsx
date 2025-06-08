import { createRoot } from 'react-dom/client';

import RootApp from './RootApp';

// Check URL for any language forcing
const urlParams = new URLSearchParams(window.location.search);
const forceSpanish = urlParams.get('forceSpanish');

if (forceSpanish === 'true') {
  console.log("[MAIN] Force Spanish parameter detected on startup");
  window.localStorage.setItem('language', 'es_es');
}

// Only set default language if none exists
const lang = window.localStorage.getItem('language');
if (!lang) {
  console.log("[MAIN] No language in localStorage, setting default es_es");
  window.localStorage.setItem('language', 'es_es');
}

// Log current language for debugging
console.log("[MAIN] Current language at startup:", window.localStorage.getItem('language'));

const root = createRoot(document.getElementById('root'));
root.render(<RootApp />);
