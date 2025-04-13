const courseStyles = {
  cs: {
    buttonPrimary: 'bg-blue-800 text-white hover:bg-blue-700', // Reverted to original
    buttonSecondary: 'bg-white text-blue-800 hover:bg-blue-100',
    buttonThird: 'bg-white text-sky-600 hover:bg-sky-100',
    buttonMissing: 'bg-blue-800 text-white',
    bgGradient: 'from-blue-50 to-white', // Softer background
    textColor: 'text-blue-950', // Reverted to the previous color for dynamic text
    textSecondary: 'text-sky-600 hover: text-sky-700',
    cardBorder: 'border-blue-200',
    cardBorderStrong: 'border-blue-600',
    cardBg: 'from-blue-800 to-blue-700',
    iconColor: 'text-blue-600',
    iconColorReverse:'md bg-sky-600 hover:bg-sky-700 text-white',
    linksIconBg: 'bg-blue-50',
    linksIconColor: 'text-blue-600',
    bgLight: 'bg-blue-50',
    subjectBg: 'bg-blue-100',
    starColor: 'text-blue-400',
    TLBg: 'from-blue-800 via-blue-900 to-blue-800',
    shadowGlow: 'rgba(37, 99, 235, 0.3)',
    shadowGlowHover: 'rgba(37, 99, 235, 0.5)'
  },
  ee: {
    buttonPrimary: 'bg-purple-800 text-white hover:bg-purple-700 shadow-md', // Removed border, kept shadow
    buttonSecondary: 'bg-white text-purple-800 hover:bg-purple-100 shadow-md',
    buttonThird: 'bg-white text-purple-600 hover:bg-purple-100',
    buttonMissing: 'bg-purple-800 text-white',
    bgGradient: 'from-purple-50 to-white', // Softer background
    textColor: 'text-purple-950',
    textSecondary: 'text-purple-600 hover: text-purple-700',
    cardBorder: 'border-purple-200',
    cardBorderStrong: 'border-purple-600',
    cardBg: 'from-purple-800 to-purple-700',
    iconColor: 'text-purple-700',
    iconColorReverse:'md bg-purple-600 hover:bg-purple-700 text-white',
    linksIconBg: 'bg-purple-50',
    linksIconColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
    subjectBg: 'bg-purple-100',
    starColor: 'text-purple-400',
    TLBg: 'from-purple-800 via-purple-950 to-purple-800',
    shadowGlow: 'rgba(147, 51, 234, 0.3)',
    shadowGlowHover: 'rgba(147, 51, 234, 0.5)'
  },
  ie: {
    buttonPrimary: 'bg-orange-600 text-white hover:bg-orange-500 shadow-md', // Removed border, kept shadow
    buttonSecondary: 'bg-white text-orange-600 hover:bg-orange-100 shadow-md',
    buttonThird: 'bg-white text-orange-500 hover:bg-orange-100',
    buttonMissing: 'bg-orange-600 text-white',
    bgGradient: 'from-orange-50 to-white', // Softer background
    textColor: 'text-orange-900',
    textSecondary: 'text-orange-500 hover: text-orange-600',
    cardBorder: 'border-orange-200',
    cardBorderStrong: 'border-orange-600',
    cardBg: 'from-orange-600 to-orange-500',
    iconColor: 'text-orange-500',
    iconColorReverse:'md bg-orange-600 hover:bg-orange-700 text-white',
    linksIconBg: 'bg-orange-50',
    linksIconColor: 'text-orange-500',
    bgLight: 'bg-orange-50',
    subjectBg: 'bg-orange-100',
    starColor: 'text-orange-400',
    TLBg: 'from-orange-600 via-orange-700 to-orange-600',
    shadowGlow: 'rgba(234, 88, 12, 0.3)',
    shadowGlowHover: 'rgba(234, 88, 12, 0.5)'
  },
};

const courseTypeOptions = [
  { type: 'cs', label: 'מדעי המחשב' },
  { type: 'ee', label: 'הנדסת חשמל' },
  { type: 'ie', label: 'תעשייה וניהול' },
];

export { courseStyles, courseTypeOptions };