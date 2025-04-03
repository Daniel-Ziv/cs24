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
  { id: 50, name: "בלוקצ'יין", driveLink: "https://drive.google.com/drive/folders/1rrR0a1k89Yu9jBdo08WMwiHLlJrui9Vn?usp=sharing"},
  { id: 51, name: "מבוא למערכות מידע גיאוגרפי GIS", driveLink: "https://drive.google.com/drive/folders/1tyinoo_MKNvX0n3sryv3dpFHDMNmSWRa?usp=drive_link"},
  { id: 52, name: "הנדסת פתרונות תוכנה מתקדמים (חלק א')", driveLink: "https://drive.google.com/drive/folders/1viWDkv9AJVOh3XO_oTSKjhVbA-sUX6v5?usp=sharing"},
  { id: 53, name: "מבוא לתורת ההצפנה", driveLink: "https://drive.google.com/drive/folders/1xVpuxzJz2U9WJN2VZyUY4cyNAy8U_qsN?usp=sharing"},
  { id: 54, name: "פיתוח צד לקוח בסביבת אנדרואיד 1", driveLink: "https://drive.google.com/drive/folders/1pKsN9bGYcHsBojg3cgzWpEIQpRhrI6nQ?usp=sharing"},
  { id: 55, name: "אבטחת מחשבים", driveLink: "https://drive.google.com/drive/folders/1_F79AnxBh9z-MMGNlqqO5xoiAUzx6Z3_?usp=sharing"},
  { id: 56, name: "אבטחת רשתות ומרשתת", driveLink: "https://drive.google.com/drive/folders/1KDn2p44y6x2fXWM5GHSn3-8ZM-uNCEkD?usp=sharing"},
  { id: 57, name: "פיתוח צד לקוח בסביבת אנדרואיד 2", driveLink: "https://drive.google.com/drive/folders/1srTFfiJqb-YJz1JYqxFYfttcnG_pSqKF?usp=sharing"},
  { id: 58, name: "fuzzy logic and soft computing", driveLink: "https://drive.google.com/drive/folders/1TQvNttFuySm6PJxv6XifAgm16lfGGV2f?usp=sharing"},
  { id: 59, name: "עיבוד שפה טבעית (דיבור וטקסט) בעזרת מחשב", driveLink: "https://drive.google.com/drive/folders/1K37wNz9cQhCM-CZQR7Dw_0Q9cN8_zLEl?usp=sharing"}

];

