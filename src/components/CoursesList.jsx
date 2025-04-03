import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { yearOneCourses, yearTwoCourses, yearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses,choosingCourses } from './CoursesListLinks'

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