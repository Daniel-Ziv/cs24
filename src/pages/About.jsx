import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaEnvelope, FaLinkedin, FaBook, FaUserGraduate, FaTools, FaFilter, FaBriefcase, FaCalculator, FaUniversity, FaUsers, FaFileAlt, FaCode as FaCodeIcon, FaStar } from 'react-icons/fa';
import { FaBullseye, FaCode, FaLightbulb, FaChartBar } from 'react-icons/fa6';
import { fetchAllContributorProfiles } from '../utils/linkedinUtils';
import DraggableInstitutions from '../components/DraggableInstitutions';
import Footer from '../components/Footer';
import { supabase } from "../lib/supabase";
import Loader from "../components/Loader";

const About = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const loadContributors = async () => {
      try {
        setLoading(true);
        const data = await fetchAllContributorProfiles();
        setContributors(data);
      } catch (error) {
        console.error('Error loading contributors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContributors();
    
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 640);
      setIsTablet(width > 640 && width <=850);
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    
    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 pt-20 pb-20 sm:pt-28 max-w-6xl">
        <div className="flex flex-col items-center justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative py-4 sm:py-6 px-6 sm:px-12 mb-2 w-auto inline-block"
          >
        
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute h-0.5 bg-gradient-to-l from-blue-500 to-blue-200 bottom-0 right-0 w-full"
            />
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl font-bold text-center mb-2 relative"
            >
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">אודות CS24</span>
            </motion.h1>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Right side - Main information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 order-1 md:order-1 bg-white rounded-xl shadow-xl p-4 md:p-10 border border-blue-100"
          >
            <div className="space-y-8 text-right">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="p-6 bg-gradient-to-r from-blue-100 to-white rounded-lg shadow-md border border-blue-50"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-2 rounded-full ml-3 shadow-md">
                    <FaBullseye className="text-white text-xl" />
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-bold text-blue-600 relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">המטרה שלנו</span>
                  </motion.h2>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-0.5 bg-gradient-to-l from-blue-500 to-blue-200 mb-4"
                />
                <p className="text-gray-700 leading-relaxed text-lg">
                אנו מאמינים שגישה נוחה למידע איכותי ומאורגן היא המפתח להצלחה אקדמית. הפלטפורמה שלנו מפתחת באופן מתמיד עם משוב מהקהילה הסטודנטיאלית, כדי להבטיח שהיא עונה על הצרכים האמיתיים של הסטודנטים.
                </p>
              </motion.section>
              
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-md border border-blue-50"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-2 rounded-full ml-3 shadow-md">
                    <FaCode className="text-white text-xl" />
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-bold text-blue-600 relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">הסיפור שלנו</span>
                  </motion.h2>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.25 }}
                  className="h-0.5 bg-gradient-to-l from-blue-500 to-blue-200 mb-4"
                />
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    פרוייקט CS24 נוצר בשנת 2024 על ידי קבוצת סטודנטים מהמחלקה למדעי המחשב במכון הטכנולוגי חולון (HIT), במטרה לפתור את האתגרים השונים שסטודנטים מתמודדים איתם במהלך התואר. הפרוייקט מתמקד ביצירת מרחב לימודי דיגיטלי מתקדם וידידותי למשתמש.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    הרעיון לפרויקט נולד לאחר שזיהינו מספר אתגרים מרכזיים שסטודנטים נתקלים בהם: קושי באיתור חומרי לימוד איכותיים, חוסר במידע מרוכז על מתרגלים וקורסים, והצורך בכלים פרקטיים לניהול הלימודים. במקום שכל סטודנט יצטרך לחפש מידע במקורות שונים ומפוזרים, החלטנו ליצור פלטפורמה אחת שתרכז את כל המידע הנחוץ.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    הפלטפורמה שלנו מציעה מגוון שירותים המותאמים במיוחד לסטודנטים במדעי המחשב והנדסת חשמל, כולל ארכיון מקיף של חומרי לימוד, מאגר מידע על מתרגלים וקורסים, כלים לחישוב ותכנון שנת הלימודים, ופורום קהילתי לשיתוף ידע וניסיון. הכל בממשק נוח וידידותי שתוכנן בקפידה על ידי סטודנטים עבור סטודנטים.
                  </p>
                </div>
              </motion.section>
              
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="p-6 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-md border border-blue-50"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-2 rounded-full ml-3 shadow-md">
                    <FaTools className="text-white text-xl" />
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-bold text-blue-600 relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">מה תמצאו באתר?</span>
                  </motion.h2>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-0.5 bg-gradient-to-l from-blue-500 to-blue-200 mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { תכונה: 'חומרי לימוד מאורגנים', אייקון: <FaBook />, comingSoon: false },
                    { תכונה: ' מתרגלים', אייקון: <FaUserGraduate />, comingSoon: false },
                    { תכונה: 'פאנל ניהול', אייקון: <FaTools />, comingSoon: true },
                    { תכונה: ' קורסים ', אייקון: <FaBullseye />, comingSoon: true },
                    { תכונה: 'משרות עבודה', אייקון: <FaBriefcase />, comingSoon: false },
                    { תכונה: 'מחשבון ממוצע ציונים', אייקון: <FaCalculator />, comingSoon: true },
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.3 }}
                      className="bg-white p-4 rounded-lg shadow-md border border-blue-100 flex items-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 relative"
                    >
                      <span className="text-blue-500 text-xl ml-3">{item.אייקון}</span>
                      <span className="text-gray-700 font-medium">{item.תכונה}</span>
                      {item.comingSoon && (
                        <div className="absolute -bottom-1 right-0 bg-red-200/80 text-[8px] text-black font-bold py-0.5 px-1.5 rounded-full shadow-sm">
                          בקרוב...
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
              
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-md border border-blue-50"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500 p-2 rounded-full ml-3 shadow-md">
                    <FaUniversity className="text-white text-xl" />
                  </div>
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-2xl font-bold text-blue-600 relative inline-block"
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">מידע ונתונים</span>
                  </motion.h2>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-0.5 bg-gradient-to-l from-blue-500 to-blue-200 mb-4"
                />
                
                {/* Institutions Section */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    האתר מכיל מידע ממוסדות לימוד מובילים בישראל:
                  </p>
                  <div className="flex space-x-2">
                    <div className="text-xs text-gray-500 ml-2">החלק או גרור ימינה לראות עוד »</div>
                  </div>
                </div>
                <div className="relative overflow-hidden mt-2 bg-gradient-to-r from-blue-50 to-white p-2 sm:p-4 rounded-xl shadow-inner border border-blue-100">
                  <DraggableInstitutions />
                </div>
                
                {/* Stats Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-blue-600 mb-4 text-right">נתונים מספריים</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto md:max-w-none">
                    {[
                      { מספר: '20+', תיאור: 'מוסדות לימוד', אייקון: <FaUniversity /> },
                      { מספר: '6000+', תיאור: 'סטודנטים פעילים', אייקון: <FaUsers /> },
                      { מספר: '20+', תיאור: 'קבצי לימוד', אייקון: <FaFileAlt /> },
                      { מספר: '5+', תיאור: 'קורסים', אייקון: <FaCodeIcon /> },
                    ].map((stat, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                        className="relative bg-white rounded-full p-1 shadow-md border border-blue-100 flex flex-col items-center justify-center aspect-square overflow-hidden group hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                      >
                        <div className="absolute inset-2 bg-gradient-to-br from-blue-50 to-white rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                          <span className="text-blue-500 text-xl mb-1">{stat.אייקון}</span>
                          <span className="text-blue-600 font-bold text-lg sm:text-xl md:text-2xl">{stat.מספר}</span>
                          <span className="text-gray-600 text-xs sm:text-sm text-center">{stat.תיאור}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
              
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-white rounded-lg"
              >
                <h2 className="text-2xl font-bold mb-4 text-blue-600 border-r-4 border-blue-400 pr-3">צור קשר</h2>
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  יש לך שאלות, הצעות או משוב? אנחנו תמיד שמחים לשמוע ממך!
                </p>
                <div className="flex justify-center mt-6">
                  <a 
                    href="mailto:contact@cs24.com" 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <FaEnvelope className="ml-3 text-xl" />
                    <span>צור קשר עכשיו</span>
                  </a>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 mt-4 text-center">
                  <span className="text-gray-600">או שלח לנו מייל ישירות:</span>
                  <div className="text-blue-500 font-medium mt-1">contact@cs24.com</div>
                </div>
              </motion.section>
            </div>
          </motion.div>
          
          {/* Left side  Contributors */}
          <ContributorsSection isMobile={isMobile} isTablet={isTablet} loading={loading} contributors={contributors} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Extracted Contributors section as a separate component for better organization
const ContributorsSection = ({ isMobile, isTablet, loading, contributors }) => {
  const contributorsRef = React.useRef(null);
  const isInView = useInView(contributorsRef, { once: false, amount: 0.3 });
  
  return (
    <motion.div
      ref={contributorsRef}
      initial={{ opacity: 0, x: -20 }}
      animate={(!isMobile || isInView) ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="md:col-span-4 order-2 md:order-2 bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl shadow-xl p-6 md:p-8 relative overflow-hidden border border-blue-200 mt-8 md:mt-0 md:sticky md:top-20 md:h-[600px] md:self-start"
    >
            <div className="mb-4 relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute h-0.5 bg-gradient-to-l from-blue-500 to-blue-200 bottom-0 right-0 w-full"
              />
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-3xl font-bold mb-2 text-blue-600 text-right relative inline-block"
              >
                <span className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">התורמים שלנו</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-sm text-gray-600 text-right pb-2"
              >
                האנשים שעושים את הפרויקט הזה אפשרי
              </motion.p>
            </div>
            
            {/* Contributors */}
            <div className="relative h-[450px] sm:h-[500px] mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader />
                </div>
              ) : (
                <>
                  {/* Avatar positions - different positions based on device type */}
                  {(isTablet ? [
                    // iPad positions
                    { top: '2%', left: '35%', zIndex: 10, delay: 0.3 },
                    { top: '7%', right: '10%', zIndex: 20, delay: 0.5 },
                    { top: '35%', right: '5%', zIndex: 30, delay: 0.7 },
                    { top: '58%', right: '8%', zIndex: 10, delay: 0.9 },
                    { top: '72%', left: '40%', zIndex: 20, delay: 1.1 },
                    { top: '60%', left: '10%', zIndex: 30, delay: 1.3 },
                    { top: '35%', left: '10%', zIndex: 10, delay: 1.5 },
                    { top: '15%', left: '10%', zIndex: 20, delay: 1.7 },
                    { top: '23%', right: '35%', zIndex: 30, delay: 1.9 },
                    { top: '47%', left: '40%', zIndex: 10, delay: 2.1 }
                  ] : [
                    // Original positions for mobile and desktop
                    { top: '2%', left: '35%', zIndex: 10, delay: 0.3 },
                    { top: '7%', right: '10%', zIndex: 20, delay: 0.5 },
                    { top: '35%', right: '5%', zIndex: 30, delay: 0.7 },
                    { top: '58%', right: '8%', zIndex: 10, delay: 0.9 },
                    { top: '72%', left: '40%', zIndex: 20, delay: 1.1 },
                    { top: '60%', left: '10%', zIndex: 30, delay: 1.3 },
                    { top: '35%', left: '10%', zIndex: 10, delay: 1.5 },
                    { top: '15%', left: '10%', zIndex: 20, delay: 1.7 },
                    { top: '23%', right: '35%', zIndex: 30, delay: 1.9 },
                    { top: '47%', left: '40%', zIndex: 10, delay: 2.1 }
                  ]).map((position, index) => {
                  const contributor = contributors[index] || { 
                    imageUrl: 'https://i.pravatar.cc/150?img=0', 
                    name: 'Contributor' 
                  };
                
                  
                  return (
                    <motion.div
                      key={index}
                        initial={{ scale: 0 }}
                        animate={(!isMobile || isInView) ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: position.delay, duration: 0.5, type: 'spring' }}
                        className="absolute z-10"
                        style={{ 
                          top: position.top, 
                          left: position.left, 
                          right: position.right 
                        }}
                      >
                        <a 
                          href={contributor.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group relative block"
                        >
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200 shadow-md group-hover:shadow-blue-300 group-hover:scale-125 transition-all duration-500 ease-in-out">
                            <img 
                              src={contributor.imageUrl} 
                              alt={contributor.name} 
                              className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out" 
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-blue-500 rounded-full p-1.5">
                              <FaLinkedin className="text-white text-sm" />
                            </div>
                          </div>
                        </a>
                      </motion.div>
                    );
                  })}
                </>
              )}
              
              {/* Floating decorative elements - Circles */}
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={(!isMobile || isInView) ? { 
                  scale: 1, 
                  opacity: 0.4,
                  y: [0, -10, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut"
                    }
                  }
                } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute top-[15%] right-[45%] w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 z-0"
              />
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: -15 }}
                animate={(!isMobile || isInView) ? { 
                  scale: 1, 
                  opacity: 0.3,
                  y: [0, 15, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut"
                    }
                  }
                } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute top-[45%] right-[15%] w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 z-0"
              />
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 5 }}
                animate={(!isMobile || isInView) ? { 
                  scale: 1, 
                  opacity: 0.25,
                  y: [0, -8, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 3.5,
                      ease: "easeInOut"
                    }
                  }
                } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute top-[65%] left-[20%] w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 z-0"
              />
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: -10 }}
                animate={(!isMobile || isInView) ? { 
                  scale: 1, 
                  opacity: 0.3,
                  y: [0, 12, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 4.5,
                      ease: "easeInOut"
                    }
                  }
                } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute top-[25%] left-[25%] w-32 h-32 sm:w-38 sm:h-38 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 z-0"
              />
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 8 }}
                animate={(!isMobile || isInView) ? { 
                  scale: 1, 
                  opacity: 0.35,
                  y: [0, -12, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 6,
                      ease: "easeInOut"
                    }
                  }
                } : { scale: 0, opacity: 0 }}
                transition={{ duration: 1, delay: 1.0 }}
                className="absolute top-[5%] right-[25%] w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 z-0"
              />
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: -5 }}
                animate={{ 
                  scale: 1, 
                  opacity: 0.2,
                  y: [0, 10, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 5.5,
                      ease: "easeInOut"
                    }
                  }
                }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute top-[85%] right-[35%] w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 z-0"
              />
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 0.3,
                  y: [0, -8, 0],
                  transition: {
                    y: {
                      repeat: Infinity,
                      duration: 7,
                      ease: "easeInOut"
                    }
                  }
                }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-[40%] right-[30%] w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-50 to-blue-200"
              />
              
              
            </div>
          </motion.div>
        );
};

export default About;
