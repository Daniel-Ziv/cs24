import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const yearOneCourses = [
    { id: 1, name: "תכנות מונחה עצמים", driveLink: "https://drive.google.com/drive/folders/1DfI4EwDUx4pNjWIeQz0SU_TITPy4PBMn?usp=drive_link" },
    { id: 2, name: "סדנה מתקדמת בתכנות", driveLink: "https://drive.google.com/drive/folders/1gW2LE8jD_Yhb9BNzdS583aonXdSGpOk_?usp=drive_link" },
    { id: 3, name: "מבני נתונים", driveLink: "https://drive.google.com/drive/folders/17Sv6VSK3HgaofeZ7Tl-FB3SbzLeoeCuU?usp=drive_link" },
    { id: 4, name: "מבוא למערכות מחשב", driveLink: "https://drive.google.com/drive/folders/19tlwYTe4Zllp8onApPhIi_4LKA72g1rp?usp=drive_link" },
    { id: 5, name: "מבוא למדעי המחשב", driveLink: "https://drive.google.com/drive/folders/1Cy-yEGmXx4u0PA2ejUZxQ33-pBzBQ6xn?usp=drive_link" },
    { id: 6, name: "בדידה 2", driveLink: "https://drive.google.com/drive/folders/1NquaLProAL_ewrNRx9ZJy13ysWBpQyLH?usp=drive_link" },
    { id: 7, name: "בדידה 1", driveLink: "https://drive.google.com/drive/folders/1XdBYqhLtbtflQU3fp-XlmEL9ajt9Hh1g?usp=drive_link" },
    { id: 8, name: "אלגברה לינארית 1", driveLink: "https://drive.google.com/drive/folders/1jP8H6qmem2HtKChLG7mUg6lQ0C1hcojW?usp=drive_link" },
    { id: 9, name: "אינפי 1", driveLink: "https://drive.google.com/drive/folders/1ViNjQEhT571efRNEpvS51xH0FZz8ABJa?usp=drive_link" },
]; 

export const yearTwoCourses = [
  { id: 10, name: "רשתות תקשורת מחשבים", driveLink: "https://drive.google.com/drive/folders/1YSnDxrx-nV7U5CodB21-yUpZMvZjyCDP?usp=share_link" },
  { id: 11, name: "מבוא למדעי הנתונים", driveLink: "https://drive.google.com/drive/folders/158eBODzY05k568sBR9dpMLbClGOL9ApT?usp=share_link" },
  { id: 12, name: "הסתברות", driveLink: "https://drive.google.com/drive/folders/1Nnnun-DJtFXBgrmQtLjhAe0ymLMVfE00?usp=sharing" },
  { id: 13, name: "אלגוריתמים 1", driveLink: "https://drive.google.com/drive/folders/17RoVASkatTiZ7zi3ndTO-2re2k7jgbWX?usp=share_link" },
  { id: 14, name: "אלגברה 2", driveLink: "https://drive.google.com/drive/folders/18gC5jhaB0QOFBMdQTNsja2kD1re-0CV7?usp=share_link" },
  { id: 15, name: "אינפי 2", driveLink: "https://drive.google.com/drive/folders/10r1SxcljTerC4JjeStG_WDpAa71FrNIE?usp=share_link" },
  { id: 16, name: "למידת מכונה", driveLink: "https://drive.google.com/drive/folders/1tK0A1K4iTJAAdDdmvurhi8LT8ulFGZkn?usp=share_link" },
  { id: 17, name: "הנדסת תוכנה", driveLink: "https://drive.google.com/drive/folders/10b0Jv8IdFOqGftwe0dtJ7K4lCrS_FRTF?usp=share_link" },
  { id: 18, name: "מערכות בסיסי נתונים", driveLink: "https://drive.google.com/drive/folders/1af6AZiAjVhAz--66Rix01xGk5ItTDKVW?usp=share_link" },
  { id: 19, name: "מערכות הפעלה", driveLink: "https://drive.google.com/drive/folders/1qnu2ZhfhX2wYc-mCwQCAaVFx9zvbXP9O?usp=share_link" },
  { id: 20, name: "אלגוריתמים 2", driveLink: "https://drive.google.com/drive/folders/1ME21TQUflIfQR93COVr0BKGtHHy5hpy2?usp=share_link" },
];

