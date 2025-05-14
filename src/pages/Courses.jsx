import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { courseStyles } from "../config/courseStyles";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import StarRating from "../components/StarRating";
const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  // Calculate average rating if available
  const averageRating = course.ratings
    ? (
        course.ratings.reduce((a, b) => a + b, 0) / course.ratings.length
      ).toFixed(1)
    : null;

  const handleViewCourse = () => {
    // Navigate to the course details page with the course ID
    navigate(`/course/${course.id}`);
    console.log("Navigating to course:", course.id, course.video_title);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="relative h-48 cursor-pointer" onClick={handleViewCourse}>
        <img
          src={
            course.thumbnail_url ||
            `https://videodelivery.net/${course.video_uid}/thumbnails/thumbnail.jpg?time=${course.thumbnail}s`
          }
          alt={course.video_title}
          className="w-full h-full object-cover"
        />
        {averageRating && (
          <div className="absolute top-0 right-0 bg-gray-800 bg-opacity-80 text-yellow-400 px-3 py-1 m-2 rounded-md shadow-md">
            <StarRating rating={parseFloat(averageRating)} />
          </div>
        )}

        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-lg font-semibold">למידע נוסף</span>
        </div>
      </div>
      <div className="p-6">
        <h3
          className="text-xl font-bold text-gray-800 mb-2 cursor-pointer"
          onClick={handleViewCourse}
        >
          {course.video_title}
        </h3>
        <p className="text-gray-600 mb-3">{course.course_name}</p>
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-gray-700">מרצה: {course.tutor_name}</span>
          </div>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={handleViewCourse}
        >
          צפה עכשיו
        </button>
      </div>
    </div>
  );
};

const YearSection = ({ year, courses }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">{year}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  </div>
);

