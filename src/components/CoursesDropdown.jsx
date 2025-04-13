import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { courseMappings } from '../config/courseMappings';
import { courseStyles } from '../config/courseStyles';

const YearSection = ({ title, courses, selectedTag, courseType = 'cs', styles }) => {
  const [isOpen, setIsOpen] = useState(false);



  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${styles.buttonPrimary} text-white p-4 rounded-lg flex justify-between items-center transition-colors`}
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
                  className={`block bg-gray-50 transition-all duration-300 border ${styles.cardBorder} rounded-lg shadow-md`}
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
                      className={`px-4 py-1.5 ${styles.buttonPrimary} text-white rounded-md transition-colors text-sm font-medium whitespace-nowrap shrink-0 mt-0.5`}
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
                  className={`block bg-white ${styles.hoverBgLight} transition-all duration-300 border ${styles.cardBorder} rounded-lg shadow-md hover:shadow-lg`}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 min-h-[2rem]">
                      <div className={`${styles.bgLight} p-1.5 rounded-md `}>
                        <BookOpen className={`h-5 w-5 ${styles.iconColor} shrink-0`} />
                      </div>
                      <h3 className={`text-lg font-medium ${styles.textColor}`}>{course.name}</h3>
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

const CoursesDropdown = ({ courseType, selectedTag}) => {
  const styles = courseStyles[courseType] || courseStyles.cs;
  const courses = courseMappings[courseType] || {};

  return (
    <div className={`mb-4 ${styles.bgGradient}`}>
      {Object.entries(courses).map(([year, courseList]) => (
        <YearSection
          key={year}
          title={year}
          courses={courseList}
          selectedTag={selectedTag}
          courseType={courseType}
          styles={styles}
        />
      ))}
    </div>
  );
};

// Explanation: The `CoursesList` component dynamically fetches courses based on the selected course type (`cs`, `ee`, or `ie`).
// It uses the `courseMappings` object to map years to their respective course lists, ensuring scalability and maintainability.

export default CoursesDropdown;