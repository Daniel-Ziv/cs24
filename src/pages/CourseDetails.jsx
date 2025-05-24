import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { showNotification } from "../components/ui/notification";
import PaymentButton from "../components/PaymentButton";
import { supabase } from "../lib/supabase";
import BarLoader from "../components/BarLoader";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import CourseVideoPlayer from "../components/CourseVideoPlayer";
import StarRating from "../components/StarRating";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('he-IL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

// Define a beautiful color theme
const theme = {
  primary: {
    light: "#E0F2FE", // Light blue
    main: "#0EA5E9", // Blue
    dark: "#0369A1", // Dark blue
    gradient: "from-blue-500 to-cyan-500",
  },
  secondary: {
    light: "#E9FAF0", // Light green
    main: "#10B981", // Green
    dark: "#047857", // Dark green
    gradient: "from-green-500 to-emerald-500",
  },
  accent: {
    light: "#FEF3C7", // Light yellow
    main: "#FBBF24", // Yellow
    dark: "#D97706", // Dark yellow
    gradient: "from-amber-400 to-yellow-500",
  },
  neutral: {
    light: "#F9FAFB", // Light gray
    main: "#E5E7EB", // Gray
    dark: "#4B5563", // Dark gray
    darkest: "#1F2937", // Very dark gray
  },
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [course, setCourse] = useState({
    titles: [],
    episodes_watched: [],
    feedback: [],
    has_access: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-course-details', {
          body: { video_id: parseInt(courseId) }
        });

        if (error) {
          throw new Error(error.message || 'Failed to fetch course details');
        }

        if (!data || !data.id) {
          throw new Error('Course not found');
        }

        // Calculate total episodes and watched episodes
        const allEpisodes = data.titles?.flatMap(title => title.episodes) || [];
        const totalEpisodes = allEpisodes.length;
        const watchedCount = data.episodes_watched?.length || 0;
        
        // Calculate progress
        const progress = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;
        setCourseProgress(progress);

        // Mark episodes as watched
        const titlesWithWatchedStatus = (data.titles || []).map(title => ({
          ...title,
          episodes: (title.episodes || []).map(episode => ({
            ...episode,
            completed: (data.episodes_watched || []).includes(episode.id)
          }))
        }));

        setCourse({
          ...data,
          titles: titlesWithWatchedStatus || [],
          feedback: data.feedback || [],
          episodes_watched: data.episodes_watched || []
        });

      } catch (err) {
        console.error("Error loading course:", err);
        setError(err.message || "אירעה שגיאה לא צפויה");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-10 rounded-2xl bg-white shadow-xl border border-blue-100 max-w-md w-full"
        >
          <div className="mb-6">
            <Loader />
          </div>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-gray-600 text-lg font-medium"
          >
            טוען פרטי הקורס...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center border border-red-100"
          >
            <div className="mb-8 bg-red-50 p-6 rounded-xl inline-block">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              הקורס לא נמצא
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              לצערנו, הקורס שביקשת ({courseId}) אינו קיים במערכת או שאין לך
              הרשאות גישה אליו.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8 shadow-inner border border-blue-100">
              <p className="text-blue-700 mb-4">
                אם רכשת קורס זה לאחרונה, ייתכן שדרוש מעט זמן לעדכון ההרשאות
                במערכת. אנא נסה שוב בעוד מספר דקות.
              </p>
              <p className="text-blue-700">
                אם אתה חושב שזו טעות, צור קשר עם התמיכה בכתובת:{" "}
                <span className="font-semibold">cs24.hit@gmail.com</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-center font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-200"
              >
                עבור לרשימת הקורסים
              </Link>

              <button
                onClick={() => navigate(-1)}
                className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-200 border border-gray-200"
              >
                חזרה לדף הקודם
              </button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleEpisodeClick = (episode) => {
    if (!episode) return;
    setActiveEpisode(episode);
  };

  // Get all episodes from all titles
  const getAllEpisodes = () => {
    return course?.titles?.flatMap(title => title.episodes || []) || [];
  };

  // Get first episode for initial video player
  const getFirstEpisode = () => {
    return course?.titles?.[0]?.episodes?.[0] || null;
  };

  const handleCheckboxClick = async (e, episodeId) => {
    e.stopPropagation();
    try {
      const { data: episodesWatched, error } = await supabase.functions.invoke('save-course-progress', {
        body: {
          p_video_course_id: parseInt(courseId),
          p_episode_id: episodeId
        }
      });

      if (error) {
        console.error('Failed to toggle episode watched status:', error);
        showNotification('שגיאה בעדכון התקדמות', 'error');
        return;
      }

      // Update the episodes list with watched status from the response
      const updatedTitles = (course.titles || []).map(title => ({
        ...title,
        episodes: (title.episodes || []).map(episode => ({
          ...episode,
          completed: episodesWatched?.episodes_watched?.includes(episode.id) || false
        }))
      }));

      // Update course state with new episodes data
      setCourse(prev => ({
        ...prev,
        titles: updatedTitles,
        episodes_watched: episodesWatched?.episodes_watched || []
      }));

      // Calculate new progress
      const totalEpisodes = updatedTitles.reduce((sum, title) => sum + (title.episodes?.length || 0), 0);
      const watchedCount = episodesWatched?.episodes_watched?.length || 0;
      const progress = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;
      setCourseProgress(progress);

    } catch (err) {
      console.error('Error updating episode progress:', err);
      showNotification('שגיאה בעדכון התקדמות', 'error');
    }
  };

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const groupEpisodesByTopic = (episodes) => {
    if (!episodes || episodes.length === 0) return [];

    const numberOfTopics = Math.ceil(episodes.length / 3);
    const topics = [];

    for (let i = 0; i < numberOfTopics; i++) {
      const startIndex = i * 3;
      const endIndex = Math.min((i + 1) * 3, episodes.length);
      const topicEpisodes = episodes.slice(startIndex, endIndex);

      topics.push({
        id: `topic-${i}`,
        title: `נושא ${i + 1}`,
        description: `תיאור נושא ${i + 1}`,
        episodes: topicEpisodes,
      });
    }

    return topics;
  };

  // Convert video_len (seconds) to hours and minutes
  const hours = Math.floor(course.video_len / 3600);
  const minutes = Math.floor((course.video_len % 3600) / 60);
  const durationText = `${hours > 0 ? `${hours} שעות ` : ""}${minutes} דקות`;

  // Calculate average rating
  const averageRating = course?.feedback?.length > 0
    ? (course.feedback.reduce((acc, f) => acc + f.rating, 0) / course.feedback.length).toFixed(1)
    : 0;

  const handleFeedbackSubmit = async () => {
    if (!feedbackForm.comment.trim()) {
      showNotification('נא להזין משוב', 'error');
      return;
    }

    setSubmittingFeedback(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-feedback', {
        body: {
          video_id: 12,
          rating: feedbackForm.rating,
          comment: feedbackForm.comment.trim()
        }
      });

      if (error) {
        console.error("Feedback error:", error.message);
        throw error;
      }

      // Update the course state with the new feedback
      setCourse(prev => ({
        ...prev,
        feedback: [...prev.feedback, data],
        has_user_feedback: true
      }));

      // Reset form and close it
      setFeedbackForm({ rating: 5, comment: '' });
      setShowFeedbackForm(false);
      showNotification('המשוב נשלח בהצלחה', 'success');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      showNotification('שגיאה בשליחת המשוב', 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDeleteFeedback = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('update-feedback', {
        body: {
          video_id: 12,
          mode: "delete"
        }
      });

      if (error) {
        console.error("Delete error:", error.message);
        throw error;
      }

      // Update the course state to remove the user's feedback
      setCourse(prev => ({
        ...prev,
        feedback: prev.feedback.filter(f => !f.is_user_feedback),
        has_user_feedback: false
      }));

      showNotification('המשוב נמחק בהצלחה', 'success');
    } catch (err) {
      console.error('Error deleting feedback:', err);
      showNotification('שגיאה במחיקת המשוב', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Decorative floating elements */}
      <div className="absolute top-32 left-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/courses")}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-3 px-5 rounded-xl transition-all duration-300 font-medium group"
        >
          <svg
            className="w-5 h-5 ml-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          חזרה לקורסים
        </motion.button>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
        >
          <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="w-full md:w-2/3">
                <div className="flex items-center mb-3">
                  <div className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {course.title}
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">{course.course_name}</p>
                <div className="flex items-center mt-3 text-gray-500">
                  <div className="p-2 bg-blue-100 rounded-full mr-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span>
                    מרצה:{" "}
                    <span className="font-medium text-gray-800">
                      {course.tutor_name}
                    </span>
                  </span>
                </div>
                <div className="mt-5 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-inner">
                  <p className="text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-5 w-full md:w-1/3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm w-full border border-blue-100">
                  <div className="flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span className="font-bold text-xl text-blue-700">
                      התקדמות בקורס
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                          התקדמות
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600 bg-white px-2 py-1 rounded-full">
                          {Math.round(courseProgress)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-blue-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${courseProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </div>

                {course.has_access ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 px-6 py-4 rounded-xl flex items-center space-x-2 shadow-sm w-full border border-green-100">
                    <div className="bg-green-100 p-2 rounded-full mr-2">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">
                      יש לך גישה לקורס זה
                    </span>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 w-full">
                    <div className="flex items-center space-x-2 mb-3">
                      {course.sale_price < course.price && (
                        <div className="flex flex-col">
                          <span className="text-gray-500 line-through text-lg">
                            ₪{course.price}
                          </span>
                          <span className="text-xs text-red-600 font-medium">
                            {Math.round(
                              (1 - course.sale_price / course.price) * 100
                            )}
                            % הנחה
                          </span>
                        </div>
                      )}
                      <span className="text-2xl font-bold text-green-600 bg-green-50 py-1 px-4 rounded-lg">
                        ₪{course.sale_price}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">מחיר הקורס</div>
                    <PaymentButton
                      videoId={courseId}
                      courseName={course.title}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg shadow-sm border border-blue-100">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  {durationText}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg shadow-sm border border-blue-100">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  {getAllEpisodes().length} שיעורים
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg shadow-sm border border-blue-100">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-gray-700 font-medium">
                  מרצה: {course.tutor_name}
                </span>
              </div>

              {/* Rating tag */}
              {averageRating > 0 && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-lg shadow-sm border border-amber-100">
                  <svg
                    className="w-5 h-5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {averageRating} דירוג
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Video Player Section */}
            <div className={course.has_access ? "lg:col-span-2" : "lg:col-span-2"}>
              {course.has_access ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-black rounded-2xl overflow-hidden mb-6 shadow-2xl relative"
                  >
                    <div className="relative" style={{ paddingTop: "56.25%" }}>
                      {" "}
                      {/* 16:9 Aspect Ratio Container */}
                      {activeEpisode ? (
                        <CourseVideoPlayer
                          courseId={activeEpisode.video_uid}
                          activeEpisode={activeEpisode}
                          onEpisodeComplete={(episodesWatched) => {
                            // Update course state with new episodes data
                            setCourse(prev => ({
                              ...prev,
                              episodes_watched: episodesWatched || []
                            }));
                            
                            // Calculate new progress
                            const totalEpisodes = getAllEpisodes().length;
                            const progress = totalEpisodes > 0 ? ((episodesWatched?.length || 0) / totalEpisodes) * 100 : 0;
                            setCourseProgress(progress);
                          }}
                        />
                      ) : (
                        <>
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            style={{ display: "block" }}
                            id="thumbnail-img"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                          <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                            onClick={() => handleEpisodeClick(getFirstEpisode())}
                            id="play-overlay"
                          >
                            <div className="w-20 h-20 rounded-full bg-blue-600 bg-opacity-80 flex items-center justify-center shadow-lg transform transition hover:scale-110 group-hover:bg-opacity-100 group-hover:bg-blue-500">
                              <svg
                                className="w-10 h-10 text-white transform transition group-hover:scale-125"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                              </svg>
                            </div>
                            <div className="absolute bottom-6 left-6 text-white">
                              <h3 className="text-xl font-bold text-shadow-sm">
                                {getFirstEpisode()?.title || "פרק ראשון"}
                              </h3>
                              <p className="text-sm text-gray-200 line-clamp-1 text-shadow-sm">
                                {getFirstEpisode()?.description ||
                                  "לחץ כדי להתחיל את הקורס"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>

                  {activeEpisode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-2 border-blue-100 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full mr-4 mt-1">
                          <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                              {activeEpisode.title}
                            </h2>
                            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full shadow-sm border border-blue-100 ml-4">
                              <svg
                                className="w-5 h-5 text-blue-600 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-gray-700 font-medium">
                                {Math.floor(
                                  (activeEpisode.end_time -
                                    activeEpisode.start_time) /
                                    60
                                )}
                                :
                                {String(
                                  (activeEpisode.end_time -
                                    activeEpisode.start_time) %
                                    60
                                ).padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4 border-r-4 border-blue-100 pr-4 py-2 bg-blue-50 rounded-r-lg">
                            {activeEpisode.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-100">
                              פרק{" "}
                              {getAllEpisodes().findIndex(
                                (ep) => ep.id === activeEpisode.id
                              ) + 1}
                            </span>
                            <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-100">
                              נצפה {Math.floor(Math.random() * 500) + 100} פעמים
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="bg-gray-800 rounded-2xl overflow-hidden mb-8 shadow-2xl"
                >
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90"></div>
                    <div className="absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                      <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20 mb-8 max-w-md w-full transform hover:scale-105 transition-all duration-300">
                        <div className="bg-red-500/20 p-4 rounded-xl mx-auto w-20 h-20 mb-4 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 text-center text-shadow">
                          תוכן הקורס נעול
                        </h3>
                        <p className="text-gray-200 text-center mb-6">
                          יש לרכוש את הקורס כדי לצפות בשיעורים
                        </p>
                        <div className="flex justify-center">
                          <span className="inline-flex items-center text-amber-300 text-sm font-medium">
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {averageRating > 0
                              ? `דירוג ${averageRating} מתוך 5`
                              : "קורס חדש"}
                          </span>
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 animate-pulse-slow">
                        רכוש גישה עכשיו
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Feedback Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <svg
                        className="w-6 h-6 text-yellow-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      משובים
                    </h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {showFeedbackForm ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">דירוג</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                                className={`p-2 rounded-full transition-all ${
                                  feedbackForm.rating >= star
                                    ? 'text-yellow-400 bg-yellow-50'
                                    : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                                }`}
                              >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-medium mb-2">משוב</label>
                          <textarea
                            value={feedbackForm.comment}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                            rows="4"
                            placeholder="שתף את חווייתך מהקורס..."
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleFeedbackSubmit}
                            disabled={submittingFeedback}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submittingFeedback ? 'שולח...' : 'שלח משוב'}
                          </button>
                          <button
                            onClick={() => setShowFeedbackForm(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            ביטול
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}

                  {(course?.feedback || []).length > 0 ? (
                    course.feedback
                      .filter((feedback) => feedback?.comment)
                      .sort((a, b) => {
                        // Sort user's feedback first
                        if (a.id === course.user_feedback_id) return -1;
                        if (b.id === course.user_feedback_id) return 1;
                        // Then sort by date
                        return new Date(b.created_at) - new Date(a.created_at);
                      })
                      .map((feedback, index) => (
                        <motion.div
                          key={feedback.id}
                          className="p-5 hover:bg-gray-50 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.1 * index,
                            ease: "easeOut",
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white font-bold mr-2 text-xs">
                                {feedback.rating}
                              </div>
                              <div className="flex">
                                {[...Array(feedback.rating)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className="w-4 h-4 text-amber-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {formatDate(feedback.created_at)}
                              </span>
                              {feedback.id === course.user_feedback_id && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setFeedbackForm({
                                        rating: feedback.rating,
                                        comment: feedback.comment
                                      });
                                      setShowFeedbackForm(true);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                                    title="ערוך משוב"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={handleDeleteFeedback}
                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                    title="מחק משוב"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                              {feedback.comment}
                            </p>
                          </div>
                        </motion.div>
                      ))
                  ) : (
                    <div className="p-12 text-center">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p className="text-gray-500 mb-4">
                        אין עדיין משובים לקורס זה
                      </p>
                      <div className="w-32 h-1 bg-gray-200 mx-auto rounded-full"></div>
                    </div>
                  )}
                </div>
                {!course?.has_user_feedback && course?.has_access && !showFeedbackForm && (
                  <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <button
                      onClick={() => setShowFeedbackForm(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center font-medium"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      הוסף משוב
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Episodes List */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-4"
              >
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    שיעורים ({course?.titles?.reduce((sum, title) => sum + (title.episodes?.length || 0), 0) || 0})
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {course?.titles?.map((title) => {
                    const isExpanded = expandedTopics.includes(title.id);
                    const completedEpisodes = title.episodes?.filter(ep => ep.completed)?.length || 0;
                    const totalEpisodes = title.episodes?.length || 0;

                    return (
                      <div key={title.id} className="w-full">
                        {/* Title header */}
                        <div
                          className={`p-4 ${
                            isExpanded ? "bg-blue-50" : "bg-gradient-to-r from-gray-50 to-white"
                          } hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors border-r-4 ${
                            isExpanded ? "border-blue-500" : "border-transparent"
                          }`}
                          onClick={() => toggleTopic(title.id)}
                        >
                          <div className="flex items-center">
                            <svg
                              className={`w-5 h-5 text-blue-600 mr-3 transform transition-transform duration-300 ${
                                isExpanded ? "rotate-90" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <div>
                              <span className="font-bold text-gray-800">{title.title}</span>
                              <div className="text-xs text-gray-500 mt-1">
                                {totalEpisodes} שיעורים{" "}
                                {completedEpisodes > 0 && `· ${completedEpisodes} הושלמו`}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                            {totalEpisodes} שיעורים
                          </span>
                        </div>

                        {/* Title episodes */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isExpanded ? "auto" : 0,
                            opacity: isExpanded ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className={`bg-white overflow-hidden ${isExpanded ? "py-2" : ""}`}
                        >
                          {(title.episodes || []).map((episode) => {
                            const durationStr = episode.episode_len 
                              ? `${Math.floor(episode.episode_len / 60)}:${String(episode.episode_len % 60).padStart(2, "0")}`
                              : "00:00";
                            const isActive = activeEpisode?.id === episode.id;

                            return (
                              <div
                                key={episode.id}
                                className={`w-full p-4 pr-10 text-right transition-all border-r-2 border-gray-100 ${
                                  isActive
                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-500 shadow-sm"
                                    : course?.has_access
                                    ? "hover:bg-blue-50 hover:border-r-4 hover:border-blue-300 cursor-pointer"
                                    : "opacity-75"
                                }`}
                                onClick={() =>
                                  course?.has_access
                                    ? handleEpisodeClick(episode)
                                    : null
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    {course?.has_access ? (
                                      <button
                                        onClick={(e) =>
                                          handleCheckboxClick(e, episode.id)
                                        }
                                        className="focus:outline-none"
                                        aria-label={
                                          episode.completed
                                            ? "סמן כלא נצפה"
                                            : "סמן כנצפה"
                                        }
                                      >
                                        {episode.completed ? (
                                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm transform transition-transform hover:scale-110">
                                            <svg
                                              className="w-4 h-4 text-white"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          </div>
                                        ) : (
                                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-400 cursor-pointer transition-colors hover:bg-blue-50" />
                                        )}
                                      </button>
                                    ) : (
                                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg
                                          className="w-3 h-3 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    <span
                                      className={`text-gray-700 bg-gradient-to-r ${
                                        isActive
                                          ? "from-blue-100 to-indigo-100"
                                          : "from-gray-100 to-gray-50"
                                      } px-3 py-1 rounded-full text-sm font-medium ${
                                        course?.has_access
                                          ? ""
                                          : "line-through"
                                      }`}
                                    >
                                      {durationStr}
                                    </span>
                                  </div>
                                  <div className="text-right flex-grow mr-3">
                                    <h3
                                      className={`font-medium ${
                                        isActive
                                          ? "text-blue-700"
                                          : course?.has_access
                                          ? "text-gray-900"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {episode.episode_index + 1}. {episode.title}
                                    </h3>
                                    <p
                                      className={`text-sm ${
                                        isActive
                                          ? "text-blue-600"
                                          : "text-gray-500"
                                      } line-clamp-1`}
                                    >
                                      {episode.description || "אין תיאור"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>

                {!course?.has_access && (
                  <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
                    <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-5 py-4 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      פתח גישה לכל השיעורים
                    </button>
                    <div className="mt-4 flex justify-center">
                      <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        ללא התחייבות • גישה מיידית
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetails;