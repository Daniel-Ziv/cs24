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
import { courseTypeOptions } from "../config/courseStyles";



const ProfilePage = () => {
  const { id, tutorName, courseType } = useParams()
  const DEGREE_NAMES = Object.fromEntries(
    courseTypeOptions.map(option => [option.type, option.label])
  );
  
  const displayName = decodeURIComponent(tutorName.replace(/-/g, " "))
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const [tutorsWithFeedback, setTutorsWithFeedback] = useState([]);



  const styles = courseStyles[courseType]
  const isDevMode = process.env.REACT_APP_DEV?.toLowerCase() === 'true';

  const similarTutors = tutorData && tutorsWithFeedback.length > 0
    ? (() => {
        // Sort all tutors by wilson_score (or average_rating as fallback)
        const sortedTutors = [...tutorsWithFeedback]
          .filter(tutor => tutor.name !== tutorData.name)
          .sort((a, b) => {
            const scoreA = a.wilson_score ?? a.average_rating ?? 0;
            const scoreB = b.wilson_score ?? b.average_rating ?? 0;
            return scoreB - scoreA;
          });

        // Tutors with at least one matching subject
        const matchingTutors = sortedTutors.filter(tutor =>
          tutorData.subjects.some(mySub => mySub.course_name === tutor.course_name)
        );

        // Take up to 6 matching tutors
        const selected = matchingTutors.slice(0, 6);

        // If not enough, fill with the next highest scoring tutors (excluding already selected)
        if (selected.length < 6) {
          const selectedNames = new Set(selected.map(t => t.name));
          const fillers = sortedTutors.filter(tutor => !selectedNames.has(tutor.name)).slice(0, 6 - selected.length);
          return [...selected, ...fillers];
        }
        return selected;
      })()
    : [];

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

  const loadTutorsWithFeedback = async () => {
    setLoading(true);

    const sectionKey = courseType + "Tutors";
    const sectionTutors = mockData[sectionKey] || [];

    // Helper for fallback tutors (mock data)
    const fallback = () => {
      setTutorsWithFeedback(scoreAndSortTutors(sectionTutors));
      // Find the specific tutor in mock data
      const specificTutor = sectionTutors.find(tutor => String(tutor.id) === String(id) && tutor.name === displayName);
      if (specificTutor) {
        setTutorData(specificTutor);
      } else {
        setError("המורה המבוקש לא נמצא.");
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

      const { data: tutors, error } = await supabase
        .rpc('new_get_tutors_with_feedback', {
          p_degree_id: newDegreeId
        });
      if (error || !tutors) {
        fallback();
        return;
      }
      setTutorsWithFeedback(scoreAndSortTutors(tutors));
      // Filter to find the specific tutor by id and displayName
      const specificTutor = tutors.find(tutor => String(tutor.id) === String(id) && tutor.name === displayName);

      if (specificTutor) {
        setTutorData((specificTutor));
      } else {
        setError("המורה המבוקש לא נמצא.");
      }
    } catch {
      fallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      loadTutorsWithFeedback();
  },  [displayName, id, courseType]);

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