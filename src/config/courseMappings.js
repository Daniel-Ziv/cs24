import { csYearOneCourses, csYearTwoCourses, csYearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses, choosingCourses, ieYearOneCourses, ieYearTwoCourses, ieYearThreeCourses, ieYearFourCourses } from './CoursesLinks';
import localData from './mockData.json';
export const courseMappings = {
  cs: {
    "שנה א'": csYearOneCourses,
    "שנה ב'": csYearTwoCourses,
    "שנה ג'": csYearThreeCourses,
    "בחירה": choosingCourses,
  },
  ee: {
    "שנה א'": eeYearOneCourses,
    "שנה ב'": eeYearTwoCourses,
    "שנה ג'": eeYearThreeCourses,
    "שנה ד'": eeYearFourCourses,
    "בחירה": choosingCourses,
  },
  ie: {
    "שנה א'": ieYearOneCourses,
    "שנה ב'": ieYearTwoCourses,
    "שנה ג'": ieYearThreeCourses,
    "שנה ד'": ieYearFourCourses,
    "בחירה": choosingCourses,
  },
};

export const specializationsMappings = {
  ee: [
    'בקרה',
    'ביו הנדסה',
    'תקשורת ועיבוד אותות',
    'אלקטרואופטיקה ומיקרואלקטרוניקה',
    'אנרגיה ומערכות הספק(זרם חזק)',
    'אנרגיות חלופיות ומערכות הספק משולב',
    'מערכות משובצות מחשב'
  ],
  cs: [],  // Empty array since CS doesn't have specializations
  ie: [
    'ניהול פרוייקטים',
    'ניהול טכנולוגיות מידע',
    'ניתוח נתוני עתק',
    'אבטחת מידע וסייבר',
  ]
};

export const jobChannelMappings = {
  cs: "secretjuniordevelopers",
  ee: "-1002263628689",
  ie: ""  // Empty channel for IE
};

export const tutorMappings = {
  cs: localData.csTutors || [],
  ee: localData.eeTutors || [],
  ie: localData.ieTutors || []
};