export const yearThreeCourses = [
  
  { id: 21, name: "אוטומטים ושפות פורמליות", driveLink: "https://drive.google.com/drive/folders/1HHv_5NGFKITUMbLM8INccG3jzz2cCmFS?usp=sharing" },
  { id: 22, name: "חישוביות וסיבוכיות", driveLink: "https://drive.google.com/drive/folders/1wPppIA0y7hFRf3CxEs0YBsEo5a_qCwdI?usp=share_link" },
  //cs choosing courses
  { id: 23, name: "בלוקצ'יין", driveLink: "https://drive.google.com/drive/folders/1rrR0a1k89Yu9jBdo08WMwiHLlJrui9Vn?usp=sharing"},
  { id: 24, name: "מבוא למערכות מידע גיאוגרפי GIS", driveLink: "https://drive.google.com/drive/folders/1tyinoo_MKNvX0n3sryv3dpFHDMNmSWRa?usp=drive_link"},
  { id: 25, name: "הנדסת פתרונות תוכנה מתקדמים (חלק א')", driveLink: "https://drive.google.com/drive/folders/1viWDkv9AJVOh3XO_oTSKjhVbA-sUX6v5?usp=sharing"},
  { id: 26, name: "מבוא לתורת ההצפנה", driveLink: "https://drive.google.com/drive/folders/1xVpuxzJz2U9WJN2VZyUY4cyNAy8U_qsN?usp=sharing"},
  { id: 27, name: "פיתוח צד לקוח בסביבת אנדרואיד 1", driveLink: "https://drive.google.com/drive/folders/1pKsN9bGYcHsBojg3cgzWpEIQpRhrI6nQ?usp=sharing"},
  { id: 28, name: "אבטחת מחשבים", driveLink: "https://drive.google.com/drive/folders/1_F79AnxBh9z-MMGNlqqO5xoiAUzx6Z3_?usp=sharing"},
  { id: 29, name: "אבטחת רשתות ומרשתת", driveLink: "https://drive.google.com/drive/folders/1KDn2p44y6x2fXWM5GHSn3-8ZM-uNCEkD?usp=sharing"},
  { id: 30, name: "פיתוח צד לקוח בסביבת אנדרואיד 2", driveLink: "https://drive.google.com/drive/folders/1srTFfiJqb-YJz1JYqxFYfttcnG_pSqKF?usp=sharing"},
  { id: 31, name: "fuzzy logic and soft computing", driveLink: "https://drive.google.com/drive/folders/1TQvNttFuySm6PJxv6XifAgm16lfGGV2f?usp=sharing"},
  { id: 32, name: "עיבוד שפה טבעית (דיבור וטקסט) בעזרת מחשב", driveLink: "https://drive.google.com/drive/folders/1K37wNz9cQhCM-CZQR7Dw_0Q9cN8_zLEl?usp=sharing"}

];

