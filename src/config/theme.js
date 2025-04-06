// Supported degree types - can be expanded in the future
export const DEGREES = {
  CS: 'cs',
  EE: 'ee',
  IE: 'ie', // Industrial Engineering
  // Future degrees can be added here, e.g.:
  // MATH: 'math',
  // PHYSICS: 'physics',
};

// Site Color Variables - organized by degree
export const COLORS = {
  // CS Colors
  [DEGREES.CS]: {
    primary: 'blue',
    primaryLight: 'sky',
    text: 'blue-950',
    textSecondary: 'text-blue-800',
    bgGradient: 'from-blue-50 to-white',
    buttonBg: 'bg-blue-700 hover:bg-blue-800',
    buttonBorder: 'border-blue-700',
    cardBorder: 'border-sky-200',
    icon: 'text-sky-600',
    hover: 'hover:bg-sky-50',
    hoverText: 'hover:text-sky-700',
    activeButton: 'bg-sky-600 text-white hover:bg-sky-700',
    inactiveButton: 'bg-white text-sky-600 border border-sky-600 hover:bg-sky-50',
    bannerBg: 'bg-blue-50',
    bannerBorder: 'border-blue-200',
    shadowGlow: 'rgba(37, 99, 235, 0.3)',
    shadowGlowHover: 'rgba(37, 99, 235, 0.5)',
    gradientBg: 'from-blue-700 via-blue-800 to-blue-700',
    linkColor: 'text-sky-600',
    linkHoverBg: 'hover:bg-sky-100',
    errorText: 'text-blue-800',
    headerBg: 'bg-blue-800',
    headerHover: 'hover:bg-blue-700',
    headerActive: 'active:bg-blue-600',
    displayName: 'מדעי המחשב'
  },
  // EE Colors
  [DEGREES.EE]: {
    primary: 'dark-purple',
    primaryLight: 'purple',
    text: 'text-purple-950',
    textSecondary: 'text-purple-800',
    bgGradient: 'from-purple-50 to-white',
    buttonBg: 'bg-purple-800 hover:bg-purple-900',
    buttonBorder: 'border-purple-800',
    cardBorder: 'border-purple-200',
    icon: 'text-purple-600',
    hover: 'hover:bg-purple-50',
    hoverText: 'hover:text-purple-700',
    activeButton: 'bg-purple-600 text-white hover:bg-purple-700',
    inactiveButton: 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50',
    bannerBg: 'bg-purple-50',
    bannerBorder: 'border-purple-200',
    shadowGlow: 'rgba(147, 51, 234, 0.3)',
    shadowGlowHover: 'rgba(147, 51, 234, 0.5)',
    gradientBg: 'from-purple-800 via-purple-950 to-purple-800',
    linkColor: 'text-purple-600',
    linkHoverBg: 'hover:bg-purple-100',
    errorText: 'text-purple-800',
    headerBg: 'bg-purple-800',
    headerHover: 'hover:bg-purple-700',
    headerActive: 'active:bg-purple-600',
    displayName: 'הנדסת חשמל'
  },
  // IE Colors - Industrial Engineering with orange theme
  [DEGREES.IE]: {
    primary: 'orange',
    primaryLight: 'amber',
    text: 'text-orange-950',
    textSecondary: 'text-orange-800',
    bgGradient: 'from-orange-50 to-white',
    buttonBg: 'bg-orange-600 hover:bg-orange-700',
    buttonBorder: 'border-orange-600',
    cardBorder: 'border-amber-300',
    icon: 'text-amber-600',
    hover: 'hover:bg-amber-50',
    hoverText: 'hover:text-orange-700',
    activeButton: 'bg-amber-600 text-white hover:bg-amber-700',
    inactiveButton: 'bg-white text-amber-600 border border-amber-600 hover:bg-amber-50',
    bannerBg: 'bg-orange-50',
    bannerBorder: 'border-orange-200',
    shadowGlow: 'rgba(234, 88, 12, 0.3)',
    shadowGlowHover: 'rgba(234, 88, 12, 0.5)',
    gradientBg: 'from-orange-600 via-orange-700 to-orange-600',
    linkColor: 'text-amber-600',
    linkHoverBg: 'hover:bg-amber-100',
    errorText: 'text-orange-800',
    headerBg: 'bg-orange-700',
    headerHover: 'hover:bg-orange-600',
    headerActive: 'active:bg-orange-500',
    displayName: 'הנדסת תעשייה וניהול'
  }
  // Add more degree themes here in the future
}; 