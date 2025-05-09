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
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_video_thumbnail_data");
        if (error) throw error;

        const courseData = data.find(c => c.id === parseInt(courseId));
        if (!courseData) {
          throw new Error("Course not found");
        }

        // Add mock episodes to the course data
        setCourse({
          ...courseData,
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
                  {course.video_title}
                </h1>
                <p className="text-gray-600 text-lg">{course.course_name}</p>
                <p className="text-gray-500 mt-2">מרצה: {course.tutor_name}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {courseProgress}%
                  </div>
                  <div className="text-sm text-gray-500">התקדמות</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <div className="border-r border-gray-200 h-12"></div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 line-through text-lg">
                      ₪{course.originalPrice}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      ₪{course.price}
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
                <span className="text-gray-700">{course.hours} שעות</span>
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
                <span className="text-gray-700">מרצה: {course.creator}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Video Player Section */}
            <div className="lg:col-span-2">
              {activeEpisode ? (
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  <CourseVideoPlayer 
                    courseId={parseInt(courseId)}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg aspect-video mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                    <p className="text-gray-600">בחר שיעור כדי להתחיל</p>
                  </div>
                </div>
              )}

              {activeEpisode && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
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
            </div>

            {/* Episodes List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">שיעורים</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {course.episodes.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => handleEpisodeClick(episode)}
                      className={`w-full p-4 text-right hover:bg-gray-50 transition-colors ${
                        activeEpisode?.id === episode.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {episode.completed ? (
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
                          )}
                          <span className="text-gray-700">
                            {episode.duration}
                          </span>
                        </div>
                        <div className="text-right">
                          <h3 className="font-medium text-gray-900">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;