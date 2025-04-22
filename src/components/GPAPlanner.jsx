import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { courseStyles } from '../config/courseStyles';

const GPAPlanner = () => {
  const location = useLocation();
  const courseType = location.state?.courseType || 'cs';
  const styles = courseStyles[courseType];
  const [semesters, setSemesters] = useState([createNewSemester()]);

  function createNewSemester() {
    return {
      courses: [{ name: '', grade: '', credits: '' }],
    };
  }

  const addSemester = () => {
    setSemesters([...semesters, createNewSemester()]);
  };

  const removeSemester = (index) => {
    setSemesters(semesters.filter((_, i) => i !== index));
  };

  const handleCourseChange = (semesterIndex, courseIndex, field, value) => {
    const updated = [...semesters];
    updated[semesterIndex].courses[courseIndex][field] = value;
    setSemesters(updated);
  };

  const addCourse = (semesterIndex) => {
    const updated = [...semesters];
    updated[semesterIndex].courses.push({ name: '', grade: '', credits: '' });
    setSemesters(updated);
  };

  const removeCourse = (semesterIndex, courseIndex) => {
    const updated = [...semesters];
    updated[semesterIndex].courses.splice(courseIndex, 1);
    setSemesters(updated);
  };

  const calcSemesterGPA = (semester) => {
    const valid = semester.courses.filter(c => c.grade && c.credits);
    const total = valid.reduce((sum, c) => sum + (parseFloat(c.grade) * parseFloat(c.credits)), 0);
    const credits = valid.reduce((sum, c) => sum + parseFloat(c.credits), 0);
    return credits ? (total / credits).toFixed(2) : '0.00';
  };

  const calcTotalGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach((semester) => {
      semester.courses.forEach((c) => {
        if (c.grade && c.credits) {
          totalPoints += parseFloat(c.grade) * parseFloat(c.credits);
          totalCredits += parseFloat(c.credits);
        }
      });
    });
    return totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 80) return 'bg-green-400';
    if (gpa >= 70) return 'bg-yellow-300';
    if (gpa === 0) return 'bg-zinc-300';
    return 'bg-red-400';
  };

  const totalGPA = parseFloat(calcTotalGPA());

  return (
    <div dir="rtl" className={`min-h-screen bg-gradient-to-b ${styles.bgGradient} p-4 font-sans flex justify-center items-start`}>
      <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-lg">
        {semesters.map((semester, sIdx) => (
          <div key={sIdx} className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">סמסטר {sIdx + 1}</h3>
              <button onClick={() => removeSemester(sIdx)} className="text-red-500 text-lg">×</button>
            </div>
            {semester.courses.map((course, cIdx) => (
              <div key={cIdx} className="grid grid-cols-12 gap-2 items-center mb-2">
                <button onClick={() => removeCourse(sIdx, cIdx)} className="text-red-500 col-span-1">×</button>
                <input
                  type="number"
                  placeholder="נקז"
                  min="0"
                  value={course.credits}
                  onChange={(e) => handleCourseChange(sIdx, cIdx, 'credits', e.target.value)}
                  className="border rounded px-2 py-1 text-sm col-span-2"
                />
                <input
                  type="number"
                  placeholder="ציון (0–100)"
                  min="0"
                  max="100"
                  value={course.grade}
                  onChange={(e) => handleCourseChange(sIdx, cIdx, 'grade', e.target.value)}
                  className="border rounded px-2 py-1 text-sm col-span-2"
                />
                <input
                  type="text"
                  placeholder="שם קורס"
                  value={course.name}
                  onChange={(e) => handleCourseChange(sIdx, cIdx, 'name', e.target.value)}
                  className="border rounded px-2 py-1 text-sm col-span-7"
                />
              </div>
            ))}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm font-bold">ממוצע לסמסטר {sIdx + 1}: {calcSemesterGPA(semester)}</p>
              <button
                onClick={() => addCourse(sIdx)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${styles.buttonPrimary}`}
              >
                הוסף קורס <span className="ml-2">＋</span>
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={addSemester}
            className={`rounded-full px-4 py-2 text-sm font-bold ${styles.buttonPrimary}`}
          >
            הוסף סמסטר <span className="ml-2">＋</span>
          </button>

          <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-lg font-bold text-black shadow-inner ${getGPAColor(totalGPA)}`}>
              {totalGPA}
            </div>
            <p className="text-sm mt-2">ממוצע מצטבר</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPAPlanner;
