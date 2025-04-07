import { yearOneCourses, yearTwoCourses, yearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses, choosingCourses, ieYearOneCourses, ieYearTwoCourses, ieYearThreeCourses, ieYearFourCourses } from '../components/CoursesListLinks';

export const courseMappings = {
  cs: {
    "שנה א'": yearOneCourses,
    "שנה ב'": yearTwoCourses,
    "שנה ג'": yearThreeCourses,
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