import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { csYearOneCourses, csYearTwoCourses, csYearThreeCourses } from '../config/CoursesLinks';
import { courseStyles } from '../config/courseStyles';
import { ChevronDown } from 'lucide-react';
import { NotificationProvider, showNotification } from '../components/ui/notification';

const GpaCalc = () => {
  const [selectedYear, setSelectedYear] = useState("שנה א'");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [grades, setGrades] = useState({});
  const [gpa, setGpa] = useState(0);
  const [courseType, setCourseType] = useState(() => {
    return localStorage.getItem('courseType') || 'cs';
  });
  const styles = courseStyles[courseType] || courseStyles.cs;

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
    
    const gpaValue = totalPoints / selectedCourses.length;
    
    if (gpaValue % 1 === 0) {
      return gpaValue.toString();
    } else {
      return gpaValue.toFixed(2);
    }
  };

  const handleAverageClick = () => {
    const avg = calculateGPA();
  
    navigator.clipboard
      .writeText(avg.toString())
      .then(() => showNotification('הועתק בהצלחה!', 'success'))
      .catch(() => showNotification('ההעתקה כשלה...', 'error'));
  };

  return (
    <NotificationProvider>
      <div className={`min-h-screen ${styles.bgLight}`}>
        <Navbar courseType={courseType} />
        <div className={`container mx-auto px-4 pb-8 pt-24`}>

            <h1 className={`text-2xl font-bold mb-4 ${styles.textColor}`}>מחשבון ממוצע</h1>
            
            <div className="flex flex-row items-center mb-4 gap-5">
                <label className={`text-xl font-bold ${styles.textColor}`}>בחר שנה:</label>
                
                <div className="relative inline-block text-left">
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className={`appearance-none bg-white ${styles.textSecondary} px-4 py-2 pl-10 rounded-md shadow-md focus:outline-none transition ${styles.ringColor} ring-0 hover:ring-2`}
                  >
                    <option value="שנה א'">שנה א'</option>
                    <option value="שנה ב'">שנה ב'</option>
                    <option value="שנה ג'">שנה ג'</option>
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 ${styles.iconColor}`}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <h2 className={`text-xl font-semibold mb-2 ${styles.textColor}`}>קורסים זמינים</h2>
                <div className="flex flex-col border h-[398px] overflow-y-auto rounded-lg">
                    {getCoursesForYear(selectedYear).map(course => (
                    <div 
                        key={course.id}
                        className={`px-6 py-2 text-lg font-medium transition-colors cursor-pointer ${
                        selectedCourses.find(c => c.id === course.id) ? styles.buttonPrimary : styles.buttonSecondary
                        }`}
                        onClick={() => handleCourseSelect(course)}
                    >
                        {course.name}
                    </div>
                    ))}
                </div>
                </div>

                <div>
                <h2 className={`text-xl font-semibold mb-2 ${styles.textColor}`}>קורסים נבחרים</h2>
                <div className="space-y-2">
                    <div className={`pr-4 pl-2 py-2 rounded-lg shadow-md bg-gradient-to-r ${styles.buttonLoginGradient}`}>
                      <div className="flex justify-between items-center">
                      <h2 className={`text-xl font-bold text-white`}>ממוצע</h2>
                      <input readOnly onClick={handleAverageClick} type="number" min="0"
                            max="100" value={calculateGPA()} className={`w-[81px] p-1 pr-3 rounded-md text-xl font-bold text-white ${styles.buttonAverageBg} focus:outline-none transition hover:ring-2 ${styles.buttonAverageRingColor} cursor-pointer`} />
                        </div>
                    </div>
                    {selectedCourses.map(course => (
                    <div key={course.id} className="pr-4 pl-2 py-2 rounded-lg bg-white transition-shadow shadow-md hover:shadow-lg">
                        <div className="flex justify-between items-center">
                        <span className={`${styles.textColor}`}>{course.name}</span>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={grades[course.id] || ''}
                            onChange={(e) => handleGradeChange(course.id, parseInt(e.target.value))}
                            className={`w-[81px] p-1 pr-3 border rounded-md focus:outline-none transition ${styles.ringColor} ring-0 hover:ring-2`}
                            placeholder="ציון"
                        />
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
          </div>
        </NotificationProvider>
    );
    };

    export default GpaCalc;