export const choosingCourses = [
  { id: 25, name: "אנטומיה ופיזיולוגיה של גוף האדם", driveLink: "https://drive.google.com/drive/folders/17T1jKhcm_yycBjGbeKti8MjQvAIB56Zn?usp=sharing" },
  { id: 26, name: "אתגרי מחשבה בפילוסופיה", driveLink: "https://drive.google.com/drive/folders/1SE45fWekHTb2SOlvVMa2c4IVd3ZXcMTw?usp=sharing" },
  { id: 27, name: "אתגר הגלובליזציה", driveLink: "https://drive.google.com/drive/folders/1TaWsX8OuzZts59Nwj0ZsI5EjwZAszImj?usp=sharing" },
  { id: 28, name: "אתיקה בעסקים", driveLink: "https://drive.google.com/drive/folders/1hLAOUwcVppKWIFG9irej6tHiqEv4Rb5K?usp=sharing" },
  { id: 29, name: "אתיקה של איכות הסביבה", driveLink: "https://drive.google.com/drive/folders/1nv4tUMPGawF6o_P7Ly7K-2b1fiuiDv0O?usp=sharing" },
  { id: 30, name: "בסמטאותיה של צפת", driveLink: "https://drive.google.com/drive/folders/1XgJwfXK991w-RJNecubq0FSPpEzImi4Y?usp=sharing" },
  { id: 31, name: "האדם בין מימוש לאחריות חברתית", driveLink: "https://drive.google.com/drive/folders/1ea491Pj-snePUemXfv1EQcUMKsiKBvBy?usp=sharing" },
  { id: 32, name: "הבעות פנים מדארווין ועד היום", driveLink: "https://drive.google.com/drive/folders/12xsN-9Y6-1HuU8jCtPUXZHqcBD2nU0A4?usp=sharing" },
  { id: 33, name: "הגירה בעולם משתנה", driveLink: "https://drive.google.com/drive/folders/19ymZDw28JZB5iHI54kJ3wyMI9A_3W_9p?usp=sharing" },
  { id: 34, name: "היסטוריה של אפריקה בשחור ולבן", driveLink: "https://drive.google.com/drive/folders/1w6rTIOua5Zmb-4FlQ3ahdz0EsQ440UWB?usp=sharing" },
  { id: 35, name: "העולם הנוצרי בעבר ובהווה", driveLink: "https://drive.google.com/drive/folders/10Nbhb2MSJ_4AFtaBjItln3HkSl9lTtjx?usp=sharing" },
  { id: 36, name: "יצירתיות מרוח לחומר", driveLink: "https://drive.google.com/drive/folders/1O34QuuqddCIpbj1svYN7yLnOzG9ibGok?usp=sharing" },
  { id: 37, name: "מבוא לפיתוח בר-קיימא", driveLink: "https://drive.google.com/drive/folders/1dsoU-HIpEDt9fwOWJN-3jOPTHTnQ6TAM?usp=sharing" },
  { id: 38, name: "מדע ומחשבה מדעית", driveLink: "https://drive.google.com/drive/folders/1XPo70GbJPfNNSlwEZ-UQ3FURVO10Y4xo?usp=sharing" },
  { id: 39, name: "נשים בחברה הישראלית", driveLink: "https://drive.google.com/drive/folders/1b-ARBEFs8qtnHUde6g6WVuZCgTIcLW_P?usp=sharing" },
  { id: 40, name: "נשים במקרא בראייה פמיניסטית סוציולוגית", driveLink: "https://drive.google.com/drive/folders/1b-ARBEFs8qtnHUde6g6WVuZCgTIcLW_P?usp=sharing" },
  { id: 41, name: "סייבר - הצד האפל של הטכנולוגיה", driveLink: "https://drive.google.com/drive/folders/1TgU96uOYczrIHC80x0DQpxKjF5LsfJbF?usp=sharing" },
  { id: 42, name: "ציונות, פוסט ציונות וזהות ישראלית חדשה", driveLink: "https://drive.google.com/drive/folders/1TgU96uOYczrIHC80x0DQpxKjF5LsfJbF?usp=sharing" },
  { id: 43, name: "קהילות, פוליטיקה, עסקים באינטרנט", driveLink: "https://drive.google.com/drive/folders/1TgU96uOYczrIHC80x0DQpxKjF5LsfJbF?usp=sharing" },
  { id: 44, name: "קמפיינים פוליטיים", driveLink: "https://drive.google.com/drive/folders/1U7vX78wXYMqBPnl89wdDvlPg_3KpF1En?usp=sharing" },
  { id: 45, name: "שואת יהודי אירופה", driveLink: "https://drive.google.com/drive/folders/1Xv39r2HuOSfh-tC0CTNVzVPed42S4k5T?usp=sharing" },
  { id: 46, name: "תהליכי שינוי בתקשורת בישראל", driveLink: "https://drive.google.com/drive/folders/1Xv39r2HuOSfh-tC0CTNVzVPed42S4k5T?usp=sharing" },
  { id: 47, name: "תחנות בחיי האדם מבט אנתרופולוגי בין תרבותי", driveLink: "https://drive.google.com/drive/folders/1Xv39r2HuOSfh-tC0CTNVzVPed42S4k5T?usp=sharing" },
  { id: 48, name: "תקשורת בעולם טכנולוגי", driveLink: "https://drive.google.com/drive/folders/1df61V_FAFbyiTkHj-4Io_Ds7h9l60c_2?usp=sharing" },
  ];

export const eeYearOneCourses = [
  { id: 101, name: "פיסיקה 1 למהנדסים", driveLink: "https://drive.google.com/drive/folders/13eAjUciLhspKbUbdGnKjKl4XR8t_n1OH?usp=sharing" },
  { id: 102, name: "חשבון אינפיניטסימלי 1 למהנדסים", driveLink: "https://drive.google.com/drive/folders/14sYtbDzTfDe1H5Plob-VCXSM0R_TGDRb?usp=sharing" },
  { id: 103, name: "אלגברה לינארית", driveLink: "https://drive.google.com/drive/folders/1LpITs6kJH50oMsAPc_2ktuD3vUY5W1sZ?usp=sharing" },
  { id: 104, name: "מיתוג ותכנון לוגי", driveLink: "https://drive.google.com/drive/folders/1n95SwJ-apieYLxNfVd__Q7iQC6FUGs8d?usp=sharing" },
  { id: 105, name: "תכנות C", driveLink: "https://drive.google.com/drive/folders/1y8byQXAs9LaA2YGztoUT0eZ1bI4h-0ZK?usp=sharing" },
  { id: 106, name: "חשבון אינפיניטסימלי 2 למהנדסים", driveLink: "https://drive.google.com/drive/folders/1COslpHiAKBcJpvcVUCCoXvnftaNXjI5N?usp=sharing" },
  { id: 107, name: "משוואות דיפרנציאליות רגילות", driveLink: "https://drive.google.com/drive/folders/1KyVXo4CQhAQNV9aJmMOmW58bYlmT-3n9?usp=sharing" },
  { id: 108, name: "טורים והתמרות אינטגראליות", driveLink: "https://drive.google.com/drive/folders/1VS5-d6G20R1nB6c6asLULXSm8zR12sm6?usp=sharing" },
  { id: 109, name: "מעבדה לפיסיקה 1 למהנדסים", driveLink: "https://drive.google.com/drive/folders/1wqfz80yPKgyMcbNRUgeK0aDkWUB_mkUB?usp=sharing" },
  { id: 110, name: "פיסיקה 2 למהנדסים", driveLink: "https://drive.google.com/drive/folders/1yGnvIuOhAIUiXCodMKtL99LhCPapJWdm?usp=sharing" },
  ];

export const eeYearTwoCourses = [
  { id: 201, name: "הסתברות למהנדסים", driveLink: "https://drive.google.com/drive/folders/1c-Q38DM20SofR8YaTuXKyBfQ3-tFoDX4?usp=sharing" },
  { id: 202, name: "מעבדה לפיסיקה 2 למהנדסים", driveLink: "https://drive.google.com/drive/folders/1Ik77eDpoxrZz5KA4vbmGV0xFFg08KRdV?usp=sharing" },
  { id: 203, name: "משוואות דיפרנציאליות חלקיות", driveLink: "https://drive.google.com/drive/folders/1J6giJiWFIHxod84L6_PBrPd5-4ajqeim?usp=sharing" },
  { id: 204, name: "פיסיקה 3 למהנדסים", driveLink: "https://drive.google.com/drive/folders/16klr88K2mtaBW-0_Rvg-y_TIOlI4C8iQ?usp=sharing" },
  { id: 205, name: "פונקציות מורכבות למהנדסים", driveLink: "https://drive.google.com/drive/folders/1wJOQszjd9A4daVclABc2P3TprbrwH9mK?usp=sharing" },
  { id: 206, name: "מעבדה לכלי תוכנה למהנדסים", driveLink: "https://drive.google.com/drive/folders/1Za0LJtru5Dn9v1J4RvTNf_KLTJDNr4-p?usp=sharing" },
  { id: 207, name: "מבוא להנדסת חשמל", driveLink: "https://drive.google.com/drive/folders/1v1w0g6h8mussYLIMP-B1nQ4QNtfuUAlm?usp=sharing" },
  { id: 208, name: "יסודות מוליכים למחצה", driveLink: "https://drive.google.com/drive/folders/16zj2ouNYMQG6Dl1PUUFjV1BXSDrTBeTW?usp=sharing" },
  { id: 209, name: "מעבדה להנדסת חשמל", driveLink: "https://drive.google.com/drive/folders/1iClsbfW2LWiKvpXYKjSjWAZYMofV0Bgk?usp=sharing" },
  { id: 210, name: "מבוא למערכות ליניאריות", driveLink: "https://drive.google.com/drive/folders/1iy7qx2WNVMP5G1ZNDaFXGL7s9Z2a_zWv?usp=sharing" },
  { id: 211, name: "אותות ומערכות", driveLink: "https://drive.google.com/drive/folders/151S0RPsbA_0zES17jeRjIf8PhyrjVR51?usp=sharing" },
  { id: 212, name: "שדות אלקטרומגנטיים", driveLink: "https://drive.google.com/drive/folders/1162k7ZTC4SnALaR3-_MhTAufO_BdTLD8?usp=sharing" },
  { id: 213, name: "מדע נתונים-תאוריה ומעשה", driveLink: "https://drive.google.com/drive/folders/1WPh7ZuUNzrsmsL4LWnjU3omXK0M46-J6?usp=sharing" },
  { id: 214, name: "קדם פרויקט ופיתוח מיומנויות רכות לסטודנטים", driveLink: "https://drive.google.com/drive/folders/1ejhzeB0UiwmcIbJ56lTCfZtQT5HDEEdt?usp=sharing" }
];

