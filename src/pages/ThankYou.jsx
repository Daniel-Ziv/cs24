import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import BarLoader from '../components/BarLoader'

export default function ThankYou() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [courseDetails, setCourseDetails] = useState(null)
  const [user, setUser] = useState(null)

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
    const courseId = queryParams.get('courseId')
    const courseName = queryParams.get('courseName')
    const courseSlug = queryParams.get('courseSlug')
    
    if (courseId) {
      setCourseDetails({
        id: courseId,
        name: courseName || 'הקורס שלך',
        slug: courseSlug || courseId
      })
      
      // Auto redirect after 5 seconds
      const timer = setTimeout(() => {
        navigate(`/course/${courseId}`)
      }, 5000)
      
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
            
            // Auto redirect after 5 seconds
            const timer = setTimeout(() => {
              navigate(`/course/${data}`)
            }, 5000)
            
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">תודה על הרכישה!</h2>
            
            {loading ? (
              <div className="mt-6">
                <p className="text-gray-600 mb-4">טוען פרטי קורס...</p>
                <BarLoader />
              </div>
            ) : courseDetails ? (
              <>
                <p className="text-gray-600 text-lg mb-6">
                  הרכישה שלך ל{courseDetails.name} התקבלה בהצלחה.
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <p className="text-blue-800 mb-4">מועבר לקורס באופן אוטומטי תוך 5 שניות...</p>
                  <BarLoader />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Link
                    to={`/course/${courseDetails.id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    עבור לקורס עכשיו
                  </Link>
                  
                  <Link
                    to="/courses"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    חזרה לרשימת הקורסים
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  התשלום התקבל בהצלחה. תוכל לראות את הקורסים שלך באזור האישי.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Link
                    to="/courses"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    עבור לרשימת הקורסים
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 