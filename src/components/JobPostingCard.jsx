import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Briefcase, Bell, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { courseStyles } from '../config/courseStyles';
import { jobChannelMappings } from '../config/courseMappings';

// Add useWindowSize hook at the top of the file
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const JobPostingsCard = ({ courseType = 'cs' }) => {
  const { width } = useWindowSize();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(width >= 1024);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const controls = useAnimation();
  const isMounted = useRef(false);

  const styles = courseStyles[courseType] || courseStyles.cs;

  const getJobTitle = () => {
    switch (courseType) {
      case 'cs':
        return 'משרות למדמ"ח';
      case 'ee':
        return 'משרות לחשמל';
      case 'ie':
        return 'משרות לתעשייה וניהול';
      default:
        return 'משרות';
    }
  };

  // Form submit function for subscribe modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError('נא להזין כתובת אימייל תקינה.');
      return;
    }
    setEmailError('');

    const formData = new FormData();
    formData.append('form-name', 'subscribe');
    formData.append('email', email);

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubscribeSuccess(true);
        setTimeout(() => {
          setShowSubscribeModal(false);
          setSubscribeSuccess(false);
          setEmail('');
        }, 2000);
      }
    } catch (error) {
      // Removed console.error
    }
  };

  // Helper function to format the date
  function formatDate(dateStr) {
    const [month, day, year] = dateStr.split("/");
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    isMounted.current = true;
  
    const sequence = async () => {
      await controls.start({
        y: [-20, 0],
        transition: { duration: 0.5, ease: "easeOut" }
      });
      // Only start the next animation if the component is still mounted
      if (isMounted.current) {
        controls.start({
          rotate: [0, 15, -10, 5, -5, 0],
          transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity }
        });
      }
    };
  
    sequence();
  
    return () => {
      isMounted.current = false;
    };
  }, [controls]);
  
  // Fetch jobs from the API
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const channelId = jobChannelMappings[courseType];
      if (!channelId) {
        setJobs([]);
        return;
      }
      
      const response = await fetch(process.env.REACT_APP_JOBS_API_URL);
      const data = await response.json();
      const jobsData = data[channelId];

      // Create a Set to track unique jobs using a composite key
      const uniqueJobs = new Map();
      
      if (Array.isArray(jobsData)) {
        jobsData.forEach(job => {
          const key = `${job.title}-${job.date}-${job.url}`;
          if (!uniqueJobs.has(key)) {
            uniqueJobs.set(key, {
              ...job,
              id: key // Using the composite key as the id
            });
          }
        });
      }
      
      // Convert Map values back to array and sort by date (newest first)
      const uniqueJobsArray = Array.from(uniqueJobs.values()).sort((a, b) => {
        const [aMonth, aDay, aYear] = a.date.split("/");
        const [bMonth, bDay, bYear] = b.date.split("/");
        return new Date(bYear, bMonth - 1, bDay) - new Date(aYear, aMonth - 1, aDay);
      });

      setJobs(uniqueJobsArray);
    } catch (error) {
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseType]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]); // Now fetchJobs only changes when courseType changes

  // Update isOpen when screen size changes
  useEffect(() => {
    setIsOpen(width >= 1024);
  }, [width]);

  return (
    <Card className={`mb-4 border bg-white relative ${styles.cardBorder}`}>
      {/* Bell bubble */}
      <motion.div
        initial={{ rotate: 0, y: 0 }}
        animate={controls}
        className={`absolute -top-4 -right-4 ${styles.buttonPrimary} rounded-full p-2 shadow-md border border-gray-200 cursor-pointer`}
        onClick={() => setShowSubscribeModal(true)}
      >
        <Bell className="h-5 w-5 text-white" />
      </motion.div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-160">
            <h2 className="text-xl font-bold mb-2 text-center">הרשמה לקבלת משרות</h2>
            <p className="mb-1 text-center">
              אם מעניין אתכם שליחה אוטומטית של קו״ח, עדכונים בלייב על משרות ושיפור שלהם עם בינה מלאכותית
            </p>
            <p className="mb-4 text-center">
              הזינו את המייל שלכם ואעדכן בפרטים בהמשך
            </p>
            
            {subscribeSuccess ? (
              <p className="text-green-600 text-center text-lg">הרשמה בוצעה בהצלחה!</p>
            ) : (
              <form
                name="subscribe"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="subscribe" />
                <input
                  type="email"
                  name="email"
                  className={`w-full p-2 border rounded mb-2 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="האימייל שלך"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {emailError && <p className="text-red-500 text-sm mb-2 text-center">{emailError}</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSubscribeModal(false)}>
                    ביטול
                  </Button>
                  <Button variant="inline" type="submit" className={`${styles.buttonPrimary} text-white`}>
                    אישור
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Card Header with Dropdown Toggle */}
      <CardHeader 
        className={width < 1024 ? "cursor-pointer" : ""}
        onClick={() => width < 1024 && setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center w-full">
          <CardTitle className={`text-2xl flex items-center gap-2 ${styles.textColor}`}>
            <Briefcase className={`h-6 w-6 ${styles.iconColor}`} />
            {getJobTitle()}
          </CardTitle>
          {/* Only show toggle icon on mobile */}
          {width < 1024 && (
            isOpen ? (
              <ChevronUp className={`h-6 w-6 ${styles.iconColor}`} />
            ) : (
              <ChevronDown className={`h-6 w-6 ${styles.iconColor}`} />
            )
          )}
        </div>
      </CardHeader>

      {/* Dropdown Content */}
      {isOpen && (
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${styles.iconColor}`}></div>
            </div>
          ) : !jobChannelMappings[courseType] ? (
            <div className="text-center p-8 text-gray-500">
              לא קיימות משרות כרגע
            </div>
          ) : (
            <div className="h-96 overflow-y-auto pr-1 space-y-3">
              {jobs.map(job => (
                <Card className={`rounded-lg ${styles.bgLight} p-4 flex items-center justify-between gap-4`} key={job.id || `job-${job.title}-${job.date}`}>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium ${styles.textColor} break-words`}>
                      {job.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.subjectBg} ${styles.textColor}`}>
                      {formatDate(job.date)}
                    </span>
                    <Button
                      className={`text-white ${styles.buttonPrimary} text-sm`}
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      להגשה
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default JobPostingsCard;