export const eeYearThreeCourses = [
  { id: 301, name: "התקני מוליכים למחצה", driveLink: "https://drive.google.com/drive/folders/1rUH6ZtAQsBzAUo6ORoK37XbjUtyZpP8l?usp=sharing" },
  { id: 302, name: "אותות אקראיים", driveLink: "https://drive.google.com/drive/folders/1NHIowwO5exXk3Mm_0AGeO-afRn3ovuJy?usp=sharing" },
  { id: 303, name: "מבוא למערכות תקשורת", driveLink: "https://drive.google.com/drive/folders/1NNpCXlxXQLaWy9A4DEuw0KWgGsbIqYfl?usp=sharing" },
  { id: 304, name: "עבוד אותות ספרתי", driveLink: "https://drive.google.com/drive/folders/1uNJePLcPXHCyy-uNwpVFZh6ofWEtBRkp?usp=sharing" },
  { id: 305, name: "בקרה א", driveLink: "https://drive.google.com/drive/folders/1kFF_H3zZUi0Vh6LUxCuo9ipbWeGg8MvR?usp=sharing" },
  { id: 306, name: "גלים ומערכות מפולגות", driveLink: "https://drive.google.com/drive/folders/1-72YoL_hkxBM0mDPTqgm5jAx5SA3G645?usp=sharing" },
  { id: 307, name: "מעבדה למיקרו בקרים", driveLink: "https://drive.google.com/drive/folders/1jfRS4GZ6MIQGpulZDmzGr1xiz2wV30-Q?usp=sharing" },
  { id: 308, name: "מעגלים ספרתיים", driveLink: "https://drive.google.com/drive/folders/1FGNTH5N-tDLxAWYBtkSaDthQH4S4mxhq?usp=sharing" },
  { id: 309, name: "מעגלים אלקטרוניים ליניאריים", driveLink: "https://drive.google.com/drive/folders/1lEEMf30HypR2T6Xi4pTpBncYu_Mk35fq?usp=sharing" },
  { id: 310, tag: 'בקרה', name: "בקרה אוטומטית מתקדמת (בקרה ב')", driveLink: "https://drive.google.com/drive/folders/1heCyFzA-3eFfpK1bVithxZHHYN8pL5OG?usp=sharing"},
  { id: 311, tag: 'בקרה',  name: "מבוא לבקרה ליניארית מתקדמת", driveLink: "https://drive.google.com/drive/folders/1N39wv8XpqByhktTmYo6nfE3LX05JknHo?usp=sharing" },
  { id: 312, tag: 'בקרה', name: "מעבדה לבקרה", driveLink: "https://drive.google.com/drive/folders/1ObjQ2q9WVBdsxNxL5FqGKOGt453bO8rZ?usp=sharing" },
  { id: 313, tag: 'ביו הנדסה', name: "פרקים נבחרים בכימיה וביולוגיה", driveLink: "https://drive.google.com/drive/folders/1luZBitgT6RD1VMyTxuLFT6amCWoZBb9S?usp=sharing" },
  { id: 314, tag: 'ביו הנדסה', name: "אנטומיה ופיזיולוגיה של גוף האדם", driveLink: "https://drive.google.com/drive/folders/1EUboqiizUxI20h-juzrV4lTHASK6fZLJ?usp=sharing" },
  { id: 315, tag: 'ביו הנדסה', name: "מעבדה לעיבוד אותות ספרתי", driveLink: "https://drive.google.com/drive/folders/1CN1nYsUsIXi4KLlVSkbN0yETg0rMDU5u?usp=sharing" },
  { id: 316, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "טכנולוגיות מיקרואלקטרוניקה", driveLink: "https://drive.google.com/drive/folders/1vsAOxhpluuVZMkqAsktfdCfYWdBQKFUL?usp=sharing" },  
  { id: 317, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "מבוא לאופטיקה מודרנית ואלקטרואופטיקה", driveLink: "#" },
  { id: 318, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "פוטוניקה ומערכות אלקטרואופטיות", driveLink: "#" },
  { id: 319, tag: 'אלקטרואופטיקה ומיקרואלקטרוניקה', name: "מעבדה לאלקטרואופטיקה", driveLink: "#" },
  { id: 320, tag: 'תקשורת ועיבוד אותות', name: "מבוא למיקרוגלים", driveLink: "https://drive.google.com/drive/folders/1VrtSF0sdj97Sj2wrKUBs2VMMnxM_DVbF?usp=sharing" },
  { id: 321, tag: 'תקשורת ועיבוד אותות', name: "רשתות מחשבים", driveLink: "https://drive.google.com/drive/folders/1nGXwJIDPEMEICTZ9LEsvnUzGpixH8Tok?usp=sharing" },
  { id: 322, tag: 'תקשורת ועיבוד אותות', name: "מעבדה למיקרו בקרים", driveLink: "https://drive.google.com/drive/folders/1jfRS4GZ6MIQGpulZDmzGr1xiz2wV30-Q?usp=sharing" },
  { id: 323, tag: 'תקשורת ועיבוד אותות', name: "מעבדה להנדסת תקשורת", driveLink: "https://drive.google.com/drive/folders/1E3Uex6GXWDYcrXVqa4AFtFb_BO4EG2pg?usp=sharing" },
  { id: 324, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מערכות הספק ב", driveLink: "https://drive.google.com/drive/folders/1ipjLTk7r1EwjUb8z2fgcQJnZL7EbQCrQ?usp=sharing" },
  { id: 325, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מעבדה להמרת אנרגיה", driveLink: "https://drive.google.com/drive/folders/1XpSY-bszz7s6Y5hcSXvxAXNhes3d95cy?usp=sharing" },
  { id: 327, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "טכניקות מתח גבוה", driveLink: "#" },
  { id: 328, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "התקני מתח גבוה ונמוך", driveLink: "#" },
  { id: 329, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מערכות הספק אלקטרוניות", driveLink: "https://drive.google.com/drive/folders/1kPuwmfOkh6UfkFBFsdB3yVAwt7qk-eBm?usp=sharing" },
  { id: 330, tag: ['אנרגיה ומערכות הספק(זרם חזק)','אנרגיות חלופיות ומערכות הספק משולב'], name: "המרת אנרגיה א", driveLink: "https://drive.google.com/drive/folders/15rE4Bc6vtMdhWc0wvw010ogVFXc_Uy34?usp=sharing" },
  { id: 331, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "הינע חשמלי", driveLink: "#" },
  { id: 332, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "תהליכים אנרגטיים ושימור אנרגיה", driveLink: "#" },
  { id: 333, tag: 'מערכות משובצות מחשב', name: "אלגוריתמים ומבני נתונים", driveLink: "https://drive.google.com/drive/folders/1uZ2V8J8VdRmcWuPuIuSokE_gupem3eY2?usp=sharing" },
  { id: 334, tag: 'מערכות משובצות מחשב', name: "מעבדה מתקדמת בתכנות", driveLink: "#" },
  { id: 335, tag: 'מערכות משובצות מחשב', name: "תיכון חומרה באמצעות VHDL", driveLink: "https://drive.google.com/drive/folders/1CRJ9DbtiNCMEawmmLmc2xa92nYeWSC8q?usp=sharing" },



];
export const eeYearFourCourses = [
  { id: 401, tag: 'בקרה', name: "מעבדה מתקדמת לבקרה", driveLink: "https://drive.google.com/drive/folders/12n3Mvp0IWszS7mB1BFFvOeD8ssxNPVIn?usp=sharing" },
  { id: 402, name: "מעבדה להתקנים אלקטרוניים", driveLink: "https://drive.google.com/drive/folders/1Q6Gk8DumqUk5kigYbPp6K17S9plJW6hB?usp=sharing" },
  { id: 403, name: "פרוייקט גמר", driveLink: "https://drive.google.com/drive/folders/1ZYDQSAq3bzS15ByNMfJlYEAximuBeUM4?usp=sharing" },
  { id: 404, tag: 'בקרה', name: "מעבדה לאלקטרוניקה תקבילית", driveLink: "https://drive.google.com/drive/folders/1h_aWk4M4zKJXh7bCBnLbJ7LZMu_h6ybj?usp=sharing"},
  { id: 405, tag: 'בקרה', name: "מעבדה לעיבוד אותות ספרתי", driveLink: "https://drive.google.com/drive/folders/14syXj9pO9rSD92Wa3YFuOktJfy0botS7?usp=sharing"},
  { id: 407, tag: 'ביו הנדסה',  name: "מעבדה לעיבוד אותות פיזיולוגיים", driveLink: "#" },
  { id: 408, tag: 'ביו הנדסה', name: "עקרונות מכשור רפואי", driveLink: "https://drive.google.com/drive/folders/19zTnlBGfn98qp6d_2KTwKzM-gsK00UoY?usp=sharing" },
  { id: 409, tag: 'ביו הנדסה', name: "מבוא לנירופרוטזות", driveLink: "#" },
  { id: 410, tag: 'ביו הנדסה', name: "חיישנים ביו רפואיים", driveLink: "#" },
  { id: 411, tag: 'ביו הנדסה', name: "מעבדה למיכשור רפואי", driveLink: "#" },
  { id: 412, tag: 'ביו הנדסה', name: "שיטות למידת מכונה לניתוח אותות FMRI", driveLink: "#" },
  { id: 413, tag: 'תקשורת ועיבוד אותות', name: "תקשורת ספרתית מתקדמת", driveLink: "https://drive.google.com/drive/folders/12Y1yKCVC5H2l2RNsG0Ze8TtdsPEyqd2h?usp=sharing" },
  { id: 414, tag: 'תקשורת ועיבוד אותות', name: "נושאים נבחרים בעיבוד אותות", driveLink: "https://drive.google.com/drive/folders/1kbob6hZQfLTZMDTveACnCo4JnW8J2xSj?usp=sharing" },
  { id: 415, tag: 'תקשורת ועיבוד אותות', name: "מערכות תקשורת בסיב אופטי", driveLink: "https://drive.google.com/drive/folders/1Ug3HhC52YYJ0OB2iV1nRy4EN3e5zEyG3?usp=sharing" },
  { id: 416, tag: 'תקשורת ועיבוד אותות', name: "למידה עמוקה לראייה ממוחשבת", driveLink: "https://drive.google.com/drive/folders/1FjSekoz9FRFTc8RI5X_c91DU3xPMtWsQ?usp=sharing" },
  { id: 417, tag: 'תקשורת ועיבוד אותות', name: "אנטנות וקרינה", driveLink: "https://drive.google.com/drive/folders/16p8nFgx0LUAwbR7GE0S68Z53IWlFl2Ln?usp=sharing" },
  { id: 418, tag: 'תקשורת ועיבוד אותות', name: "אנליזה וסימולציה של רשתות מחשבים", driveLink: "#" },
  { id: 419, tag: 'תקשורת ועיבוד אותות', name: "מעבדה לתקשורת ספרתית", driveLink: "https://drive.google.com/drive/folders/13_9wPi20p6zUZoPyaDbyIwRJ7_o__Vpd?usp=sharing" },
  { id: 441, tag: 'תקשורת ועיבוד אותות', name: "מודולים בתכנון מערכות תקשורת", driveLink: "https://drive.google.com/drive/folders/1pw3v2RTQK_9sZCD5RC5Yo309kx3YTu6e?usp=sharing" },
  { id: 419, tag: 'תקשורת ועיבוד אותות', name: "עיבוד תמונה", driveLink: "https://drive.google.com/drive/folders/1JwxnF0SUq98U1rb4XrgOUAUAx4vf7eH9?usp=sharing" },
  { id: 420, tag: 'תקשורת ועיבוד אותות', name: "מערכות תקשורת MIMO", driveLink: "https://drive.google.com/drive/folders/1iPh2vuYWyqwQivzw-7H0ByDiUl-c8HWl?usp=sharing" },
  { id: 421, tag: 'תקשורת ועיבוד אותות', name: "עקרונות מכמ", driveLink: "https://drive.google.com/drive/folders/1I8W9QqI0mCCKqr_1bd2XDzt1f0LsJmpz?usp=sharing" },
  { id: 422, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "מערכות הספק א", driveLink: "https://drive.google.com/drive/folders/1_fFYueRZ-qZFaafNBG2yTX2p84WmR3F-?usp=sharing" },
  { id: 423, tag: 'אנרגיה ומערכות הספק(זרם חזק)', name: "הינע חשמלי", driveLink: "#" },
  { id: 424, tag: ['אנרגיה ומערכות הספק(זרם חזק)','אנרגיות חלופיות ומערכות הספק משולב'], name: "מעבדה לטכניקות מתח גבוה", driveLink: "#" },
  { id: 425, tag: ['אנרגיה ומערכות הספק(זרם חזק)','אנרגיות חלופיות ומערכות הספק משולב'], name: "מעבדה למערכות הספק אלקטרוניות", driveLink: "#" },
  { id: 426, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "'מערכות הספק ב", driveLink: "https://drive.google.com/drive/folders/1ipwwC5tEGFexknfFU5HRyZqUNxDX-fhA?usp=sharing" },
  { id: 427, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "מעבדה להמרת אנרגיה", driveLink: "https://drive.google.com/drive/folders/1U6tN6lXubrSoEEFwuyZdfX6nIeXkkYOb?usp=sharing" },
  { id: 428, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "התקני מתח גבוה ונמוך", driveLink: "#" },
  { id: 429, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "מערכות הספק אלקטרוניות", driveLink: "https://drive.google.com/drive/folders/141Sq0YI1wK_FftQMEqWByt6ntV028JJ6?usp=sharing" },
  { id: 430, tag: 'אנרגיות חלופיות ומערכות הספק משולב', name: "מעבדה לאנרגיות חלופיות", driveLink: "#" },
  { id: 431, tag: 'מערכות משובצות מחשב', name: "מבוא לארכיטקטורת מחשבים", driveLink: "https://drive.google.com/drive/folders/1omrCvPAf5Av9kNwGOIbAhkLbPiAI7n8C?usp=sharing" },
  { id: 432, tag: 'מערכות משובצות מחשב', name: "שפת תכנון חומרה וורילוג", driveLink: "https://drive.google.com/drive/folders/1rSpb-urZj3iDuXr3LwML4O2QE_r5N13k?usp=sharing" },
  { id: 433, tag: 'מערכות משובצות מחשב', name: "ראייה ממוחשבת", driveLink: "https://drive.google.com/drive/folders/1FjSekoz9FRFTc8RI5X_c91DU3xPMtWsQ?usp=sharing" },
  { id: 434, tag: 'מערכות משובצות מחשב', name: "תכן שבבי VLSI", driveLink: "#" },
  { id: 435, tag: 'מערכות משובצות מחשב', name: "סייבר למערכות זמן אמת", driveLink: "#" },
  { id: 436, tag: 'מערכות משובצות מחשב', name: "אפיון ותכנון ממ'מ", driveLink: "https://drive.google.com/drive/folders/1Pd-tm4O1BcW_zEHqN2SGNAtK4BadoJmQ?usp=sharing" },
  { id: 437, tag: 'מערכות משובצות מחשב', name: "מעבדה למערכות זמן אמת משובצות מחשב", driveLink: "#" },
  { id: 438, tag: 'מערכות משובצות מחשב', name: "מעבדה ל-VHDL", driveLink: "https://drive.google.com/drive/folders/1fXRvMqs4Wcg0lfeqouMfEmE5VuBoPt_Z?usp=sharing" },
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