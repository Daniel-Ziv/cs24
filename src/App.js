import { Mail, Laptop, FileText, GraduationCap, Linkedin, ChevronDown, Copy, Check } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/ui/card';
import CoursesDropdown from './components/CoursesDropdown';
import HelpfulLinksSection from './components/HelpfulLinks';
import { useState, useEffect } from 'react';
import JobPostingsCard from './components/JobPostingCard';
import { supabase } from './lib/supabase';
import TutorCard from './components/TutorCard';
import AdminPanel from './components/AdminPanel';
import { NotificationProvider, showNotification } from './components/ui/notification';
import { courseStyles, courseTypeOptions } from './config/courseStyles';
import { courseMappings, specializationsMappings, tutorMappings } from './config/courseMappings';
import Navbar from './components/Navbar';
import AuthButton from './components/AuthButton';

const App = () => {
  const [courseType, setCourseType] = useState(() => {
    return localStorage.getItem('courseType') || 'cs';
  });
  const styles = courseStyles[courseType] || courseStyles.cs;

  const [selectedTag, setSelectedTag] = useState('בחר');
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [tutorsWithFeedback, setTutorsWithFeedback] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAllTutors, setShowAllTutors] = useState(false);
  const [tutorSpecialization, setTutorSpecialization] = useState('');
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [isLoadingTutors, setIsLoadingTutors] = useState(true);
  const [tutorsError, setTutorsError] = useState(null);
  const [degreeId, setDegreeId] = useState(null);
  const TUTORS_PER_PAGE = 6;
  const isDevMode = process.env.REACT_APP_DEV?.toLowerCase() === 'true';

  // Get specializations for current course type
  const currentSpecializations = specializationsMappings[courseType] || [];
  const DEGREE_NAMES = Object.fromEntries(
    courseTypeOptions.map(option => [option.type, option.label])
  );
  
  const handleCourseSwitch = (type) => {
    setCourseType(type);
    // Save courseType as a cookie
    localStorage.setItem('courseType', type);
    // Reset selected tag based on whether the course type has specializations
    setSelectedTag(specializationsMappings[type]?.length > 0 ? 'בחר' : null);
    // Reset other relevant states
    setSelectedYear(null);
    setSelectedCourse(null);
    setTutorSpecialization('');
  };

  // Supabase authentication
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });

    // Load tutors with feedback
    loadTutorsWithFeedback();

    return () => subscription.unsubscribe();
  }, []);

  // Intersection Observer for missing tests section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const missingSection = document.getElementById('missing-tests-section');
    if (missingSection) {
      observer.observe(missingSection);
    }

    return () => {
      if (missingSection) {
        observer.unobserve(missingSection);
      }
    };
  }, []);

  const calculateWilsonScore = (avg, count, maxRating = 5, z = 1.96) => {
    if (count === 0) return 0;
    const phat = avg; // already normalized!
    const n = count;
    // Prevent math errors on exact 0 or 1
    const safePhat = Math.min(Math.max(phat, 0.0001), 0.9999);
    const numerator =
      safePhat +
      (z ** 2) / (2 * n) -
      (z * Math.sqrt((safePhat * (1 - safePhat) + (z ** 2) / (4 * n)) / n));
    const denominator = 1 + (z ** 2) / n;
    return numerator / denominator;
  };

  const scoreAndSortTutors = (tutors) => {
    const tutorsWithStats = tutors.map((tutor) => {
      const validRatings = tutor.feedback?.filter((f) => f.rating) || [];
      const count = validRatings.length;
      const sum = validRatings.reduce((acc, f) => acc + f.rating, 0);
      const average_rating = count > 0 ? sum / count : null;
      const wilson_score = count > 0
        ? calculateWilsonScore(average_rating / 5, count)
        : 0;

      return {
        ...tutor,
        average_rating,
        feedback_count: count,
        wilson_score,
      };
    });

    // Sort by Wilson score descending
    const sorted = tutorsWithStats.sort((a, b) => b.wilson_score - a.wilson_score);
    return sorted;
  };

  // Tutor data loading
  const loadTutorsWithFeedback = async () => {
    setIsLoadingTutors(true);
    setTutorsError(null); // Clear any previous error

    // Helper for fallback tutors
    const fallback = () => {
      const fallbackTutors = tutorMappings[courseType] || [];
      setTutorsWithFeedback(scoreAndSortTutors(fallbackTutors));
    };

    // Helper for handling errors
    const handleError = (message) => {
      if (isDevMode) {
        fallback();
      } else {
        setTutorsError(message);
        setTutorsWithFeedback([]); // Clear tutors list if needed
      }
    };

    try {
      const { data: newDegreeId, error: degreeError } = await supabase.rpc(
        'get_degree_id_by_details',
        {
          p_degree_name: DEGREE_NAMES[courseType],
          p_academy_id: 1
        }
      );

     
      setDegreeId(newDegreeId);

      const { data: tutors, error } = await supabase
        .rpc('new_get_tutors_with_feedback', {
          p_degree_id: newDegreeId
        });

      if (error) return handleError("אין חיבור לשרת. נסה שוב מאוחר יותר.");
      if (!tutors) {
        return handleError("אין מורים להצגה כרגע.");
      }
      setTutorsWithFeedback(scoreAndSortTutors(tutors));
    } catch {
      handleError("שגיאה בטעינת נתונים מהשרת.");
    } finally {
      setIsLoadingTutors(false);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async (tutorId, rating, comment) => {
    if (!user) {
      showNotification('אנא התחבר כדי להשאיר ביקורת', 'warning');
      return;
    }

    try {
      // Validate comment on server side as well
      const MAX_COMMENT_LENGTH = 200;
      const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([^\s]+\.(com|org|net|il|co|io))/gi;

      if (comment && comment.length > MAX_COMMENT_LENGTH) {
        showNotification(`הערה ארוכה מדי. מוגבל ל-${MAX_COMMENT_LENGTH} תווים.`, 'error');
        return;
      }

      if (comment && urlRegex.test(comment)) {
        showNotification('לא ניתן להכניס קישורים בהערות.', 'error');
        return;
      }

      let error;

      // If rating is null, it means we're deleting the feedback
      if (rating === null) {
        ({ error } = await supabase
          .rpc('delete_feedback', {
            tutor_id: tutorId,
          }));

        if (error) {
          showNotification('שגיאה במחיקת הביקורת', 'error');
          return;
        }

        loadTutorsWithFeedback();
        showNotification('הביקורת נמחקה בהצלחה', 'success');
        return;
      }

      // Insert or update feedback using the server-side function
      ({ error } = await supabase
        .rpc('new_upsert_feedback', {
          tutor_id: tutorId,
          rating: rating,
          comment: comment,
          degree_id: degreeId,
          academy_id: 1
        }));

      if (error) {
        showNotification('שגיאה בשליחת הביקורת', 'error');
        return;
      }

      // Reload tutors with feedback
      loadTutorsWithFeedback();
      showNotification('הביקורת נשלחה בהצלחה', 'success');
    } catch (error) {
      showNotification('שגיאה בשליחת הביקורת', 'error');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('cs24.hit@gmail.com');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = 'cs24.hit@gmail.com';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    // Reload tutors when courseType changes
    loadTutorsWithFeedback();
  }, [courseType]);

  const getCoursesForYear = (year) => {
    const courses = courseMappings[courseType];
    // Add quote mark to year if it's not 'בחירה'
    const yearKey = year === 'רב-תחומי' ? year : year + "'";
    console.log('Looking for courses for year:', yearKey);
    console.log('Available years:', Object.keys(courses || {}));
    return courses?.[yearKey] || [];
  };

  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null);
      setSelectedCourse(null);
      setTutorSpecialization('');
    } else {
      setSelectedYear(year);
      setSelectedCourse(null);
      // Reset specialization if not year ג or ד and department has specializations
      if (specializationsMappings[courseType]?.length > 0 && year !== 'שנה ג' && year !== 'שנה ד') {
        setTutorSpecialization('');
      }
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course === selectedCourse ? null : course);
  };

  const filteredTutors = tutorsWithFeedback.filter((tutor) => {
    if (!selectedYear && !selectedCourse) return true;
    if (selectedCourse) {
      return tutor.subjects?.some(subject => 
        subject.course_name === selectedCourse
      );
    }
    return true;
  });

  return (
    <NotificationProvider>
      <div className={`min-h-screen bg-gradient-to-b ${styles.bgGradient}`}>
        { isDevMode && <Navbar courseType={courseType} /> }
        <main className={`container mx-auto px-4 py-8 ${ isDevMode && 'pt-24' }`}>
          <AdminPanel user={user} />
          <div className="flex flex-col items-center mb-4">
            <h1 className={`text-5xl font-bold mb-4 text-center ${styles.textColor}`}>CS24</h1>
            <p className={`text-xl ${styles.textColor} text-center`}>
              ברוכים הבאים למאגר המידע המקיף ביותר שהיה במכון הטכנולוגי חולון
            </p>
            <div className="flex items-center gap-3 group cursor-pointer">
              <a
                href="https://www.linkedin.com/in/daniel-ziv/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center transition-transform duration-300 hover:scale-110"
                title="בואו נתחבר"
              >
                <h2 className={`text-xl ${styles.textColor}`}>פותח ע״י דניאל זיו&nbsp;</h2>
                
                <Linkedin strokeWidth={1} className="h-6 w-6" color="#0077B5" />
              </a>
            </div>
          </div>
          {/* Course Type Selection Buttons */}
          <div className="flex flex-row flex-wrap gap-3 mt-4 justify-center mb-5">
            {courseTypeOptions
              .filter((option) => option.type)
              .map((option) => (
                <Button
                  key={option.type}
                  className={`px-6 py-2 text-lg font-medium rounded-md shadow-md transition-colors ${
                    courseType === option.type ? styles.buttonPrimary : styles.buttonSecondary
                  }`}
                  onClick={() => handleCourseSwitch(option.type)}
                >
                  {option.label}
                </Button>
              ))}
          </div>

          {/* Top Mobile Section - Jobs and Laptop */}
          <div className="block lg:hidden mb-4">
            {/* Job Postings Card */}
            <div className="mb-4">
              <JobPostingsCard courseType={courseType} />
            </div>

            {/* Laptop Section */}
            <Card className={`border-2 bg-gradient-to-r ${styles.cardBg} ${styles.cardBorder}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full sm:block">
                    <Laptop className="h-7 w-7 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                    לא יודעים איזה מחשב נייד לקנות?
                  </h3>
                </div>
                <Button
                  className={`w-full sm:w-auto bg-white hover:bg-blue-50 text-lg font-bold ${styles.textColor} px-8 py-3 shadow-lg hover:scale-105 transition-transform`}
                  onClick={() => window.open('https://toplaptop.net', '_blank')}
                >
                  לחצו כאן!
                </Button>
              </div>
            </Card>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-4 mb-2">
            {/* Job Postings Card - Left Column (1/3 width on desktop) */}
            <div className="lg:col-span-1">
              <JobPostingsCard courseType={courseType} />
            </div>

            {/* Right Column Content (2/3 width on desktop) */}
            <div className="lg:col-span-2">
              {/* Laptop Section */}
              <Card className={`bg-gradient-to-r ${styles.TLBg} shadow-xl hover:shadow-2xl transition-all mb-4`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full hidden sm:block">
                      <Laptop className="h-7 w-7 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                      לא יודעים איזה מחשב נייד לקנות?
                    </h3>
                  </div>
                  <Button
                    className={`w-full sm:w-auto bg-white hover:bg-blue-50 text-lg font-bold ${styles.textColor} px-8 py-3 shadow-lg hover:scale-105 transition-transform`}
                    onClick={() => window.open('https://toplaptop.net', '_blank')}
                  >
                    לחצו כאן!
                  </Button>
                </div>
              </Card>

              {/* Links Section - Desktop */}
              <HelpfulLinksSection courseType={courseType} />
            </div>
          </div>

          {/* Specialization dropdown */}
          {specializationsMappings[courseType]?.length > 0 && (
            <div className="flex flex-col items-center mb-4">
              <h2 className={`text-xl font-bold ${styles.textColor} mb-2`}>התמחות</h2>
              <div className="relative inline-block text-left">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className={`appearance-none bg-white border ${styles.textSecondary} px-4 py-2 pr-10 rounded-md shadow-md focus:outline-none focus:ring-2`}
                >
                  <option value="בחר">בחר</option>
                  {currentSpecializations.map((specialization) => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${styles.iconColor}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}

          {/* Course List */}
          <CoursesDropdown courseType={courseType} selectedTag={selectedTag} />

          {/* Links Section - Mobile (appears after course list) */}
          <div className="block lg:hidden mt-4">
            <HelpfulLinksSection courseType={courseType} />
          </div>

          {/* Tutors Section with Supabase Integration */}
          <Card className={`mb-8 border bg-white ${styles.cardBorder}`}>
            <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className={`text-2xl md:text-3xl flex items-center gap-2 ${styles.textColor}`}>
                  <GraduationCap className={`h-6 w-6 md:h-8 md:w-8 ${styles.iconColor}`} />
                  מורים פרטיים
                </CardTitle>
                <div className="flex-shrink-0">
                  {tutorsError ? (
                    <div className="opacity-50 cursor-not-allowed pointer-events-none">
                      <AuthButton courseType={courseType} disabled />
                    </div>
                  ) : (
                    <AuthButton courseType={courseType} />
                  )}
                </div>
              </div>
              {/* Specialization dropdown for years ג and ד */}
              {specializationsMappings[courseType]?.length > 0 &&
                selectedYear &&
                (selectedYear === 'שנה ג' || selectedYear === 'שנה ד') && (
                  <div className="mt-4 mb-3">
                    <label htmlFor="specialization" className={`block text-sm font-medium ${styles.textColor} mb-2`}>
                      בחירת התמחות:
                    </label>
                    <div className="relative">
                      <select
                        id="specialization"
                        value={tutorSpecialization}
                        onChange={(e) => setTutorSpecialization(e.target.value)}
                        className={`appearance-none w-full md:w-64 bg-white border ${styles.textSecondary} py-2 px-4 pr-10 rounded-md shadow-md text-base focus:outline-none focus:ring-2 transition-colors`}
                      >
                        <option value="">ללא התמחות</option>
                        {specializationsMappings[courseType].map((spec) => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${styles.iconColor}`}>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                )}
              {/* Year filter buttons */}
              {!tutorsError && (
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                  {Object.keys(courseMappings[courseType] || {})
                    .filter((year) => year !== 'רב-תחומי')
                    .map((year) => (
                      <Button
                        key={year}
                        onClick={() => handleYearClick(year)}
                        className={`text-sm sm:text-base px-3 py-2 border font-medium shadow-md ${styles.cardBorderStrong} ${
                          selectedYear === year
                            ? styles.iconColorReverse
                            : styles.buttonSecondary
                        }`}
                      >
                        {year}
                      </Button>
                    ))}
                </div>
              )}
              {/* Course list */}
              {selectedYear && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {getCoursesForYear(selectedYear.replace("'", "")).map((course) => (
                    <Button
                      key={course.id}
                      onClick={() => handleCourseClick(course.name)}
                      className={`text-sm px-3 border py-1.5 shadow-md ${styles.cardBorderStrong} ${
                        selectedCourse === course.name
                          ? styles.iconColorReverse
                          : styles.buttonSecondary
                      }`}
                    >
                      {course.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {tutorsError ? (
                <div className={`p-4 rounded-md text-center ${styles.cardBg} ${styles.cardBorder}`}>
                  {tutorsError}
                </div>
              ) : (
                <>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {isLoadingTutors ? (
                      // Loading skeleton
                      <>
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                          </div>
                        ))}
                      </>
                    ) : (
                      filteredTutors
                        .slice(0, showAllTutors ? undefined : TUTORS_PER_PAGE)
                        .map((tutor) => (
                          <TutorCard
                            key={tutor.id}
                            tutor={tutor}
                            courseType={courseType}
                            user={user}
                            onSubmitFeedback={handleSubmitFeedback}
                            loadTutorsWithFeedback={loadTutorsWithFeedback}
                          >
                            <div className="flex flex-wrap gap-1.5 -mx-0.5">
                              {tutor.subjects?.map((subject, index) => (
                                <span
                                  key={index}
                                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${styles.subjectBg} ${styles.textSecondary}`}
                                >
                                  {subject.course_name}
                                </span>
                              ))}
                            </div>
                          </TutorCard>
                        ))
                    )}
                  </div>
                  {filteredTutors.length > TUTORS_PER_PAGE && !showAllTutors && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => setShowAllTutors(true)}
                        variant="outline"
                        className={`${styles.buttonThird}`}
                      >
                        הצג עוד {filteredTutors.length - TUTORS_PER_PAGE} מתרגלים
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Missing Tests Banner */}
          <Card
            id="missing-tests-section"
            className={`mb-8 border ${styles.bgLight} ${styles.cardBorder} ${
              isVisible ? 'animate-bounce-gentle shadow-glow' : ''
            }`}
          >
            <CardHeader>
              <CardTitle className={`text-3xl flex items-center gap-2 justify-center ${styles.textColor}`}>
                <FileText className={`h-8 w-8 ${styles.iconColor}`} aria-hidden="true" />
                <span>חוסרים</span>
              </CardTitle>
              <CardDescription className={`text-center text-lg ${styles.textColor}`}>
                יש לכם מבחנים שאינם נמצאים במאגר? נשמח שתשלחו לנו אותם
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 px-4 sm:px-6">
              <div className={`relative flex items-center gap-2 px-6 py-3 rounded-lg ${styles.buttonMissing}`}>
                <span className="text-base sm:text-lg text-white select-all">cs24.hit@gmail.com</span>
                <button
                  onClick={copyToClipboard}
                  className={`p-1.5 rounded-md transition-colors ${styles.buttonPrimary}`}
                  aria-label="העתק לזכרון"
                >
                  {copySuccess ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <Copy className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
              <div
                className={`flex items-center justify-center ${
                  copySuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                } transition-all duration-200`}
              >
                <span className={`text-sm ${styles.textColor}`}>
                  הכתובת הועתקה בהצלחה!
                </span>
              </div>
            </CardContent>
          </Card>

          <style jsx global>{`
            @keyframes bounce-gentle {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }

            .animate-bounce-gentle {
              animation: bounce-gentle 2s infinite;
            }
            .shadow-glow {
              box-shadow: 0 0 15px ${styles.shadowGlow};
              transition: box-shadow 0.3s ease-in-out;
            }

            .shadow-glow:hover {
              box-shadow: 0 0 25px ${styles.shadowGlowHover};
            }
          `}</style>
        </main>
      </div>
    </NotificationProvider>
  );
};

export default App;