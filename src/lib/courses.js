const courses = [
  // סמסטר 1
  { name: "מבוא למדעי המחשב", points: 5.0, semesterNumber: 1, prerequisites: [] },
  { name: "מבוא למערכות מחשב", points: 4.0, semesterNumber: 1, prerequisites: [] },
  { name: "מתמטיקה בדידה 1", points: 4.0, semesterNumber: 1, prerequisites: [] },
  { name: "אלגברה ליניארית", points: 5.0, semesterNumber: 1, prerequisites: [] },

  // סמסטר 2
  { name: "מבני נתונים", points: 4.0, semesterNumber: 2, prerequisites: ["מבוא למדעי המחשב"] },
  { name: "תכנות מונחה עצמים", points: 5.0, semesterNumber: 2, prerequisites: ["מבוא למדעי המחשב"] },
  { name: "סדנה מתקדמת בתכנות", points: 3.0, semesterNumber: 2, prerequisites: ["מבוא למדעי המחשב"] },
  { name: "מתמטיקה בדידה 2", points: 3.0, semesterNumber: 2, prerequisites: ["מתמטיקה בדידה 1"] },
  { name: "חשבון אינפי 1", points: 6.5, semesterNumber: 2, prerequisites: [] },

  // סמסטר 3
  { name: "אלגוריתמים 1", points: 4.0, semesterNumber: 3, prerequisites: ["מתמטיקה בדידה 2", "מבני נתונים"] },
  { name: "מבוא למדעי הנתונים", points: 3.5, semesterNumber: 3, prerequisites: ["מבני נתונים"] },
  { name: "רשתות תקשורת מחשבים", points: 3.5, semesterNumber: 3, prerequisites: ["מבוא למערכות מחשב"] },
  { name: "אלגברה 2", points: 4.0, semesterNumber: 3, prerequisites: ["אלגברה ליניארית"] },
  { name: "חשבון אינפי 2", points: 4.0, semesterNumber: 3, prerequisites: ["חשבון אינפי 1"] },
  { name: "הסתברות", points: 3.5, semesterNumber: 3, prerequisites: ["חשבון אינפי 1"] },

  // סמסטר 4
  { name: "מערכות הפעלה", points: 3.5, semesterNumber: 4, prerequisites: ["מבני נתונים", "מבוא למערכות מחשב"] },
  { name: "מערכות בסיסי נתונים", points: 4.0, semesterNumber: 4, prerequisites: ["מבני נתונים", "סדנה מתקדמת בתכנות"] },
  { name: "אלגוריתמים 2", points: 4.0, semesterNumber: 4, prerequisites: ["אלגוריתמים 1", "אלגברה ליניארית"] },
  { name: "למידת מכונה", points: 4.0, semesterNumber: 4, prerequisites: ["הסתברות", "מתמטיקה בדידה 1", "חשבון אינפי 2", "אלגברה ליניארית", "מבני נתונים", "מבוא למדעי הנתונים"] },
  { name: "הנדסת תוכנה", points: 4.0, semesterNumber: 4, prerequisites: ["תכנות מונחה עצמים"] },

  // סמסטר 5
  { name: "אוטומטים ושפות פורמליות", points: 4.0, semesterNumber: 5, prerequisites: ["מתמטיקה בדידה 1", "אלגוריתמים 2"] },
  { name: "בחירה 1", points: 3.0, semesterNumber: 5, prerequisites: [] },
  { name: "בחירה 2", points: 3.0, semesterNumber: 5, prerequisites: [] },
  { name: "בחירה 3", points: 3.0, semesterNumber: 5, prerequisites: [] },

  // סמסטר 6
  { name: "חישוביות וסיבוכיות", points: 4.0, semesterNumber: 6, prerequisites: ["אוטומטים ושפות פורמליות", "אלגוריתמים 1"] },
  { name: "בחירה 4", points: 3.0, semesterNumber: 6, prerequisites: [] },
  { name: "בחירה 5", points: 3.0, semesterNumber: 6, prerequisites: [] },
  { name: "בחירה 6", points: 3.0, semesterNumber: 6, prerequisites: [] },
  

  // גמיש
  { name: "יזמות", points: 2.0, semesterNumber: 0, prerequisites: [] },
  { name: "לימודים רב תחומיים ג'", points: 2.0, semesterNumber: 0, prerequisites: [] },
  { name: "לימודים רב תחומיים ד'", points: 2.0, semesterNumber: 0, prerequisites: [] },
];

export default courses;