export const choosingCourses = [
  { id: 53, name: "בלוקציין", driveLink: "https://drive.google.com/drive/folders/1rrR0a1k89Yu9jBdo08WMwiHLlJrui9Vn?usp=share_link" },
  { id: 54, name: "מבוא למערכות מידע גיאוגרפי GIS", driveLink: "https://drive.google.com/drive/folders/1tyinoo_MKNvX0n3sryv3dpFHDMNmSWRa?usp=share_link" },
  { id: 55, name: "אנטומיה ופיזיולוגיה של גוף האדם", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאנטומיה%20ופיזיולוגיה%20של%20גוף%20האדם&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 56, name: "אתגרי מחשבה בפילוסופיה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאתגרי%20מחשבה%20בפילוסופיה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 57, name: "אתגר הגלובליזציה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאתגר%20הגלובליזציה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 58, name: "אתיקה בעסקים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאתיקה%20בעסקים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 59, name: "אתיקה של איכות הסביבה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאתיקה%20של%20איכות%20הסביבה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 60, name: "בסמטאותיה של צפת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fבסמטאותיה%20של%20צפת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 61, name: "האדם בין מימוש לאחריות חברתית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהאדם%20בין%20מימוש%20לאחריות%20חברתית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 62, name: "הבעות פנים מדארווין ועד היום", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהבעות%20פנים%20מדארווין%20ועד%20היום&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 63, name: "הגירה בעולם משתנה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהגירה%20בעולם%20משתנה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 64, name: "היסטוריה של אפריקה בשחור ולבן", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהיסטוריה%20של%20אפריקה%20בשחור%20ולבן&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 65, name: "העולם הנוצרי בעבר ובהווה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהעולם%20הנוצרי%20בעבר%20ובהווה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 66, name: "יצירתיות מרוח לחומר", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fיצירתיות%20מרוח%20לחומר&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 67, name: "מבוא לפיתוח בר-קיימא", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20לפיתוח%20בר%2Dקיימא&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 68, name: "מדע ומחשבה מדעית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמדע%20ומחשבה%20מדעית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 69, name: "נשים בחברה הישראלית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fנשים%20בחברה%20הישראלית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 70, name: "נשים במקרא בראייה פמיניסטית סוציולוגית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fנשים%20במקרא%20בראייה%20פמיניסטית%20סוציולוגית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 71, name: "סייבר - הצד האפל של הטכנולוגיה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fסייבר%20%2D%20הצד%20האפל%20של%20הטכנולוגיה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 72, name: "ציונות, פוסט ציונות וזהות ישראלית חדשה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fציונות%2C%20פוסט%20ציונות%20וזהות%20ישראלית%20חדשה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 73, name: "קהילות, פוליטיקה, עסקים באינטרנט", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fקהילות%2C%20פוליטיקה%2C%20עסקים%20באינטרנט&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 74, name: "קמפיינים פוליטיים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fקמפיינים%20פוליטיים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 75, name: "שואת יהודי אירופה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fשואת%20יהודי%20אירופה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 76, name: "תהליכי שינוי בתקשורת בישראל", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fתהליכי%20שינוי%20בתקשורת%20בישראל&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 77, name: "תחנות בחיי האדם מבט אנתרופולוגי בין תרבותי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fתחנות%20בחיי%20האדם%20מבט%20אנתרופולוגי%20בין%20תרבותי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 78, name: "תקשורת בעולם טכנולוגי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fתקשורת%20בעולם%20טכנולוגי&sortField=LinkFilename&isAscending=true&ga=1" },
];

export const eeYearOneCourses = [
  { id: 101, name: "פיסיקה 1 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fפיזיקה%201&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 102, name: "חשבון אינפיניטסימלי 1 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fחשבון%20אינפיניטסימלי%201&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 103, name: "אלגברה לינארית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאלגברה%20ליניארית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 104, name: "מיתוג ותכנון לוגי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמיתוג%20ותכנון%20לוגי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 105, name: "תכנות C", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fתכנות%20C&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 106, name: "חשבון אינפיניטסימלי 2 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fחשבון%20אינפיניטסימלי%202&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 107, name: "משוואות דיפרנציאליות רגילות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמשוואות%20דיפרנציאליות%20רגילות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 108, name: "טורים והתמרות אינטגראליות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fטורים%20והתמרות%20אינטגרליות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 109, name: "מעבדה לפיסיקה 1 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לפיזיקה%201&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 110, name: "פיסיקה 2 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fפיזיקה%202&sortField=LinkFilename&isAscending=true&ga=1" },
];

