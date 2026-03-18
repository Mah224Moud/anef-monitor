/**
 * Formats an ISO date string into a French readable format.
 * @param {string} isoString - The ISO date string to format.
 * @param {boolean} short - Whether to use a short format (e.g. "11 avr. 2024").
 * @returns {string} - The formatted date.
 */
export const formatDate = (isoString, short = false, includeTime = false) => {
  if (!isoString) return "-";
  
  // Format raw YYYYMMDD string (e.g. "20190914" -> "2019-09-14")
  if (typeof isoString === 'string' && /^\d{8}$/.test(isoString)) {
    isoString = `${isoString.slice(0, 4)}-${isoString.slice(4, 6)}-${isoString.slice(6, 8)}`;
  }
  
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  const dateOptions = short 
    ? { day: 'numeric', month: 'short', year: 'numeric' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' };

  const formattedDate = new Intl.DateTimeFormat('fr-FR', dateOptions).format(date);

  if (includeTime) {
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const formattedTime = new Intl.DateTimeFormat('fr-FR', timeOptions).format(date);
    return `${formattedDate} à ${formattedTime}`;
  }

  return formattedDate;
};

/**
 * Calculates the number of days between now and a target date.
 * @param {string} isoString - The target ISO date string.
 * @returns {number} - Number of days.
 */
export const getDaysRemaining = (isoString) => {
  if (!isoString) return null;
  const targetDate = new Date(isoString);
  const now = new Date();
  const diffTime = targetDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Returns a human-readable relative time string (e.g., "Il y a 5 min", "Il y a 2 jours").
 * @param {string} isoString - The target ISO date string.
 * @returns {string} - The formatted relative time.
 */
export const getRelativeTime = (isoString) => {
  if (!isoString) return "—";
  
  const targetDate = new Date(isoString);
  if (isNaN(targetDate.getTime())) return isoString;

  const now = new Date();
  const diffInSeconds = Math.floor((now - targetDate) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `Il y a ${diffInMonths} mois`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
};
