import {Mail, Laptop, FileText, GraduationCap, Linkedin, ChevronDown, Copy, Check} from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/ui/card'
import CourseList from './components/CoursesList'
import HelpfulLinksSection from './components/HelpfulLinks'
import { useState, useEffect } from 'react'
import JobPostingsCard from './components/JobPostingCard'
import { supabase } from './lib/supabase'
import AuthButton from './components/AuthButton'
import TutorCard from './components/TutorCard'
import AdminPanel from './components/AdminPanel'
import { yearOneCourses, yearTwoCourses, yearThreeCourses, eeYearOneCourses, eeYearTwoCourses, eeYearThreeCourses, eeYearFourCourses } from './components/CoursesList'
import { NotificationProvider, showNotification } from './components/ui/notification'
import localData from './LocalData.json';

const csTutors = localData.csTutors;
const eeTutors = localData.eeTutors


const App = () => {
          const [courseType, setCourseType] = useState('cs'); // 'cs' for Computer Science, 'ee' for Electrical Engineering
          const [selectedTag, setSelectedTag] = useState('אין');
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
  const TUTORS_PER_PAGE = 6;
  
          const theme = courseType === 'cs' ? 'blue' : 'dark-purple';
          const bgGradient = courseType === 'cs' ? 'from-blue-50 to-white' : 'from-purple-50 to-white';
          const textColor = courseType === 'cs' ? 'text-blue-950' : 'text-purple-950';
          const buttonBg = courseType === 'cs' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-purple-800 hover:bg-purple-900';
          const buttonBorder = courseType === 'cs' ? 'border-blue-700' : 'border-purple-800';
  
          // EE specialization options
          const EE_SPECIALIZATIONS = [
            'בקרה',
            'ביו הנדסה',
            'תקשורת ועיבוד אותות',
            'אלקטרואופטיקה ומיקרואלקטרוניקה',
            'אנרגיה ומערכות הספק(זרם חזק)',
            'אנרגיות חלופיות ומערכות הספק משולב',
            'מערכות משובצות מחשב'
          ];


          const handleCourseSwitch = (type) => {
            setCourseType(type);
            if (type === 'cs') {
              setSelectedTag(null); // Reset selected tag when switching to CS
            }
            else {
              setSelectedTag('אין'); // Reset selected tag when switching to EE
            }
          };

  // Supabase authentication
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
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
      {
        threshold: 0.1
      }
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

  const calculateWilsonScore = (avg, count, maxRating = 5, z =1.96) => { // 1.96 for 95% confidence
    if (count === 0) return 0;
  
    const phat = avg; // already normalized!
    const n = count;
    // Prevent math errors on exact 0 or 1
    const safePhat = Math.min(Math.max(phat, 0.0001), 0.9999);
  
    const numerator =
      safePhat + (z ** 2) / (2 * n) -
      (z * Math.sqrt((safePhat * (1 - safePhat) + (z ** 2) / (4 * n)) / n));
  
    const denominator = 1 + ((z ** 2) / n);
  
    return numerator / denominator;

  };


  const scoreAndSortTutors = (tutors) => {
    const tutorsWithStats = tutors.map(tutor => {
      const validRatings = tutor.feedback?.filter(f => f.rating) || [];
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
        wilson_score
      };
    });
  
    // Sort by Wilson score descending
    const sorted = tutorsWithStats.sort((a, b) => b.wilson_score - a.wilson_score);
  
    return sorted;
  };
  

  // Tutor data loading
  const loadTutorsWithFeedback = async () => {
    setIsLoadingTutors(true);
    try {
      // Fetch tutors with their feedback using a single query
      const { data: tutors, error } = await supabase
        .from('tutors')
        .select(`
          *,
          feedback (
            id,
            user_id,
            email,
            rating,
            comment,
            created_at
          )
        `)
        .eq('degree', courseType);

      if (error) {
        // Removed console.error
        // Fallback to local data if there's an error
        const fallbackTutors = courseType === 'cs' ? csTutors : eeTutors;
        setTutorsWithFeedback(scoreAndSortTutors(fallbackTutors));
        return;
      }
      
      if (tutors && tutors.length > 0) {
        setTutorsWithFeedback(scoreAndSortTutors(tutors));
      }
       else {
        // Fallback to local data if no tutors in Supabase
        const fallbackTutors = courseType === 'cs' ? csTutors : eeTutors;
        setTutorsWithFeedback(scoreAndSortTutors(fallbackTutors));
      }
    } catch (error) {
      // Removed console.error
      // Fallback to local data on any error
      const fallbackTutors = courseType === 'cs' ? csTutors : eeTutors;
      setTutorsWithFeedback(scoreAndSortTutors(fallbackTutors));
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
      
      // First, check if user already has feedback for this tutor
      const { data: existingFeedback, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .eq('tutor_id', tutorId)
        .eq('user_id', user.id);

      if (fetchError) {
        showNotification('שגיאה בבדיקת ביקורות קיימות', 'error');
        return;
      }

      let error;
      
      // If rating is null, it means we're deleting the feedback
      if (rating === null) {
        // This is a refresh after deletion, just reload the data
        loadTutorsWithFeedback();
        return;
      } else if (existingFeedback && existingFeedback.length > 0) {
        // Update existing feedback
        ({ error } = await supabase
          .from('feedback')
          .update({ 
            rating, 
            comment,
            email: user.email // Add email when updating
          })
          .eq('id', existingFeedback[0].id));
      } else {
        // Insert new feedback
        ({ error } = await supabase
          .from('feedback')
          .insert([{
            tutor_id: tutorId,
            user_id: user.id,
            email: user.email, // Add email when creating
            rating,
            comment
          }]));
      }

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
    if (courseType === 'cs') {
      switch(year) {
        case 'שנה א': return yearOneCourses;
        case 'שנה ב': return yearTwoCourses;
        case 'שנה ג': return yearThreeCourses;
        default: return [];
      }
    } else {
      let courses = [];
      switch(year) {
        case 'שנה א': courses = eeYearOneCourses; break;
        case 'שנה ב': courses = eeYearTwoCourses; break;
        case 'שנה ג': courses = eeYearThreeCourses; break;
        case 'שנה ד': courses = eeYearFourCourses; break;
        default: courses = [];
      }
      
      // Filter courses based on specialization for years ג and ד
      if ((year === 'שנה ג' || year === 'שנה ד') && tutorSpecialization) {
        return courses.filter(course => 
          !course.tag || // Include general courses
          (Array.isArray(course.tag) && course.tag.includes(tutorSpecialization)) || // Handle array of tags
          course.tag === tutorSpecialization // Handle single tag
        );
      } else if ((year === 'שנה ג' || year === 'שנה ד')) {
        // If no specialization is selected, only show general courses
        return courses.filter(course => !course.tag);
      }
      
      return courses;
    }
  };

  const handleYearClick = (year) => {
    if (selectedYear === year) {
      setSelectedYear(null);
      setSelectedCourse(null);
      setTutorSpecialization('');
    } else {
      setSelectedYear(year);
      setSelectedCourse(null);
      
      // Reset specialization if not year ג or ד
      if (courseType === 'ee' && year !== 'שנה ג' && year !== 'שנה ד') {
        setTutorSpecialization('');
      }
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course === selectedCourse ? null : course);
  };

  const filteredTutors = tutorsWithFeedback.filter(tutor => {
    if (!selectedYear && !selectedCourse) return true;
    if (selectedCourse) {
      return tutor.subjects?.some(subject => subject.includes(selectedCourse));
    }
    return true;
  });
  

/*
  const sortTutorsByRating = (tutors) => {
    return [...tutors].sort((a, b) => {
      const ratingA = a.average_rating || 0;
      const ratingB = b.average_rating || 0;
      return ratingB - ratingA;
    });
  };
*/  
          return (
            <NotificationProvider>
            <div className={`min-h-screen bg-gradient-to-b ${bgGradient}`}>
              <main className="container mx-auto px-4 py-8">
                  <AdminPanel user={user} />
                <div className="flex flex-col items-center mb-4">
                  <h1 className={`text-5xl font-bold mb-4 text-center ${textColor}`}>CS24</h1>
                  <p className={`text-xl ${textColor} text-center`}>
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
                    <h2 className={`text-xl ${textColor}`}> פותח ע״י דניאל זיו  </h2>
                      <p> - </p>
                      <Linkedin strokeWidth={1} className="h-6 w-6" color="#0077B5"  />
                    </a>
                  </div>
                </div>

                {/* Course Type Selection Buttons */}
                <div className="flex flex-row gap-3 mt-4 justify-center mb-5">
                    <Button 
                      className={`px-6 py-2 text-lg font-medium rounded-md shadow-md transition-colors ${
                        courseType === 'cs' 
                          ? `${buttonBg} text-white`
                          : `bg-white hover:bg-${theme}-50 text-${theme}-700 ${buttonBorder}`
                      }`}
                      onClick={() => handleCourseSwitch('cs')}
                    >
                      מדעי המחשב
                    </Button>
                    <Button 
                      className={`px-6 py-2 text-lg font-medium rounded-md shadow-md transition-colors ${
                        courseType === 'ee' 
                          ? `${buttonBg} text-white`
                          : `bg-white hover:bg-${theme}-50 text-${theme}-700 ${buttonBorder}`
                      }`}
                      onClick={() => handleCourseSwitch('ee')}
                    >
                      הנדסת חשמל
                    </Button>
                </div>
              
          {/* Top Mobile Section - Jobs and Laptop */}
          <div className="block lg:hidden mb-4">
            {/* Job Postings Card */}
            <div className="mb-4">
              <JobPostingsCard courseType={courseType} />
            </div>
            
            {/* Laptop Section */}
            <Card className={`bg-gradient-to-r ${courseType === 'cs' ? 'from-blue-700 via-blue-800 to-blue-700' : 'from-purple-800 via-purple-950 to-purple-800'} shadow-xl hover:shadow-2xl transition-all border-2 ${buttonBorder}`}>
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
                  className={`w-full sm:w-auto bg-white hover:bg-blue-50 text-lg font-bold ${textColor} px-8 py-3 shadow-lg hover:scale-105 transition-transform`}
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
                    <Card className={`bg-gradient-to-r ${courseType === 'cs' ? 'from-blue-700 via-blue-800 to-blue-700' : 'from-purple-800 via-purple-950 to-purple-800'} shadow-xl hover:shadow-2xl transition-all border-2 ${buttonBorder} mb-4`}> 
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
                          className={`w-full sm:w-auto bg-white hover:bg-blue-50 text-lg font-bold ${textColor} px-8 py-3 shadow-lg hover:scale-105 transition-transform`}
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

          {/* Choose EE Specialty if chose EE */}
          {courseType === 'ee' && (
            <div className="flex flex-col items-center mb-4">
              <h2 className="text-xl font-bold text-purple-950 mb-2">התמחות</h2>
              <div className="relative inline-block text-left">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="appearance-none bg-white border border-purple-700 text-purple-700 px-4 py-2 pr-10 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="אין">עדיין אין</option>
                  <option value="בקרה">בקרה</option>
                  <option value="אלקטרואופטיקה ומיקרואלקטרוניקה">אלקטרואופטיקה ומיקרואלקטרוניקה</option>
                  <option value="ביו הנדסה">ביו הנדסה</option>
                  <option value="אנרגיה ומערכות הספק(זרם חזק)">אנרגיה ומערכות הספק(זרם חזק)</option>
                  <option value="אנרגיות חלופיות ומערכות הספק משולב">אנרגיות חלופיות ומערכות הספק משולב</option>
                  <option value="מערכות משובצות מחשב">מערכות משובצות מחשב</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-700">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}

          {/* Course List */}
        {courseType === 'cs' ? (
          <CourseList />
        ) : (
          <CourseList electricalEngineering={true} selectedTag={selectedTag} /> 
        )}

          {/* Links Section - Mobile (appears after course list) */}
          <div className="block lg:hidden mt-4">
            <HelpfulLinksSection courseType={courseType} />
                  </div>

          {/* New Tutors Section with Supabase Integration */}
      <Card className={`mb-8 bg-white ${courseType === 'cs' ? 'border-sky-200' : 'border-purple-200'}`}>
          <CardHeader className="px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className={`text-2xl md:text-3xl flex items-center gap-2 ${courseType === 'cs' ? 'text-sky-950' : 'text-purple-950'}`}>
                  <GraduationCap className={`h-6 w-6 md:h-8 md:w-8 ${courseType === 'cs' ? 'text-sky-600' : 'text-purple-600'}`} />
                  מורים פרטיים
          </CardTitle>
                <div className="flex-shrink-0">
                  <AuthButton user={user} courseType={courseType} />
                </div>
              </div>
              
              {/* Specialization dropdown for EE years ג and ד */}
              {courseType === 'ee' && selectedYear && (selectedYear === 'שנה ג' || selectedYear === 'שנה ד') && (
                <div className="mt-4 mb-3">
                  <label htmlFor="ee-specialization" className="block text-sm font-medium text-purple-700 mb-2">בחירת התמחות:</label>
                  <div className="relative">
                    <select
                      id="ee-specialization"
                      value={tutorSpecialization}
                      onChange={(e) => setTutorSpecialization(e.target.value)}
                      className="appearance-none w-full md:w-64 bg-white border border-purple-600 text-purple-800 py-2 px-4 pr-10 rounded-md shadow-md text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors hover:border-purple-700"
                    >
                      <option value="">ללא התמחות</option>
                      {EE_SPECIALIZATIONS.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-600">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Year filter buttons */}
              <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                {(courseType === 'cs' ? ['שנה א', 'שנה ב', 'שנה ג'] : ['שנה א', 'שנה ב', 'שנה ג', 'שנה ד']).map((year) => (
                  <Button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`text-sm sm:text-base px-3 py-2 font-medium ${
                      selectedYear === year 
                        ? courseType === 'cs'
                          ? 'bg-sky-600 text-white hover:bg-sky-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                        : courseType === 'cs'
                          ? 'bg-white text-sky-600 border border-sky-600 hover:bg-sky-50'
                          : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {year}
                  </Button>
                ))}
              </div>

              {/* Course list */}
              {selectedYear && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {getCoursesForYear(selectedYear).map((course) => (
                    <Button
                      key={course.id}
                      onClick={() => handleCourseClick(course.name)}
                      className={`text-sm px-3 py-1.5 ${
                        selectedCourse === course.name 
                          ? courseType === 'cs'
                            ? 'bg-sky-600 text-white hover:bg-sky-700'
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                          : courseType === 'cs'
                            ? 'bg-white text-sky-600 border border-sky-600 hover:bg-sky-50'
                            : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {course.name}
                    </Button>
                  ))}
                </div>
              )}
        </CardHeader>
        <CardContent>
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
                      />
                ))
              )}
          </div>

                {filteredTutors.length > TUTORS_PER_PAGE && !showAllTutors && (
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => setShowAllTutors(true)}
                      variant="outline"
                      className={`${
                        courseType === 'cs'
                          ? 'text-sky-600 hover:bg-sky-100'
                          : 'text-purple-600 hover:bg-purple-100'
                      }`}
                    >
                      הצג עוד {filteredTutors.length - TUTORS_PER_PAGE} מתרגלים
                    </Button>
              </div>
                )}
          </CardContent>
      </Card>

        {/* Missing Tests Banner */}
          <Card 
            id="missing-tests-section"
            className={`mb-8 bg-${courseType === 'cs' ? 'blue-50' : 'purple-50'} border-${courseType === 'cs' ? 'blue-200' : 'purple-200'} ${
              isVisible ? 'animate-bounce-gentle shadow-glow' : ''
            }`}
          >
          <CardHeader>
            <CardTitle className={`text-3xl flex items-center gap-2 justify-center ${courseType === 'cs' ? 'text-blue-950' : 'text-purple-950'}`}>
              <FileText className={`h-8 w-8 ${courseType === 'cs' ? 'text-blue-600' : 'text-purple-600'}`} aria-hidden="true" />
              <span>חוסרים</span>
            </CardTitle>
            <CardDescription className={`text-center text-lg ${courseType === 'cs' ? 'text-blue-800' : 'text-purple-800'}`}>
              יש לכם מבחנים שאינם נמצאים במאגר? נשמח שתשלחו לנו אותם
            </CardDescription>
          </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 px-4 sm:px-6">
              <div className={`relative flex items-center gap-2 px-6 py-3 rounded-lg ${courseType === 'cs' ? 'bg-blue-800' : 'bg-purple-800'}`}>
                <span className="text-base sm:text-lg text-white select-all">cs24.hit@gmail.com</span>
                <button
                  onClick={copyToClipboard}
                  className={`p-1.5 rounded-md transition-colors ${
                    courseType === 'cs' 
                      ? 'hover:bg-blue-700 active:bg-blue-600' 
                      : 'hover:bg-purple-700 active:bg-purple-600'
                  }`}
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
                <span className={`text-sm ${courseType === 'cs' ? 'text-blue-800' : 'text-purple-800'}`}>
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
              box-shadow: 0 0 15px ${courseType === 'cs' ? 'rgba(37, 99, 235, 0.3)' : 'rgba(147, 51, 234, 0.3)'};
              transition: box-shadow 0.3s ease-in-out;
            }
            
            .shadow-glow:hover {
              box-shadow: 0 0 25px ${courseType === 'cs' ? 'rgba(37, 99, 235, 0.5)' : 'rgba(147, 51, 234, 0.5)'};
            }
          `}</style>
      </main>
    </div>
    </NotificationProvider>
  );
};

export default App;