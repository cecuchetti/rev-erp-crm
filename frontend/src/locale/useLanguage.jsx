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
    console.log("[DEBUG] Force Spanish parameter detected!");
    localStorage.setItem('language', 'es_es');
    
    // Remove the parameter from URL to avoid repeating this on refresh
    if (window.history.replaceState) {
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    // Force reload once to make sure everything is refreshed with Spanish
    if (!sessionStorage.getItem('spanishForceApplied')) {
      sessionStorage.setItem('spanishForceApplied', 'true');
      console.log("[DEBUG] Applying forced Spanish refresh");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      sessionStorage.removeItem('spanishForceApplied');
    }
  }
  
  // If URL has a lang parameter, immediately set it in localStorage
  else if (urlLang && languages[urlLang]) {
    console.log("[DEBUG] Found language in URL params:", urlLang);
    localStorage.setItem('language', urlLang);
    // Remove the parameter from URL to avoid repeating this on refresh
    if (window.history.replaceState) {
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }
  
  // Obtener el idioma de Redux - este viene de la configuración de la aplicación
  const langRdx = useSelector(selectLang);
  console.log("[DEBUG] langRdx from Redux:", langRdx);
  
  // Español como idioma predeterminado
  const defaultLang = 'es_es';
  
  // Inicializar - dar prioridad a URL params, luego localStorage, luego Redux, finalmente el valor predeterminado
  const storedLang = localStorage.getItem('language');
  console.log("[DEBUG] storedLang from localStorage:", storedLang);
  
  // Determinar el idioma actual basado en las prioridades - IMPORTANT: localStorage takes precedence over Redux
  const initialLang = forceSpanish ? 'es_es' : (urlLang || storedLang || langRdx || defaultLang);
  console.log("[DEBUG] initialLang determined:", initialLang);
  
  // Guardar en localStorage para persistencia entre recargas
  if (initialLang) {
    localStorage.setItem('language', initialLang);
  }
  
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[initialLang] || languages[defaultLang]);

  // Efecto para manejar cambios de idioma en tiempo real desde Redux
  // DISABLED: This effect was causing the language to revert back to English
  // useEffect(() => {
  //   console.log("[DEBUG] useEffect triggered, langRdx:", langRdx);
    
  //   // Si hay un cambio en Redux (desde la configuración de la aplicación)
  //   if (langRdx && langRdx !== currentLang) {
  //     console.log("[DEBUG] Language changed in Redux to:", langRdx);
      
  //     const languageFile = languages[langRdx];
      
  //     if (languageFile) {
  //       setSelectedLanguage(languageFile);
  //       setCurrentLang(langRdx);
  //       document.documentElement.lang = langRdx.toLowerCase().slice(0, 2);
  //       localStorage.setItem('language', langRdx);
  //       console.log("[DEBUG] Language updated to:", langRdx);
  //     }
  //   }
  // }, [langRdx, currentLang]);

  // Efecto para manejar cambios directos en localStorage (cambios de idioma inmediatos)
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('language');
      console.log("[DEBUG] Storage event detected, new language:", newLang);
      
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
