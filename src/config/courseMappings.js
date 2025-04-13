import { csYearOneCourses, csYearTwoCourses, csYearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses, choosingCourses, ieYearOneCourses, ieYearTwoCourses, ieYearThreeCourses, ieYearFourCourses } from './CoursesLinks';
import localData from './mockData.json';
export const courseMappings = {
  cs: {
    "שנה א'": csYearOneCourses,
    "שנה ב'": csYearTwoCourses,
    "שנה ג'": csYearThreeCourses,
    "רב-תחומי": choosingCourses,
  },
  ee: {
    "שנה א'": eeYearOneCourses,
    "שנה ב'": eeYearTwoCourses,
    "שנה ג'": eeYearThreeCourses,
    "שנה ד'": eeYearFourCourses,
    "רב-תחומי": choosingCourses,
  },  
  ie: {
    "שנה א'": ieYearOneCourses,
    "שנה ב'": ieYearTwoCourses,
    "שנה ג'": ieYearThreeCourses,
    "שנה ד'": ieYearFourCourses,
    "רב-תחומי": choosingCourses,
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
  ie: "-1002436082202"
};

export const tutorMappings = {
  cs: localData.csTutors || [],
  ee: localData.eeTutors || [],
  ie: localData.ieTutors || []
};

export const csHelpfulLinks = [
  { 
    title: "דרייב האגודה",
    description: "מערכת הקורסים של המכון",
    url: "https://drive.google.com/drive/folders/1ITwPTm_Jv3w-nVT7PpE2HViDn56W_VWN"
  },
  { 
    title: "האתר של קנציפר",
    description: "כל החומר של הסתברות מהאתר הרשמי של ראש הקורס",
    url: "https://eugenekanzieper.faculty.hit.ac.il/probability.html"
  },
  /*{
    title: "cs20",
    description: "דרייב ישן יותר של מבחנים",
    url: "https://drive.google.com/drive/u/1/folders/1Mmh1MW_zwNyqhNDB1gtkeklA4w_kHV5V"
  },*/
  {
    title: "חומרים בטלגרם",
    description: "יש גם בוט בנוסף: @Hithelpbot (לא קשור לאתר)" ,
    url: "https://t.me/+1afwRPetXHA0NGFk"
  },
  {
    title: "הדרייב של ליז",
    description: "מומלץ להעזר בה, המון המון שיטות וחומרים",
    url: "https://drive.google.com/drive/folders/1amxc9ZpT5xzNFdFeYSndfhn32GlebnvG"
  },
  { 
    title: "הדרייב של אלעד עטייא",
    description: "למי שרוצה לעשות ארגזים בהייטקס",
    url: "https://drive.google.com/drive/u/0/folders/1EOpfuGEXp-hCD_DCBYerJiXP-YIrIfnB"
  },
  {
    title: "הדרייב של נועה ארליכמן",
    description: "סיכומים ברמה בינלאומית",
    url: "https://drive.google.com/drive/folders/1s1BBsq2UwPZDvdnMSgYlNuuzXpRThx2m"
  }
  
]

export const eeHelpfulLinks = [
  { 
    title: "הדרייב של ברי",
    description: "אוסף חומרים של תואר ראשון + שני + אנגלית",
    url: "https://hitacil-my.sharepoint.com/:f:/g/personal/barucha_my_hit_ac_il/EqjpWXqEQuJDrM9DEFdaWJEBjRCI-d2RyvXBUvd63fpVyA?e=A0f7V2"
  },
  { 
    title: "המחברת של קטיה",
    description: "מחברת עם מבחנים + סיכומים מצויינים",
    url: "https://drive.google.com/drive/folders/1eXdhutwMxoDq44mqden7XX1XzELHcDMA?usp=drive_link"
  },
  { 
    title: "דרייב האגודה",
    description: "מערכת הקורסים של המכון",
    url: "https://drive.google.com/drive/folders/1TgEOORibOMMwWAyg7u5KGvORPMr-ZiHH"
  },
  {
    title: "הדרייב של אלעד עטייא",
    description: "למי שרוצה לעשות ארגזים בהייטקס",
    url: "https://drive.google.com/drive/u/0/folders/1EOpfuGEXp-hCD_DCBYerJiXP-YIrIfnB"
  },
  {
    title: "הדרייב של ליז",
    description: "מומלץ להעזר בה, המון המון שיטות וחומרים",
    url: "https://drive.google.com/drive/folders/1amxc9ZpT5xzNFdFeYSndfhn32GlebnvG"
  },
  {
    title: "הדרייב המטורף של יצחקי",
    description: "דרייב מוכר ומומלץ",
    url: "https://drive.google.com/drive/folders/1k1v7NmfMWPUfA39JKskv0ID6X9udL7xT"
  },
]