/**
 * Format a number as currency
 * @param {number} value - The numeric value to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - The locale to use for formatting (default: en-US)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === undefined || value === null) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback formatting if Intl is not supported or currency is invalid
    return `${currency} ${Number(value).toFixed(2)}`;
  }
};

/**
 * Format a number as currency without the currency symbol
 * @param {number} value - The numeric value to format
 * @param {string} locale - The locale to use for formatting (default: en-US)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, locale = 'en-US') => {
  if (value === undefined || value === null) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback formatting
    return Number(value).toFixed(2);
  }
}; 