import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { csYearOneCourses, csYearTwoCourses, csYearThreeCourses } from '../config/CoursesLinks';

const GpaCalc = () => {
  const [selectedYear, setSelectedYear] = useState("שנה א'");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [grades, setGrades] = useState({});
  const [gpa, setGpa] = useState(0);

  const getCoursesForYear = (year) => {
    switch (year) {
      case "שנה א'":
        return csYearOneCourses;
      case "שנה ב'":
        return csYearTwoCourses;
      case "שנה ג'":
        return csYearThreeCourses;
      default:
        return [];
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedCourses([]);
    setGrades({});
    setGpa(0);
  };

  const handleCourseSelect = (course) => {
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleGradeChange = (courseId, grade) => {
    setGrades({
      ...grades,
      [courseId]: grade
    });
  };

  const calculateGPA = () => {
    if (selectedCourses.length === 0) return 0;
    
    const totalPoints = selectedCourses.reduce((sum, course) => {
      const grade = grades[course.id] || 0;
      return sum + grade;
    }, 0);
    
    return (totalPoints / selectedCourses.length).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
        <Navbar/>
        <h1 className="text-2xl font-bold mb-4">מחשבון ממוצע</h1>
        
        <div className="mb-4">
            <label className="block mb-2">בחר שנה:</label>
            <select 
            value={selectedYear} 
            onChange={handleYearChange}
            className="border p-2 rounded"
            >
            <option value="שנה א'">שנה א'</option>
            <option value="שנה ב'">שנה ב'</option>
            <option value="שנה ג'">שנה ג'</option>
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <h2 className="text-xl font-semibold mb-2">קורסים זמינים</h2>
            <div className="space-y-2">
                {getCoursesForYear(selectedYear).map(course => (
                <div 
                    key={course.id}
                    className={`p-2 border rounded cursor-pointer ${
                    selectedCourses.find(c => c.id === course.id) ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleCourseSelect(course)}
                >
                    {course.name}
                </div>
                ))}
            </div>
            </div>

            <div>
            <h2 className="text-xl font-semibold mb-2">קורסים נבחרים</h2>
            <div className="space-y-2">
                {selectedCourses.map(course => (
                <div key={course.id} className="p-2 border rounded">
                    <div className="flex justify-between items-center">
                    <span>{course.name}</span>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[course.id] || ''}
                        onChange={(e) => handleGradeChange(course.id, parseInt(e.target.value))}
                        className="w-20 p-1 border rounded"
                        placeholder="ציון"
                    />
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold">ממוצע: {calculateGPA()}</h2>
        </div>
        </div>
    );
    };

    export default GpaCalc;