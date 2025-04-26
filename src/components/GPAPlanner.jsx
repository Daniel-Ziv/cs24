import React, { useState } from 'react';
import courses from '../lib/courses.js';
const GPAPlanner = () => {
  // State for completed courses (array of course names)
  const [selectedCourses, setSelectedCourses] = useState([]);
  // State for current GPA input
  const [currentGPA, setCurrentGPA] = useState('');
  // State for target GPA input
  const [goalGPA, setGoalGPA] = useState('');
  // State for calculation result message
  const [result, setResult] = useState(null);
  // State for calculation mode: "total" or "nextExams"
  const [mode, setMode] = useState('total');
  // State for planned future courses (array of course names)
  const [futureCourses, setFutureCourses] = useState([]);
  // State to toggle future course selection UI
  const [addingFuture, setAddingFuture] = useState(false);
  // State for selected year in future course picker
  const [selectedYearForFuture, setSelectedYearForFuture] = useState(null);

  const years = [1, 2, 3, 0]; // Years 1-3 and 0 for multi-disciplinary courses
  const semesters = ['א', 'ב']; // Semesters A and B

  // Helper to calculate semester number from year and semester label
  const getSemesterNumber = (year, semLabel) => {
    if (year === 0) return 0;
    return (year - 1) * 2 + (semLabel === 'א' ? 1 : 2);
  };

  // Toggle a single course in selectedCourses
  const toggleCourse = (courseName) => {
    setSelectedCourses((prev) =>
      prev.includes(courseName)
        ? prev.filter((name) => name !== courseName)
        : [...prev, courseName]
    );
  };

  // Toggle all courses in a semester
  const toggleSemester = (year, semLabel) => {
    const semNum = getSemesterNumber(year, semLabel);
    const semCourses = courses
      .filter((c) => c.semesterNumber === semNum)
      .map((c) => c.name);

    const allSelected = semCourses.every((name) => selectedCourses.includes(name));

    setSelectedCourses((prev) =>
      allSelected
        ? prev.filter((name) => !semCourses.includes(name))
        : [...new Set([...prev, ...semCourses])]
    );
  };

  // Toggle all courses in a year
  const toggleYear = (year) => {
    const yearCourses = courses
      .filter((c) =>
        year === 0
          ? c.semesterNumber === 0
          : Math.floor((c.semesterNumber + 1) / 2) === year
      )
      .map((c) => c.name);

    const allSelected = yearCourses.every((name) => selectedCourses.includes(name));

    setSelectedCourses((prev) =>
      allSelected
        ? prev.filter((name) => !yearCourses.includes(name))
        : [...new Set([...prev, ...yearCourses])]
    );
  };

  // Enable future course selection UI
  const handleAddFuture = () => {
    setAddingFuture(true);
    setSelectedYearForFuture(null);
  };

  // Toggle a future course in futureCourses
  const handleToggleFutureCourse = (courseName) => {
    setFutureCourses((prev) =>
      prev.includes(courseName)
        ? prev.filter((c) => c !== courseName)
        : [...prev, courseName]
    );
  };

  // Calculate required GPA for either mode
  const calculateRequiredAvg = () => {
    const current = parseFloat(currentGPA);
    const goal = parseFloat(goalGPA);

    // Validate GPA inputs
    if (
      isNaN(current) ||
      current < 0 ||
      current > 100 ||
      isNaN(goal) ||
      goal < 0 ||
      goal > 100
    ) {
      setResult('נא להזין ממוצעים חוקיים בין 0 ל־100');
      return;
    }

    // Get completed courses and their credits
    const selected = courses.filter((c) => selectedCourses.includes(c.name));
    const creditsDone = selected.reduce((sum, c) => sum + c.points, 0);

    if (mode === 'nextExams') {
      // Handle "nextExams" mode: calculate GPA needed in planned courses
      const planned = courses.filter((c) => futureCourses.includes(c.name));
      const creditsPlanned = planned.reduce((sum, c) => sum + c.points, 0);

      // Ensure at least one future course is selected
      if (creditsPlanned <= 0) {
        setResult('לא נבחרו קורסים עתידיים לחישוב.');
        return;
      }

      // Formula: requiredAvg = goal + (goal - current) * (creditsDone / creditsPlanned)
      const requiredAvg = goal + (goal - current) * (creditsDone / creditsPlanned);

      if (requiredAvg > 100) {
        setResult('המטרה אינה אפשרית, נדרש ציון מעל 100 בקורסים העתידיים.');
        return;
      }

      setResult(
        `כדי להגיע לממוצע ${goal} — עליך להוציא ממוצע ${requiredAvg.toFixed(2)} בקורסים העתידיים.`
      );
    } else {
      // Handle "total" mode: calculate GPA needed in all remaining courses
      const remaining = courses.filter((c) => !selectedCourses.includes(c.name));
      const creditsRemaining = remaining.reduce((sum, c) => sum + c.points, 0);

      // Ensure there are remaining credits
      if (creditsRemaining <= 0) {
        setResult('אין נק״ז שנותרו לחישוב — כולם נבחרו.');
        return;
      }

      const totalCredits = creditsDone + creditsRemaining;
      // Formula: requiredAvg = (goal * totalCredits - current * creditsDone) / creditsRemaining
      const requiredAvg = (goal * totalCredits - current * creditsDone) / creditsRemaining;

      if (requiredAvg > 100) {
        setResult('המטרה אינה אפשרית, נדרש ציון מעל 100 בשאר הקורסים.');
        return;
      }

      setResult(
        `כדי להגיע לממוצע ${goal} — עליך להוציא ממוצע ${requiredAvg.toFixed(2)} בשאר הקורסים.`
      );
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'sans-serif', background: '#f0f4ff', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ color: '#1e3a8a', textAlign: 'center', marginBottom: '1rem' }}>
        מחשבון ממוצע
      </h1>

      <div style={{ maxWidth: '900px', margin: 'auto' }}>
        {/* Mode selector */}
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <label style={{ marginInlineEnd: '0.5rem' }}>בחר מצב חישוב:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
            }}
          >
            <option value="total">ממוצע לכל התואר</option>
            <option value="nextExams">ממוצע למבחנים הקרובים</option>
          </select>
        </div>

        {/* Course selection by year and semester */}
        {years.map((year) => (
          <details
            key={year}
            style={{ marginBottom: '1rem', background: 'white', borderRadius: '8px', padding: '0.5rem' }}
          >
            <summary
              style={{
                cursor: 'pointer',
                color: '#1e3a8a',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{year === 0 ? 'רב תחומי' : `שנה ${year}`}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleYear(year);
                }}
                style={{
                  background: '#3b82f6',
                  border: 'none',
                  color: '#fff',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                בחר את כל השנה
              </button>
            </summary>

            {year !== 0 ? (
              semesters.map((sem) => {
                const semNum = getSemesterNumber(year, sem);
                const semCourses = courses.filter((c) => c.semesterNumber === semNum);

                return (
                  <div key={sem} style={{ marginTop: '1rem' }}>
                    <strong>סמסטר {sem}</strong>{' '}
                    <button
                      onClick={() => toggleSemester(year, sem)}
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        padding: '0.2rem 0.5rem',
                        marginInlineStart: '0.5rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      בחר את כל הסמסטר
                    </button>
                    {semCourses.map((course) => (
                      <label key={course.name} style={{ display: 'block', margin: '0.25rem 0' }}>
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.name)}
                          onChange={() => toggleCourse(course.name)}
                        />{' '}
                        {course.name} ({course.points} נק"ז)
                      </label>
                    ))}
                  </div>
                );
              })
            ) : (
              <div style={{ marginTop: '1rem' }}>
                {courses
                  .filter((c) => c.semesterNumber === 0)
                  .map((course) => (
                    <label key={course.name} style={{ display: 'block', margin: '0.25rem 0' }}>
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.name)}
                        onChange={() => toggleCourse(course.name)}
                      />{' '}
                      {course.name} ({course.points} נק"ז)
                    </label>
                  ))}
              </div>
            )}
          </details>
        ))}

        {/* Future course selection for "nextExams" mode */}
        {mode === 'nextExams' && (
          <div style={{ margin: '2rem 0' }}>
            <button
              onClick={handleAddFuture}
              style={{
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
              }}
            >
              + הוסף קורס לבחינה קרובה
            </button>

            {addingFuture && (
              <div style={{ marginTop: '1rem' }}>
                <label>בחר שנה:</label>
                <select
                  onChange={(e) => setSelectedYearForFuture(parseInt(e.target.value))}
                  style={{ padding: '0.5rem', margin: '0.5rem 0' }}
                >
                  <option value="">-- בחר --</option>
                  {[1, 2, 3, 0].map((year) => (
                    <option key={year} value={year}>
                      {year === 0 ? 'רב תחומי' : `שנה ${year}`}
                    </option>
                  ))}
                </select>

                {selectedYearForFuture !== null && (
                  <div style={{ marginTop: '0.5rem' }}>
                    {courses
                      .filter((c) => {
                        if (selectedCourses.includes(c.name) || futureCourses.includes(c.name))
                          return false;
                        if (selectedYearForFuture === 0) return c.semesterNumber === 0;
                        return Math.floor((c.semesterNumber + 1) / 2) === selectedYearForFuture;
                      })
                      .map((course) => (
                        <label key={course.name} style={{ display: 'block', margin: '0.25rem 0' }}>
                          <input
                            type="checkbox"
                            checked={futureCourses.includes(course.name)}
                            onChange={() => handleToggleFutureCourse(course.name)}
                          />{' '}
                          {course.name} ({course.points} נק"ז)
                        </label>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GPA input and calculation section */}
        <div style={{ marginTop: '2rem', background: '#fff', padding: '1rem', borderRadius: '6px' }}>
          <h3 style={{ color: '#1e3a8a' }}>חישוב ממוצע</h3>
          <label>הממוצע הנוכחי שלך:</label>
          <input
            type="number"
            value={currentGPA}
            onChange={(e) => setCurrentGPA(e.target.value)}
            min={0}
            max={100}
            placeholder="למשל 85"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <label>ממוצע יעד:</label>
          <input
            type="number"
            value={goalGPA}
            onChange={(e) => setGoalGPA(e.target.value)}
            min={0}
            max={100}
            placeholder="למשל 90"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button
            onClick={calculateRequiredAvg}
            style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            חשב
          </button>
          {result && (
            <div
              style={{
                marginTop: '1rem',
                background: '#d1fae5',
                padding: '1rem',
                borderRadius: '6px',
                color: '#065f46',
              }}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPAPlanner;