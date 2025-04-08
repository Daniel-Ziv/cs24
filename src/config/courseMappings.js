import { csYearOneCourses, csYearTwoCourses, csYearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses, choosingCourses, ieYearOneCourses, ieYearTwoCourses, ieYearThreeCourses, ieYearFourCourses } from './CoursesLinks';

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