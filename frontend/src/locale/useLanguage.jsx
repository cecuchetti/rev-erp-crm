import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectLang } from '@/redux/settings/selectors';
import languages from './translation/translation';

const useLanguage = () => {
  // Check URL parameters first (highest priority)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const forceSpanish = urlParams.get('forceSpanish');
  
  // Special handling for forceSpanish parameter
  if (forceSpanish === 'true') {
    localStorage.setItem('language', 'es_es');
    
    // Remove the parameter from URL to avoid repeating this on refresh
    if (window.history.replaceState) {
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    // Force reload once to make sure everything is refreshed with Spanish
    if (!sessionStorage.getItem('spanishForceApplied')) {
      sessionStorage.setItem('spanishForceApplied', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      sessionStorage.removeItem('spanishForceApplied');
    }
  }
  
  // If URL has a lang parameter, immediately set it in localStorage
  else if (urlLang && languages[urlLang]) {
    localStorage.setItem('language', urlLang);
    // Remove the parameter from URL to avoid repeating this on refresh
    if (window.history.replaceState) {
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }
  
  // Obtener el idioma de Redux - este viene de la configuración de la aplicación
  const langRdx = useSelector(selectLang);
  
  // Español como idioma predeterminado
  const defaultLang = 'es_es';
  
  // Inicializar - dar prioridad a URL params, luego localStorage, luego Redux, finalmente el valor predeterminado
  const storedLang = localStorage.getItem('language');
  
  // Determinar el idioma actual basado en las prioridades - IMPORTANT: localStorage takes precedence over Redux
  const initialLang = forceSpanish ? 'es_es' : (urlLang || storedLang || langRdx || defaultLang);
  
  // Guardar en localStorage para persistencia entre recargas
  if (initialLang) {
    localStorage.setItem('language', initialLang);
  }
  
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[initialLang] || languages[defaultLang]);

  // Efecto para manejar cambios directos en localStorage (cambios de idioma inmediatos)
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('language');
      
      if (newLang && newLang !== currentLang) {
        console.log("[DEBUG] Applying language change from storage event:", newLang);
        const languageFile = languages[newLang];
        
        if (languageFile) {
          setSelectedLanguage(languageFile);
          setCurrentLang(newLang);
          document.documentElement.lang = newLang.toLowerCase().slice(0, 2);
        }
      }
    };

    // Escuchar cambios en localStorage desde otras pestañas
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLang]);

  const translate = (key) => {
    if (typeof key !== 'string' || !key) {
      return '';
    }

    const lowerCaseKey = key.toLowerCase().replace(/[\s-]/g, '_');

    // Primero intentar con el idioma actual
    if (selectedLanguage && selectedLanguage[lowerCaseKey] !== undefined) {
      return selectedLanguage[lowerCaseKey];
    }
    
    // Fallback al inglés
    if (languages.en_us && languages.en_us[lowerCaseKey] !== undefined) {
      return languages.en_us[lowerCaseKey];
    }

    // Último recurso: formatear la clave como texto legible
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Para compatibilidad con código existente
  translate.lang = currentLang;
  
  // Permitir desestructuración
  Object.defineProperty(translate, 'translate', {
    value: translate
  });

  return translate;
};

export default useLanguage;