export const eeYearTwoCourses = [
  { id: 201, name: "הסתברות למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהסתברות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 202, name: "מעבדה לפיסיקה 2 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לפיזיקה%202&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 203, name: "משוואות דיפרנציאליות חלקיות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמשוואות%20דיפרנציאליות%20חלקיות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 204, name: "פיסיקה 3 למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fפיזיקה%203&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 205, name: "פונקציות מורכבות למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fפונקציות%20מרוכבות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 206, name: "מעבדה לכלי תוכנה למהנדסים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לכלי%20תוכנה%20למהנדסים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 207, name: "מבוא להנדסת חשמל", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20להנדסת%20חשמל&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 208, name: "יסודות מוליכים למחצה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fיסודות%20מוליכים%20למחצה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 209, name: "מעבדה להנדסת חשמל", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20להנדסת%20חשמל&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 210, name: "מבוא למערכות ליניאריות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20למערכות%20ליניאריות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 211, name: "אותות ומערכות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאותות%20ומערכות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 212, name: "שדות אלקטרומגנטיים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fשדות%20אלקטרומגנטיים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 213, name: "מדע נתונים-תאוריה ומעשה", driveLink: "#" },
  { id: 214, name: "קדם פרויקט ופיתוח מיומנויות רכות לסטודנטים", driveLink: "#" }
];

