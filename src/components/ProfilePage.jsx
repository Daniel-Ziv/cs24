import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { courseStyles } from "../config/courseStyles"
import mockData from "../config/mockData.json"
import { backgroundPath } from "../config/backgroundPath"
import NotFoundPage from "./NotFoundPage"
import ReviewSection from "./profile/ReviewsCard"
import ProfileCard from "./profile/ProfileCard"
import SimilarTutors from "./profile/SimilarTutors"
import EducationProfileSection from "./profile/EducationCard"
import ContactCard from "./profile/ContactCard"
import UpcomingEvents from "./profile/EventsCard"
import Navbar from "./Navbar"
const normalizeTutorData = (tutor) => {
  return {
    ...tutor,
    subjects: tutor.subjects?.map((sub) =>
      typeof sub === "string" ? { course_name: sub } : sub
    ) || []
  }
}

const ProfilePage = () => {
  const { tutorName } = useParams()
  const location = useLocation()

  const displayName = decodeURIComponent(tutorName.replace(/-/g, " "))
  const passedTutor = location.state?.tutor

  const [tutorData, setTutorData] = useState(passedTutor ? normalizeTutorData(passedTutor) : null)
  const [loading, setLoading] = useState(!passedTutor)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])

  const stateCourseType = location.state?.courseType
  const courseType = tutorData?.course_type || stateCourseType || "cs"
  const styles = courseStyles[courseType]
  const isDevMode = process.env.REACT_APP_DEV?.toLowerCase() === 'true';

  const sectionKey = courseType + "Tutors"
  const sectionTutors = mockData[sectionKey] || []
  const similarTutors = tutorData
    ? sectionTutors
        .filter((tutor) =>
          tutor.name !== tutorData.name &&
          tutor.subjects?.some((sub) =>
            tutorData.subjects.some((mySub) => mySub.course_name === sub.course_name)
          )
        )
        .map((tutor) => ({ ...tutor }))
    : []

  useEffect(() => {
    if (!passedTutor) {
      const fetchTutor = async () => {
        const { data, error } = await supabase
          .from("tutors")
          .select("*, feedback(*), subjects")
          .eq("name", displayName)
          .maybeSingle()

        if (error) {
          setError(error.message)
        } else {
          console.log("Tutor data fetched from Supabase:", data)
          setTutorData(normalizeTutorData(data))
        }
        setLoading(false)
      }
      fetchTutor()
    }
  }, [passedTutor, displayName])

  useEffect(() => {
    if (tutorData) {
      if (tutorData.feedback && tutorData.feedback.length > 0) {
        const reviewsWithComments = tutorData.feedback.filter((fb) => fb.comment?.trim())
        const sortedReviews = [...reviewsWithComments].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        setReviews(sortedReviews)
      } else {
        const fetchReviews = async () => {
          const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .eq("tutor_id", tutorData.id)
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Error fetching reviews: ", error)
          } else {
            const reviewsWithComments = data?.filter((fb) => fb.comment?.trim()) || []
            setReviews(reviewsWithComments)
          }
        }
        fetchReviews()
      }
    }
  }, [tutorData])

  if (loading)
    return (
      <div className={`text-center mt-10 ${styles.textColor}`}>
        <div
          className="animate-spin h-10 w-10 border-4 border-t-transparent rounded-full mx-auto mb-4"
          style={{ borderColor: `currentColor transparent currentColor currentColor` }}
        ></div>
        טוען...
      </div>
    )

  if (error || !tutorData) {
    return <NotFoundPage />
  }

  return (
    <div className={`min-h-screen relative`}>
      <svg
        className={`fixed inset-0 w-full h-full z-0 ${styles.bgLight}`}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill={styles.background} fillOpacity="0.49" d={backgroundPath} />
      </svg>
      { isDevMode && <Navbar courseType={courseType} /> }

      <ProfileCard styles={styles} tutorData={tutorData} />

      <div className={`relative z-10 p-4 mx-auto w-full max-w-screen-xl `}>
        <div
          className={`bg-white rounded-xl border mb-6 w-full ${styles.cardBorder} max-w-[73rem] mx-auto space-y-8 mt-4 px-4 pb-12`}
        >
          <section className={`bg-white -mb-12 md:max-w-[65rem] max-w-3xl mx-auto py-8 text-center`}>
            <div className="bg-white p-6 flex items-center justify-center gap-3 mb-6 border-b pb-6">
              <h2 className={`text-2xl font-bold ${styles.textColor}`}>קצת עליי</h2>
            </div>
            <p className={`${styles.textColor} mx-auto whitespace-pre-line leading-relaxed font-bold`}>
              {tutorData.about_me ||
                "עוד לא הוספתי"}
            </p>
          </section>

          <section className={`bg-white -mb-12 md:max-w-[65rem] max-w-3xl mx-auto py-8 text-center`}>
            <div className="flex items-center gap-3 border-b pb-4 mb-4 justify-center">
              <h2 className={`text-2xl font-bold ${styles.textColor}`}>תחומי לימוד</h2>
            </div>

            <div className="flex justify-center flex-wrap gap-4">
              {tutorData.subjects?.map((subject, i) => (
                <span
                  key={i}
                  className={`md:text-md md:px-4 md:py-2 text-sm px-3 py-1 rounded-xl ${styles.subjectBg} ${styles.textSecondary}`}
                >
                  {subject.course_name}
                </span>
              ))}
            </div>
          </section>
          
          <div className="flex flex-col md:flex-row gap-8 md:max-w-[65rem] max-w-3xl mx-auto">
            {tutorData.events?.length > 0 && (
              <div className="w-full md:w-1/2">
                <UpcomingEvents styles={styles} events={tutorData.events} />
              </div>
            )}

            <div className={`w-full ${tutorData.events?.length > 0 ? "md:w-1/2 -mt-16 md:mt-0" : ""}`}>
              <EducationProfileSection styles={styles} tutor={tutorData} />
            </div>
          </div>


          <ReviewSection reviews={tutorData.feedback || []} styles={styles} />

          {similarTutors.length > 0 && (
            <SimilarTutors tutors={similarTutors} styles={styles} courseType={courseType} />
          )}

          <ContactCard tutor={tutorData} styles={styles} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage