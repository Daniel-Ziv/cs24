import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactConfetti from 'react-confetti'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Custom countdown component
const CountdownTimer = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds)
  
  useEffect(() => {
    if (timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    
    return () => clearInterval(timer)
  }, [timeLeft])
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-3xl font-bold text-blue-600 mb-1">{timeLeft}</div>
      <div className="text-sm text-gray-500">שניות</div>
    </div>
  )
}

export default function ThankYou() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [courseDetails, setCourseDetails] = useState(null)
  const [user, setUser] = useState(null)
  const [confettiActive, setConfettiActive] = useState(true)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    
    // Automatically stop confetti after 8 seconds
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false)
    }, 8000)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(confettiTimer)
    }
  }, [])

  useEffect(() => {
    // Get current user session
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    
    fetchUser()
  }, [])

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const videoId = queryParams.get('videoId')
    const courseId = queryParams.get('courseId')
    const courseName = queryParams.get('courseName')
    const courseSlug = queryParams.get('courseSlug')
    
    if (courseId || videoId) {
      const id = courseId || videoId
      setCourseDetails({
        id: id,
        name: courseName || 'הקורס שלך',
        slug: courseSlug || id
      })
      
      // Auto redirect after 10 seconds (increased from 5 to give more time to read)
      const timer = setTimeout(() => {
        navigate(`/course/${id}`)
      }, 15000)
      
      setLoading(false)
      return () => clearTimeout(timer)
    } else {
      // אם אין פרמטרים, ננסה לקבל את הקורס האחרון שהמשתמש קנה
      const fetchLatestCourse = async () => {
        try {
          if (!user) return
          
          const { data, error } = await supabase.rpc('get_user_latest_course', {
            p_user_id: user.id
          })
          
          if (error) throw error
          
          if (data) {
            setCourseDetails({
              id: data,
              name: 'הקורס שלך',
              slug: data
            })
            
            // Auto redirect after 10 seconds
            const timer = setTimeout(() => {
              navigate(`/course/${data}`)
            }, 15000)
            
            return () => clearTimeout(timer)
          }
        } catch (error) {
          console.error('Error fetching course:', error)
        } finally {
          setLoading(false)
        }
      }
      
      if (user) {
        fetchLatestCourse()
      } else {
        setLoading(false)
      }
    }
  }, [location, navigate, user])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {confettiActive && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
        />
      )}
      <Navbar />
      <div className="container mx-auto px-4 py-20 flex-grow">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1.2 }}
                transition={{ 
                  duration: 0.5,
                  repeat: 1,
                  repeatType: "reverse"
                }}
              >
                <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">תודה על הרכישה!</h2>
            
            {loading ? (
              <div className="mt-6">
                <p className="text-gray-600 mb-4 text-center">טוען פרטי קורס...</p>
                <div className="flex justify-center">
                  <CountdownTimer seconds={15} />
                </div>
              </div>
            ) : courseDetails ? (
              <>
                <p className="text-gray-600 text-lg mb-6 text-center">
                  הרכישה שלך ל<span className="font-semibold">{courseDetails.name}</span> התקבלה בהצלחה.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <p className="text-blue-800 mb-2 text-center font-medium">שים לב!</p>
                  <p className="text-blue-700 mb-4 text-center">
                    עדכון ההרשאות עשוי לקחת מספר רגעים. אם אינך רואה את תוכן הקורס מיד, המתן מספר דקות ונסה שוב.
                  </p>
                  <p className="text-blue-700 mb-4 text-center">
                    חשבונית מס/קבלה תישלח לכתובת המייל שלך בדקות הקרובות.
                  </p>
                  <div className="mb-2 flex flex-col items-center">
                    <p className="text-blue-800 mb-2 text-center">מועבר לקורס באופן אוטומטי בעוד:</p>
                    <CountdownTimer seconds={15} />
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">פרטי הרכישה שלך:</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">שם הקורס:</span>
                      <span className="font-medium">{courseDetails.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">מזהה קורס:</span>
                      <span className="font-medium">{courseDetails.id}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">סטטוס:</span>
                      <span className="text-green-600 font-medium">הרכישה הושלמה</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Link
                    to={`/course/${courseDetails.id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                  >
                    עבור לקורס עכשיו
                  </Link>
                  
                  <Link
                    to="/courses"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center"
                  >
                    חזרה לרשימת הקורסים
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  התשלום התקבל בהצלחה. תוכל לראות את הקורסים שלך באזור האישי.
                </p>
                
                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <p className="text-yellow-800 mb-2 text-center font-medium">שים לב!</p>
                  <p className="text-yellow-700 mb-4 text-center">
                    עדכון ההרשאות עשוי לקחת מספר רגעים. אם אינך רואה את הקורסים שלך מיד, המתן מספר דקות ונסה שוב.
                  </p>
                  <p className="text-yellow-700 mb-4 text-center">
                    חשבונית מס/קבלה תישלח לכתובת המייל שלך בדקות הקרובות.
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-yellow-800 mb-2 text-center">מועבר לדף הקורסים באופן אוטומטי בעוד:</p>
                    <CountdownTimer seconds={15} />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Link
                    to="/profile"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                  >
                    עבור לאזור האישי
                  </Link>
                  
                  <Link
                    to="/courses"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors text-center"
                  >
                    עבור לרשימת הקורסים
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
} 