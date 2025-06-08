import { createRoot } from 'react-dom/client';

import RootApp from './RootApp';

// Check URL for any language forcing
const urlParams = new URLSearchParams(window.location.search);
const forceSpanish = urlParams.get('forceSpanish');

if (forceSpanish === 'true') {
  window.localStorage.setItem('language', 'es_es');
}

// Only set default language if none exists
const lang = window.localStorage.getItem('language');
if (!lang) {
  window.localStorage.setItem('language', 'es_es');
}

const root = createRoot(document.getElementById('root'));
root.render(<RootApp />);
