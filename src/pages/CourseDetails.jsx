import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { showNotification } from "../components/ui/notification";
import CourseVideoPlayer from "../components/CourseVideoPlayer";
import { supabase } from "../lib/supabase";
import BarLoader from "../components/BarLoader";

// Mock episodes data
const mockEpisodes = [
  {
    id: 1,
    title: "מבוא לקורס",
    duration: "15:00",
    description: "סקירה כללית של הקורס ומה נלמד",
    completed: false,
  },
  {
    id: 2,
    title: "פרק 1: יסודות",
    duration: "25:30",
    description: "למידת המושגים הבסיסיים",
    completed: false,
  },
  {
    id: 3,
    title: "פרק 2: התקדמות",
    duration: "30:15",
    description: "צלילה לנושאים מתקדמים",
    completed: false,
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('he-IL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
  
      if (sessionError) {
        console.error("Failed to load session:", sessionError);
        setError("אירעה שגיאה בזיהוי המשתמש");
        setLoading(false);
        return;
      }
      console.log('User ID:', userId);

      try {
        const { data, error } = await supabase.rpc("get_lesson_details", {
          p_video_id: parseInt(courseId)
        });
        
        if (error) throw error;
        if (!data) {
          throw new Error("Course not found");
        }

        // Add mock episodes to the course data
        setCourse({
          ...data,
          episodes: mockEpisodes
        });
      } catch (err) {
        console.error("Error loading course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <BarLoader />
          <p className="mt-6 text-gray-600 text-lg">טוען קורס...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">קורס לא נמצא</h1>
            <button
              onClick={() => navigate("/courses")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              חזרה לקורסים
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEpisodeClick = (episode) => {
    setActiveEpisode(episode);
  };

  const handleEpisodeComplete = (episodeId) => {
    const updatedEpisodes = course.episodes.map((ep) =>
      ep.id === episodeId ? { ...ep, completed: true } : ep
    );
    const completedCount = updatedEpisodes.filter((ep) => ep.completed).length;
    const progress = (completedCount / updatedEpisodes.length) * 100;
    setCourseProgress(progress);
    
    // Update the course with new episodes data
    setCourse({
      ...course,
      episodes: updatedEpisodes
    });
  };

  // Convert video_len (seconds) to hours and minutes
  const hours = Math.floor(course.video_len / 3600);
  const minutes = Math.floor((course.video_len % 3600) / 60);
  const durationText = `${hours > 0 ? `${hours} שעות ` : ''}${minutes} דקות`;

  // Calculate average rating
  const averageRating = course?.feedback?.length > 0
    ? (course.feedback.reduce((acc, f) => acc + f.rating, 0) / course.feedback.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/courses")}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 ml-2"
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
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h1>
                <p className="text-gray-600 text-lg">{course.course_name}</p>
                <p className="text-gray-500 mt-2">מרצה: {course.tutor_name}</p>
                <p className="text-gray-500 mt-2">{course.description}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {courseProgress}%
                  </div>
                  <div className="text-sm text-gray-500">התקדמות</div>
                </div>
                {course.has_access ? (
                  <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg flex items-center space-x-2">
                    <svg
                      className="w-6 h-6"
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
                    <span className="font-semibold text-lg">יש לך גישה לקורס זה</span>
                  </div>
                ) : (
                  <>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {course.sale_price < course.price && (
                          <span className="text-gray-500 line-through text-lg">
                            ₪{course.price}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-green-600">
                          ₪{course.sale_price}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">מחיר הקורס</div>
                    </div>
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>קנה עכשיו</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
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
                <span className="text-gray-700">{durationText}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
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
                <span className="text-gray-700">
                  {course.episodes.length} שיעורים
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
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
                <span className="text-gray-700">מרצה: {course.tutor_name}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Video Player Section */}
            <div className={course.has_access ? "lg:col-span-2" : "lg:col-span-2"}>
              {course.has_access ? (
                <>
                  <div className="bg-black rounded-lg overflow-hidden mb-4">
                    <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio Container */}
                      <img
                        src={course.thumbnail_url || `https://videodelivery.net/${course.video_uid}/thumbnails/thumbnail.jpg${course.thumbnail ? `?time=${course.thumbnail}s` : ''}`}
                        alt={course.title}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        style={{ display: 'block' }}
                        id="thumbnail-img"
                      />
                      <div id="video-player" className="absolute top-0 left-0 w-full h-full" style={{ display: 'none' }}>
                        <CourseVideoPlayer 
                          courseId={parseInt(courseId)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {activeEpisode && (
                    <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {activeEpisode.title}
                      </h2>
                      <p className="text-gray-600 mb-4">
                        {activeEpisode.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
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
                          <span className="text-gray-700">
                            {activeEpisode.duration}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEpisodeComplete(activeEpisode.id)}
                          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          סיים שיעור
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnail_url || `https://videodelivery.net/${course.video_uid}/thumbnails/thumbnail.jpg${course.thumbnail ? `?time=${course.thumbnail}s` : ''}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400 mb-4"
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
                      <h3 className="text-xl font-semibold text-white mb-2">תוכן הקורס נעול</h3>
                      <p className="text-gray-200">יש לרכוש את הקורס כדי לצפות בשיעורים</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">משובים</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-yellow-500 ml-2">{averageRating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 mr-2">({course.feedback.length} משובים)</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {course.feedback
                    .filter(feedback => feedback.comment) // Only show feedback with comments
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by date
                    .map((feedback) => (
                    <div key={feedback.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {[...Array(feedback.rating)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(feedback.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-line">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
                {!course.has_user_feedback && course.has_access && (
                  <div className="p-4 border-t border-gray-200">
                    <button 
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      הוסף משוב
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Episodes List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">שיעורים</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {course.episodes.map((episode, index) => (
                    <button
                      key={episode.id}
                      onClick={() => course.has_access ? handleEpisodeClick(episode) : null}
                      disabled={!course.has_access}
                      className={`w-full p-4 text-right transition-colors ${
                        activeEpisode?.id === episode.id ? "bg-blue-50" : 
                        course.has_access ? "hover:bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {course.has_access ? (
                            episode.completed ? (
                              <svg
                                className="w-5 h-5 text-green-600"
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
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            )
                          ) : (
                            <svg
                              className="w-5 h-5 text-gray-400"
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
                          )}
                          <span className="text-gray-700">
                            {episode.duration}
                          </span>
                        </div>
                        <div className="text-right">
                          <h3 className={`font-medium ${course.has_access ? "text-gray-900" : "text-gray-500"}`}>
                            {episode.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {episode.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {!course.has_access && (
                  <div className="p-4 border-t border-gray-200">
                    <button 
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold"
                    >
                      פתח גישה לכל השיעורים
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;