export const eeYearThreeCourses = [
  { id: 301, name: "התקני מוליכים למחצה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהתקני%20מוליכים%20למחצה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 302, name: "אותות אקראיים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאותות%20אקראיים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 303, name: "מבוא למערכות תקשורת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20למערכות%20תקשורת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 304, name: "עבוד אותות ספרתי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fעיבוד%20אותות%20ספרתי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 305, name: "בקרה א", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fבקרה%20א&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 306, name: "גלים ומערכות מפולגות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fגלים%20ומערכות%20מפולגות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 307, name: "מעבדה למיקרו בקרים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20למיקרו%20בקרים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 308, name: "מעגלים ספרתיים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעגלים%20ספרתיים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 309, name: "מעגלים אלקטרוניים ליניאריים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעגלים%20אלקטרוניים%20ליניאריים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 310, tag: 'בקרה', name: "בקרה אוטומטית מתקדמת (בקרה ב')", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fבקרה%20ב&sortField=LinkFilename&isAscending=true&ga=1"},
  { id: 311, tag: 'בקרה',  name: "מבוא לבקרה ליניארית מתקדמת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20לבקרה%20לינארית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 312, tag: 'בקרה', name: "מעבדה לבקרה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לבקרה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 313, tag: 'ביו הנדסה', name: "פרקים נבחרים בכימיה וביולוגיה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fפרקים%20נבחרים%20בכימיה%20וביולוגיה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 314, tag: 'ביו הנדסה', name: "אנטומיה ופיזיולוגיה של גוף האדם", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאנטומיה%20ופיזיולוגיה%20של%20גוף%20האדם&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 315, tag: 'ביו הנדסה', name: "מעבדה לעיבוד אותות ספרתי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לעיבוד%20אותות%20ספרתי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 316, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "טכנולוגיות מיקרואלקטרוניקה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fטכנולוגיות%20של%20מיקרואלקטרוניקה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 317, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "מבוא לאופטיקה מודרנית ואלקטרואופטיקה", driveLink: "#" },
  { id: 318, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "פוטוניקה ומערכות אלקטרואופטיות", driveLink: "#" },
  { id: 319, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "מעבדה לאלקטרואופטיקה", driveLink: "#" },
  { id: 320, tag: 'תקשורת ועיבוד אותות', name: "מבוא למיקרוגלים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20למיקרוגלים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 321, tag: 'תקשורת ועיבוד אותות', name: "רשתות מחשבים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fרשתות%20מחשבים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 322, tag: 'תקשורת ועיבוד אותות', name: "מעבדה למיקרו בקרים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20למיקרו%20בקרים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 323, tag: 'תקשורת ועיבוד אותות', name: "מעבדה להנדסת תקשורת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20להנדסת%20תקשורת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 324, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מערכות הספק ב", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20הספק%20ב&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 325, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מעבדה להמרת אנרגיה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20להמרת%20אנרגיה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 327, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "טכניקות מתח גבוה", driveLink: "#" },
  { id: 328, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "התקני מתח גבוה ונמוך", driveLink: "#" },
  { id: 329, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מערכות הספק אלקטרוניות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20הספק%20אלקטרוניות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 330, tag: ['אנרגיה ומערכות הספק(זרם חזק)','אנרגיות חלופיות ומערכות הספק משולב'], name: "המרת אנרגיה א", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fהמרת%20אנרגיה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 331, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "הינע חשמלי", driveLink: "#" },
  { id: 332, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "תהליכים אנרגטיים ושימור אנרגיה", driveLink: "#" },
  { id: 333, tag: 'מערכות משובצות מחשב', name: "אלגוריתמים ומבני נתונים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאלגוריתמים%20ומבנה%20נתונים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 334, tag: 'מערכות משובצות מחשב', name: "מעבדה מתקדמת בתכנות", driveLink: "#" },
  { id: 335, tag: 'מערכות משובצות מחשב', name: "תיכון חומרה באמצעות VHDL", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fתיכון%20חומרה%20באמצעות%20VHDL&sortField=LinkFilename&isAscending=true&ga=1" },



];
export const eeYearFourCourses = [
  { id: 401, tag: 'בקרה', name: "מעבדה מתקדמת לבקרה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לבקרה%20מתקדמת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 402, name: "מעבדה להתקנים אלקטרוניים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20להתקנים%20אלקטרונים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 403, name: "פרוייקט גמר", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fפרויקט%20גמר%20%2D%20תואר%20ראשון&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 404, tag: 'בקרה', name: "מעבדה לאלקטרוניקה תקבילית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לאלקטרוניקה%20תקבילית&sortField=LinkFilename&isAscending=true&ga=1"},
  { id: 405, tag: 'בקרה', name: "מעבדה לעיבוד אותות ספרתי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לעיבוד%20אותות%20ספרתי&sortField=LinkFilename&isAscending=true&ga=1"},
  { id: 407, tag: 'ביו הנדסה',  name: "מעבדה לעיבוד אותות פיזיולוגיים", driveLink: "#" },
  { id: 408, tag: 'ביו הנדסה', name: "עקרונות מכשור רפואי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמכשור%20רפואי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 409, tag: 'ביו הנדסה', name: "מבוא לנירופרוטזות", driveLink: "#" },
  { id: 410, tag: 'ביו הנדסה', name: "חיישנים ביו רפואיים", driveLink: "#" },
  { id: 411, tag: 'ביו הנדסה', name: "מעבדה למיכשור רפואי", driveLink: "#" },
  { id: 412, tag: 'ביו הנדסה', name: "שיטות למידת מכונה לניתוח אותות FMRI", driveLink: "#" },
  { id: 413, tag: 'תקשורת ועיבוד אותות', name: "תקשורת ספרתית מתקדמת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fתקשורת%20ספרתית%20מתקדמת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 414, tag: 'תקשורת ועיבוד אותות', name: "נושאים נבחרים בעיבוד אותות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fנושאים%20נבחרים%20בעיבוד%20אותות%20ספרתי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 415, tag: 'תקשורת ועיבוד אותות', name: "מערכות תקשורת בסיב אופטי", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20תקשורת%20בסיב%20אופטי&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 416, tag: 'תקשורת ועיבוד אותות', name: "למידה עמוקה לראייה ממוחשבת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fלמידה%20עמוקה%20ליישומי%20ראייה%20ממוחשבת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 417, tag: 'תקשורת ועיבוד אותות', name: "אנטנות וקרינה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאנטנות%20וקרינה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 418, tag: 'תקשורת ועיבוד אותות', name: "אנליזה וסימולציה של רשתות מחשבים", driveLink: "#" },
  { id: 419, tag: 'תקשורת ועיבוד אותות', name: "מעבדה לתקשורת ספרתית", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לתקשורת%20ספרתית&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 441, tag: 'תקשורת ועיבוד אותות', name: "מודולים בתכנון מערכות תקשורת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמודולים%20בתכנון%20מערכות%20תקשורת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 419, tag: 'תקשורת ועיבוד אותות', name: "עיבוד תמונה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fעיבוד%20תמונה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 420, tag: 'תקשורת ועיבוד אותות', name: "מערכות תקשורת MIMO", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20תקשורת%20MIMO&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 421, tag: 'תקשורת ועיבוד אותות', name: "עקרונות מכמ", driveLink: "#" },
  { id: 422, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מערכות הספק א", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20הספק%20אלקטרוניות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 423, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "הינע חשמלי", driveLink: "#" },
  { id: 424, tag: ['אנרגיה ומערכות הספק(זרם חזק)','אנרגיות חלופיות ומערכות הספק משולב'], name: "מעבדה לטכניקות מתח גבוה", driveLink: "#" },
  { id: 425, tag: ['אנרגיה ומערכות הספק(זרם חזק)','אנרגיות חלופיות ומערכות הספק משולב'], name: "מעבדה למערכות הספק אלקטרוניות", driveLink: "#" },
  { id: 426, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "'מערכות הספק ב", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20הספק%20ב&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 427, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "מעבדה להמרת אנרגיה", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20להמרת%20אנרגיה&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 428, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "התקני מתח גבוה ונמוך", driveLink: "#" },
  { id: 429, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "מערכות הספק אלקטרוניות", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמערכות%20הספק%20אלקטרוניות&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 430, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "מעבדה לאנרגיות חלופיות", driveLink: "#" },
  { id: 431, tag: 'מערכות משובצות מחשב', name: "מבוא לארכיטקטורת מחשבים", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמבוא%20לארכיטקטורת%20מחשבים&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 432, tag: 'מערכות משובצות מחשב', name: "שפת תכנון חומרה וורילוג", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fשפת%20תכנון%20חומרה%20וורילוג&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 433, tag: 'מערכות משובצות מחשב', name: "ראייה ממוחשבת", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fלמידה%20עמוקה%20ליישומי%20ראייה%20ממוחשבת&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 434, tag: 'מערכות משובצות מחשב', name: "תכן שבבי VLSI", driveLink: "#" },
  { id: 435, tag: 'מערכות משובצות מחשב', name: "סייבר למערכות זמן אמת", driveLink: "#" },
  { id: 436, tag: 'מערכות משובצות מחשב', name: "אפיון ותכנון ממ'מ", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fאפיון%20ותכנון%20מערכות%20משובצות%20מחשב&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 437, tag: 'מערכות משובצות מחשב', name: "מעבדה למערכות זמן אמת משובצות מחשב", driveLink: "#" },
  { id: 438, tag: 'מערכות משובצות מחשב', name: "מעבדה ל-VHDL", driveLink: "https://hitacil-my.sharepoint.com/personal/barucha_my_hit_ac_il/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fbarucha%5Fmy%5Fhit%5Fac%5Fil%2FDocuments%2Fדרייברי%20%2D%20הדרייב%20של%20ברי%20אגייב%2Fמעבדה%20לVHDL&sortField=LinkFilename&isAscending=true&ga=1" },
  { id: 439, tag: 'מערכות משובצות מחשב', name: "מעבדה במערכות מחשב משובצות ב-IoT", driveLink: "#" },
  { id: 440, tag: 'מערכות משובצות מחשב', name: "מעבדה למערכות משובצות מיקרופרוססורים", driveLink: "#" },











];

const YearSection = ({ title, courses, selectedTag, courseType = 'cs' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Theme based on courseType
  const bgColor = courseType === 'cs' ? 'bg-blue-800' : 'bg-purple-800';
  const hoverBgColor = courseType === 'cs' ? 'hover:bg-blue-700' : 'hover:bg-purple-700';
  const borderColor = courseType === 'cs' ? 'border-blue-200' : 'border-purple-200';
  const hoverBgLight = courseType === 'cs' ? 'hover:bg-blue-50' : 'hover:bg-purple-50';
  const bgLight = courseType === 'cs' ? 'bg-blue-100' : 'bg-purple-100';
  const textColor = courseType === 'cs' ? 'text-blue-900' : 'text-purple-900';
  const iconColor = courseType === 'cs' ? 'text-blue-800' : 'text-purple-800';
  
  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${bgColor} text-white p-4 rounded-lg flex justify-between items-center ${hoverBgColor} transition-colors`}
      >
        <span className="text-xl font-bold">{title}</span>
        {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
      </button>
      {isOpen && (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mt-2">
          {courses
              .filter(course => !selectedTag || !course.tag || (Array.isArray(course.tag) ? course.tag.includes(selectedTag) : course.tag === selectedTag))
              .map(course => (
              course.driveLink === "#" ? (
                <div
                  key={course.id}
                  className={`block bg-gray-50 transition-all duration-300 border ${borderColor} rounded-lg shadow-md`}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-h-[2rem]">
                      <div className={`bg-gray-200 p-1.5 rounded-md mt-0.5`}>
                        <BookOpen className={`h-5 w-5 text-gray-600 shrink-0`} />
                      </div>
                      <h3 className={`text-lg font-medium text-gray-700`}>
                        {course.name} <span className="text-red-500">(חסר)</span>
                      </h3>
                    </div>
                    <button 
                      className={`px-4 py-1.5 ${courseType === 'cs' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md transition-colors text-sm font-medium whitespace-nowrap shrink-0 mt-0.5`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({
                          top: document.documentElement.scrollHeight,
                          behavior: 'smooth'
                        });
                      }}
                    >
                      יש לי
                    </button>
                  </div>
                </div>
              ) : (
                <a
                  key={course.id}
                  href={course.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-white ${hoverBgLight} transition-all duration-300 border ${borderColor} rounded-lg shadow-md hover:shadow-lg`}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-h-[2rem]">
                      <div className={`${bgLight} p-1.5 rounded-md mt-0.5`}>
                        <BookOpen className={`h-5 w-5 ${iconColor} shrink-0`} />
                      </div>
                      <h3 className={`text-lg font-medium ${textColor}`}>{course.name}</h3>
                    </div>
                  </div>
                </a>
              )
            ))}
        </div>
      )}
    </div>
  );
};

const CoursesList = ({ electricalEngineering = false, selectedTag }) => {
  // Determine course type based on electricalEngineering prop
  const courseType = electricalEngineering ? 'ee' : 'cs';
  
  return (
    <div className="mb-4">
      {electricalEngineering ? (
        // Electrical Engineering courses
        <>
          <YearSection title="שנה א׳" courses={eeYearOneCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="שנה ב׳" courses={eeYearTwoCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="שנה ג׳" courses={eeYearThreeCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="שנה ד׳" courses={eeYearFourCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="רב תחומי" courses={choosingCourses} selectedTag={selectedTag} courseType={courseType} />
        </>
      ) : (
        // Computer Science courses
        <>
          <YearSection title="שנה א׳" courses={yearOneCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="שנה ב׳" courses={yearTwoCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="שנה ג׳" courses={yearThreeCourses} selectedTag={selectedTag} courseType={courseType} />
          <YearSection title="רב תחומי" courses={choosingCourses} selectedTag={selectedTag} courseType={courseType} />
        </>
      )}
    </div>
  );
};

export default CoursesList;