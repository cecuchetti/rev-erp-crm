const languages = require('./translation/translation');

const getLabel = (key, langCode) => {
  const lang = languages[langCode] || languages['en_us']; // Default to English if language not found

  try {
    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    if (lang && lang[lowerCaseKey]) {
      return lang[lowerCaseKey];
    }

    // If no translation is found, format the key as a fallback label
    const remove_underscore_fromKey = key.replace(/_/g, ' ').split(' ');
    const label = remove_underscore_fromKey
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return label;
  } catch (error) {
    console.error('Error getting label for key:', key, error);
    return key; // Return the key itself as a last resort
  }
};

const useLanguage = (langCode = 'en_us') => {
  return {
    translate: (key) => getLabel(key, langCode),
  };
};

module.exports = useLanguage; 