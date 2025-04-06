// Course configuration for all degrees
export const COURSE_CONFIG = {
  cs: {
    name: 'מדעי המחשב',
    years: ['שנה א', 'שנה ב', 'שנה ג'],
    courses: {
      'שנה א': [
        { id: 'cs101', name: 'מבוא למדעי המחשב' },
        { id: 'cs102', name: 'מבני נתונים' },
        // ... other first year courses
      ],
      'שנה ב': [
        { id: 'cs201', name: 'אלגוריתמים 1' },
        { id: 'cs202', name: 'מערכות הפעלה' },
        // ... other second year courses
      ],
      'שנה ג': [
        { id: 'cs301', name: 'קומפילציה' },
        { id: 'cs302', name: 'אבטחת מידע' },
        // ... other third year courses
      ]
    }
  },
  ee: {
    name: 'הנדסת חשמל',
    years: ['שנה א', 'שנה ב', 'שנה ג', 'שנה ד'],
    specializations: [
      'בקרה',
      'ביו הנדסה',
      'תקשורת ועיבוד אותות',
      'אלקטרואופטיקה ומיקרואלקטרוניקה',
      'אנרגיה ומערכות הספק(זרם חזק)',
      'אנרגיות חלופיות ומערכות הספק משולב',
      'מערכות משובצות מחשב'
    ],
    courses: {
      'שנה א': [
        { id: 'ee101', name: 'מבוא להנדסת חשמל' },
        // ... other first year courses
      ],
      'שנה ב': [
        { id: 'ee201', name: 'אותות ומערכות' },
        // ... other second year courses
      ],
      'שנה ג': [
        { 
          id: 'ee301', 
          name: 'בקרה לינארית', 
          specializations: ['בקרה']
        },
        // ... other third year courses with specializations
      ],
      'שנה ד': [
        {
          id: 'ee401',
          name: 'רובוטיקה',
          specializations: ['בקרה', 'מערכות משובצות מחשב']
        },
        // ... other fourth year courses with specializations
      ]
    }
  },
  ie: {
    name: 'הנדסת תעשייה וניהול',
    years: ['שנה א', 'שנה ב', 'שנה ג', 'שנה ד'],
    specializations: [
      'ניהול פרויקטים',
      'הנדסת איכות',
      'אבטחת איכות',
      'הנדסת גורמי אנוש',
      'ניהול התפעול',
      'ניהול משאבי אנוש'
    ],
    courses: {
      'שנה א': [
        { id: 'ie101', name: 'מבוא להנדסת תעשייה' },
        { id: 'ie102', name: 'סטטיסטיקה' },
        // ... other first year courses
      ],
      'שנה ב': [
        { id: 'ie201', name: 'חקר עבודה' },
        { id: 'ie202', name: 'מערכות ייצור' },
        // ... other second year courses
      ],
      'שנה ג': [
        {
          id: 'ie301',
          name: 'ניהול פרויקטים מתקדם',
          specializations: ['ניהול פרויקטים']
        },
        // ... other third year courses with specializations
      ],
      'שנה ד': [
        {
          id: 'ie401',
          name: 'הנדסת איכות מתקדמת',
          specializations: ['הנדסת איכות', 'אבטחת איכות']
        },
        // ... other fourth year courses with specializations
      ]
    }
  }
}; 