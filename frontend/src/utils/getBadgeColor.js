/**
 * Returns Tailwind color classes based on nature_titre.
 * @param {string} nature - The permit nature (CSP, CST, VLS-TS).
 * @returns {object} - Color configuration with classes
 */
export const getBadgeStyles = (nature) => {
  const n = nature?.toUpperCase();
  if (n === 'CSP') return {
    bg: 'bg-blue-500/20',
    text: 'text-blue-600',
    border: 'border-blue-200/50',
    glow: 'shadow-blue-500/20'
  };
  if (n === 'CST') return {
    bg: 'bg-amber-500/20',
    text: 'text-amber-600',
    border: 'border-amber-200/50',
    glow: 'shadow-amber-500/20'
  };
  if (n === 'VLS-TS') return {
    bg: 'bg-slate-500/20',
    text: 'text-slate-600',
    border: 'border-slate-200/50',
    glow: 'shadow-slate-500/20'
  };
  return {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-600',
    border: 'border-indigo-200/50',
    glow: 'shadow-indigo-500/20'
  };
};

/**
 * Returns premium color configuration based on expiration days.
 * @param {number} days - Days remaining.
 * @returns {object} - Color configuration
 */
export const getExpirationStyles = (days) => {
  if (days < 0) return { color: 'failure', text: 'Expiré', bg: 'bg-rose-500', iconColor: 'text-rose-500' };
  if (days < 30) return { color: 'failure', text: `Expire dans ${days}j`, bg: 'bg-rose-500', iconColor: 'text-rose-500' };
  if (days < 90) return { color: 'warning', text: `Expire dans ${days}j`, bg: 'bg-amber-500', iconColor: 'text-amber-500' };
  return { color: 'success', text: `Valide (${days}j)`, bg: 'bg-emerald-500', iconColor: 'text-emerald-500' };
};
