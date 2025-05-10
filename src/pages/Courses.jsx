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
    ? (course.ratings.reduce((a, b) => a + b, 0) / course.ratings.length).toFixed(1)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="relative h-48">
        <img
          src={course.thumbnail_url || `https://videodelivery.net/${course.video_uid}/thumbnails/thumbnail.jpg?time=${course.thumbnail}s`}
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
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.video_title}</h3>
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
            <span className="text-gray-700">
              מרצה: {course.tutor_name}
            </span>
          </div>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
          onClick={() => navigate(`/course/${course.id}`)}
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
        <CourseCard 
          key={course.id} 
          course={course}
        />
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_video_thumbnail_data");
        if (error) throw error;
        
        // Group courses by year
        const groupedCourses = data.reduce((acc, course) => {
          const year = course.year || 1; // Default to year 1 if not specified
          if (!acc[`year${year}`]) {
            acc[`year${year}`] = [];
          }
          acc[`year${year}`].push(course);
          return acc;
        }, { year1: [], year2: [], year3: [] });

        setCoursesData(groupedCourses);
      } catch (err) {
        console.error("Error loading courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = {
    year1: coursesData.year1?.filter(course =>
      course.video_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
    year2: coursesData.year2?.filter(course =>
      course.video_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
    year3: coursesData.year3?.filter(course =>
      course.video_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tutor_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []
  };

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
            <YearSection 
              year="שנה א'" 
              courses={filteredCourses.year1}
            />
          )}
          {filteredCourses.year2.length > 0 && (
            <YearSection 
              year="שנה ב'" 
              courses={filteredCourses.year2}
            />
          )}
          {filteredCourses.year3.length > 0 && (
            <YearSection 
              year="שנה ג'" 
              courses={filteredCourses.year3}
            />
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