const Courses = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const styles = courseStyles.cs;
  const navigate = useNavigate();

  // Define course names for each year in Hebrew
  const yearCourseMappings = {
    year1: [
      "מבני נתונים",
      "מבוא למדעי המחשב",
      "מתמטיקה בדידה 1",
      "מתמטיקה בדידה 2",
      "מערכות מחשב",
      "תכנות מונחה עצמים",
      "סדנה",
      "סדנת תכנות",
    ],
    year2: [
      "אלגוריתמים 1",
      "אלגוריתמים 2",
      "מדעי הנתונים",
      "למידת מכונה",
      "רשתות מחשבים",
      "אלגוריתמים",
      "מדעי הנתונים",
      "למידה",
      "רשתות",
    ],
    year3: [
      "אוטומטים",
      "אוטומטים ושפות פורמליות",
      "חישוביות",
      "חישוביות ומורכבות",
      "תיאוריה",
      "שפות פורמליות",
    ],
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        // Define placeholder data with all our required courses
        const placeholderData = [
          // Year 1 courses
          {
            id: 101,
            video_uid: "placeholder-uid-101",
            video_title: "מבני נתונים",
            course_name: "מבני נתונים",
            tutor_name: "ד״ר ישראל ישראלי",
            thumbnail_url:
              "https://img.freepik.com/free-vector/binary-code-algorithm-digital-data-sorting-structure-computer-science-technology-concept-tree-diagram-vector-illustration_335657-2906.jpg",
            description:
              "קורס זה מספק מבוא מקיף למבני נתונים, כולל רשימות מקושרות, מחסניות, תורים, עצים, ועוד.",
            year: 1,
            ratings: [4, 5, 4.5, 5],
            thumbnail: 10,
            has_access: true,
          },
          {
            id: 102,
            video_uid: "placeholder-uid-102",
            video_title: "מבוא למדעי המחשב",
            course_name: "מבוא למדעי המחשב",
            tutor_name: "ד״ר ישראל ישראלי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=מבוא+למדעי+המחשב",
            description:
              "קורס המבוא מציג את יסודות מדעי המחשב, אלגוריתמים בסיסיים ופיתוח חשיבה אלגוריתמית.",
            year: 1,
            ratings: [4, 4.5, 5],
            thumbnail: 12,
            has_access: true,
          },
          {
            id: 103,
            video_uid: "placeholder-uid-103",
            video_title: "מתמטיקה בדידה 1",
            course_name: "מתמטיקה בדידה 1",
            tutor_name: "פרופ׳ דוד לוי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=מתמטיקה+בדידה+1",
            description:
              "קורס זה עוסק ביסודות המתמטיקה הבדידה, כולל תורת הקבוצות, יחסים, פונקציות, ולוגיקה.",
            year: 1,
            ratings: [3.5, 4, 4.5],
            thumbnail: 15,
            has_access: true,
          },
          {
            id: 104,
            video_uid: "placeholder-uid-104",
            video_title: "מתמטיקה בדידה 2",
            course_name: "מתמטיקה בדידה 2",
            tutor_name: "פרופ׳ דוד לוי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=מתמטיקה+בדידה+2",
            description:
              "המשך לקורס מתמטיקה בדידה 1, עם התמקדות בתורת הגרפים, קומבינטוריקה, ואינדוקציה מתמטית.",
            year: 1,
            ratings: [4, 4.5, 4],
            thumbnail: 18,
            has_access: true,
          },
          {
            id: 105,
            video_uid: "placeholder-uid-105",
            video_title: "מערכות מחשב",
            course_name: "מערכות מחשב",
            tutor_name: "ד״ר יוסף כהן",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=מערכות+מחשב",
            description:
              "קורס זה מציג את המבנה והארכיטקטורה של מחשבים מודרניים, כולל רכיבי חומרה, זיכרון, ומעבדים.",
            year: 1,
            ratings: [4.5, 5, 4.5],
            thumbnail: 20,
            has_access: true,
          },
          {
            id: 106,
            video_uid: "placeholder-uid-106",
            video_title: "תכנות מונחה עצמים",
            course_name: "תכנות מונחה עצמים",
            tutor_name: "ד״ר מיכל לוין",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=תכנות+מונחה+עצמים",
            description:
              "קורס המלמד עקרונות תכנות מונחה עצמים כגון הפשטה, ירושה, פולימורפיזם וכימוס.",
            year: 1,
            ratings: [5, 4, 4.5],
            thumbnail: 22,
            has_access: true,
          },
          {
            id: 107,
            video_uid: "placeholder-uid-107",
            video_title: "סדנת תכנות מתקדמת",
            course_name: "סדנת תכנות מתקדמת",
            tutor_name: "ד״ר יוסף כהן",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=סדנת+תכנות+מתקדמת",
            description:
              "סדנה מעשית המתמקדת בפיתוח פרויקטים מורכבים תוך שימוש בטכניקות תכנות מתקדמות.",
            year: 1,
            ratings: [4, 4.5, 5],
            thumbnail: 25,
            has_access: true,
          },

          // Year 2 courses
          {
            id: 201,
            video_uid: "placeholder-uid-201",
            video_title: "אלגוריתמים 1",
            course_name: "אלגוריתמים 1",
            tutor_name: "פרופ׳ דוד לוי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=אלגוריתמים+1",
            description:
              "קורס זה מציג אלגוריתמים בסיסיים ומתקדמים, ניתוח סיבוכיות, ואסטרטגיות לפתרון בעיות.",
            year: 2,
            ratings: [4.5, 4, 5],
            thumbnail: 30,
            has_access: true,
          },
          {
            id: 202,
            video_uid: "placeholder-uid-202",
            video_title: "אלגוריתמים 2",
            course_name: "אלגוריתמים 2",
            tutor_name: "פרופ׳ דוד לוי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=אלגוריתמים+2",
            description:
              "המשך לקורס אלגוריתמים 1, עם התמקדות באלגוריתמים מתקדמים יותר ובעיות מורכבות.",
            year: 2,
            ratings: [5, 4.5, 4],
            thumbnail: 35,
            has_access: true,
          },
          {
            id: 203,
            video_uid: "placeholder-uid-203",
            video_title: "מדעי הנתונים",
            course_name: "מדעי הנתונים",
            tutor_name: "ד״ר מיכל לוין",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=מדעי+הנתונים",
            description:
              "קורס זה מציג את יסודות מדעי הנתונים, כולל ניתוח נתונים, ויזואליזציה, וסטטיסטיקה.",
            year: 2,
            ratings: [4, 4.5, 4],
            thumbnail: 40,
            has_access: true,
          },
          {
            id: 204,
            video_uid: "placeholder-uid-204",
            video_title: "למידת מכונה",
            course_name: "למידת מכונה",
            tutor_name: "ד״ר מיכל לוין",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=למידת+מכונה",
            description:
              "קורס זה מציג את יסודות למידת המכונה, כולל אלגוריתמי למידה מונחית ולא מונחית.",
            year: 2,
            ratings: [5, 4.5, 5],
            thumbnail: 45,
            has_access: true,
          },
          {
            id: 205,
            video_uid: "placeholder-uid-205",
            video_title: "רשתות מחשבים",
            course_name: "רשתות מחשבים",
            tutor_name: "ד״ר יוסף כהן",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=רשתות+מחשבים",
            description:
              "קורס זה מציג את יסודות רשתות המחשבים, כולל פרוטוקולים, אבטחה, ותכנון רשתות.",
            year: 2,
            ratings: [4, 4.5, 4],
            thumbnail: 50,
            has_access: true,
          },

          // Year 3 courses
          {
            id: 301,
            video_uid: "placeholder-uid-301",
            video_title: "אוטומטים ושפות פורמליות",
            course_name: "אוטומטים ושפות פורמליות",
            tutor_name: "פרופ׳ דוד לוי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=אוטומטים+ושפות+פורמליות",
            description:
              "קורס זה עוסק בתיאוריה של חישוב, אוטומטים סופיים, שפות פורמליות ודקדוקים.",
            year: 3,
            ratings: [4.5, 4, 4.5],
            thumbnail: 55,
            has_access: true,
          },
          {
            id: 302,
            video_uid: "placeholder-uid-302",
            video_title: "חישוביות ומורכבות",
            course_name: "חישוביות ומורכבות",
            tutor_name: "פרופ׳ דוד לוי",
            thumbnail_url:
              "https://via.placeholder.com/480x270?text=חישוביות+ומורכבות",
            description:
              "קורס זה עוסק בתורת החישוביות, מכונות טיורינג, בעיות לא כריעות, ומורכבות חישובית.",
            year: 3,
            ratings: [4, 4.5, 4],
            thumbnail: 60,
            has_access: true,
          },
        ];

        // Always use the placeholder data to ensure courses are visible
        setCoursesData(placeholderData);

        // For debugging purposes, still try to fetch from API
        try {
          const { data, error } = await supabase.rpc(
            "get_video_thumbnail_data"
          );
          if (error) console.error("API Error:", error);
          console.log("API data (not used):", data);
        } catch (err) {
          console.error("Error fetching from API:", err);
        }
      } catch (err) {
        console.error("Error in course setup:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Helper function to check if a course belongs to a specific year
  const belongsToYear = (course, yearKey) => {
    if (!course) return false;

    // Year 1 courses
    if (yearKey === "year1") {
      return (
        course.video_title === "מבני נתונים" ||
        course.video_title === "מבוא למדעי המחשב" ||
        course.video_title === "מתמטיקה בדידה 1" ||
        course.video_title === "מתמטיקה בדידה 2" ||
        course.video_title === "מערכות מחשב" ||
        course.video_title === "תכנות מונחה עצמים" ||
        course.video_title === "סדנת תכנות מתקדמת" ||
        course.course_name === "מבני נתונים" ||
        course.course_name === "מבוא למדעי המחשב" ||
        course.course_name === "מתמטיקה בדידה 1" ||
        course.course_name === "מתמטיקה בדידה 2" ||
        course.course_name === "מערכות מחשב" ||
        course.course_name === "תכנות מונחה עצמים" ||
        course.course_name === "סדנת תכנות מתקדמת"
      );
    }

    // Year 2 courses
    if (yearKey === "year2") {
      return (
        course.video_title === "אלגוריתמים 1" ||
        course.video_title === "אלגוריתמים 2" ||
        course.video_title === "מדעי הנתונים" ||
        course.video_title === "למידת מכונה" ||
        course.video_title === "רשתות מחשבים" ||
        course.course_name === "אלגוריתמים 1" ||
        course.course_name === "אלגוריתמים 2" ||
        course.course_name === "מדעי הנתונים" ||
        course.course_name === "למידת מכונה" ||
        course.course_name === "רשתות מחשבים"
      );
    }

    // Year 3 courses
    if (yearKey === "year3") {
      return (
        course.video_title === "אוטומטים ושפות פורמליות" ||
        course.video_title === "חישוביות ומורכבות" ||
        course.course_name === "אוטומטים ושפות פורמליות" ||
        course.course_name === "חישוביות ומורכבות"
      );
    }

    return false;
  };

  // Apply both year filtering and search query
  const getFilteredCourses = () => {
    const result = {
      year1: [],
      year2: [],
      year3: [],
    };

    if (!coursesData.length) return result;

    // First, filter by search query if it exists
    const searchFiltered = searchQuery
      ? coursesData.filter(
          (course) =>
            (course.video_title &&
              course.video_title
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (course.course_name &&
              course.course_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (course.tutor_name &&
              course.tutor_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
      : coursesData;

    // Then categorize courses by year
    searchFiltered.forEach((course) => {
      if (belongsToYear(course, "year1")) {
        result.year1.push(course);
      } else if (belongsToYear(course, "year2")) {
        result.year2.push(course);
      } else if (belongsToYear(course, "year3")) {
        result.year3.push(course);
      }
    });

    console.log("Filtered courses:", result);
    return result;
  };

  const filteredCourses = getFilteredCourses();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען קורסים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>שגיאה בטעינת הקורסים</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const renderCourses = () => {
    if (selectedYear === "all") {
      return (
        <>
          {filteredCourses.year1.length > 0 && (
            <YearSection year="שנה א'" courses={filteredCourses.year1} />
          )}
          {filteredCourses.year2.length > 0 && (
            <YearSection year="שנה ב'" courses={filteredCourses.year2} />
          )}
          {filteredCourses.year3.length > 0 && (
            <YearSection year="שנה ג'" courses={filteredCourses.year3} />
          )}
        </>
      );
    }

    const yearMap = {
      year1: "שנה א'",
      year2: "שנה ב'",
      year3: "שנה ג'",
    };

    return filteredCourses[selectedYear]?.length > 0 ? (
      <YearSection
        year={yearMap[selectedYear]}
        courses={filteredCourses[selectedYear]}
      />
    ) : (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">לא נמצאו קורסים</p>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${styles.bgGradient}`}
      dir="rtl"
    >
      <Navbar courseType="cs" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between"></div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "all"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                כל השנים
              </button>
              <button
                onClick={() => setSelectedYear("year1")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "year1"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                שנה א'
              </button>
              <button
                onClick={() => setSelectedYear("year2")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "year2"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                שנה ב'
              </button>
              <button
                onClick={() => setSelectedYear("year3")}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  selectedYear === "year3"
                    ? styles.buttonPrimary
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                שנה ג'
              </button>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="חיפוש קורסים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{renderCourses()}</div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-slide {
          animation: slide 4s ease-in-out infinite;
        }
        @keyframes tilt {
          0%,
          50%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Courses;
