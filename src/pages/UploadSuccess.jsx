import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { courseStyles } from '../config/courseStyles';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import useAuth from '../hooks/useAuth';

// Custom countdown component
const CountdownTimer = ({ seconds }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-3xl font-bold text-blue-600 mb-1">{timeLeft}</div>
      <div className="text-sm text-gray-500">שניות</div>
    </div>
  );
};

// Convert seconds to formatted string (MM:SS)
const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "00:00";
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Fetch signed thumbnail URL
async function fetchSignedThumbnail(videoUid) {
  const endpoint = "https://dmswkhumaemazjerzvbz.supabase.co/functions/v1/get-signed-thumbnail";

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ video_uid: videoUid })
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || res.statusText);
    }

    const { thumbnail_url } = await res.json();
    return thumbnail_url;
  } catch (error) {
    console.error('Error in fetchSignedThumbnail:', error);
    return null;
  }
}

export default function UploadSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [confettiActive, setConfettiActive] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  const auth = useAuth();
  const courseType = localStorage.getItem('courseType') || 'cs';
  const styles = courseStyles[courseType] || courseStyles.cs;

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Automatically stop confetti after 8 seconds
    const confettiTimer = setTimeout(() => {
      setConfettiActive(false);
    }, 8000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(confettiTimer);
    };
  }, []);
  
  // Fetch signed thumbnail URL when videoData changes
  useEffect(() => {
    if (videoData?.video_uid && !videoData.thumbnail_url) {
      fetchSignedThumbnail(videoData.video_uid)
        .then(url => {
          if (url) {
            setThumbnailUrl(`${url}&time=${videoData.thumbnail || 1}s`);
          }
        })
        .catch(error => console.error('Error fetching signed thumbnail:', error));
    }
  }, [videoData]);
  
  // Get the best thumbnail URL to use
  const getThumbnailUrl = () => {
    if (videoData?.thumbnail_url) {
      return videoData.thumbnail_url;
    }
    
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
    
    // Fallback to standard thumbnail with time parameter
    const defaultTime = videoData?.thumbnail || 0;
    return `https://videodelivery.net/${videoData?.video_uid}/thumbnails/thumbnail.jpg?time=${defaultTime}s`;
  };
  
  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const videoId = queryParams.get('videoId');
        
        if (!videoId) {
          console.error('Missing videoId parameter');
          navigate('/'); // Redirect to home if no parameter
          return;
        }
        
        // Fetch video details
        const { data: lessonData, error: lessonError } = await supabase
          .rpc('get_lesson_details', { p_video_id: videoId });
          
        if (lessonError) {
          console.error('Error fetching video details:', lessonError);
          return;
        }
        
        if (lessonData) {
          console.log('Lesson data:', lessonData);
          setVideoData(lessonData);
        }
      } catch (error) {
        console.error('Error loading details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDetails();
  }, [location.search, navigate]);
  
  // Handle redirect to dashboard after timeout
  useEffect(() => {
    if (!loading && videoData) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 20000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, videoData, navigate]);

  // Calculate average rating from feedback
  const calculateAverageRating = (feedback) => {
    if (!feedback || feedback.length === 0) return null;
    
    const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / feedback.length).toFixed(1);
  };
  
  // Get positive review count
  const getPositiveReviewCount = (feedback) => {
    if (!feedback || feedback.length === 0) return 0;
    return feedback.filter(item => item.rating >= 4).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      {confettiActive && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
        />
      )}
      <Navbar courseType={courseType} />
      <div className="container mx-auto px-4 py-20 flex-grow">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500"
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
            
            <h2 className={`text-3xl font-bold mb-4 text-center ${styles.textColor}`}>הסרטון הועלה בהצלחה!</h2>
            
            {loading ? (
              <div className="mt-6">
                <p className="text-gray-600 mb-4 text-center">טוען פרטי סרטון...</p>
                <div className="flex justify-center">
                  <CountdownTimer seconds={10} />
                </div>
              </div>
            ) : videoData ? (
              <>
                <p className="text-gray-600 text-lg mb-4 text-center">
                  הסרטון <span className="font-semibold">{videoData.title}</span> הועלה בהצלחה וזמין עכשיו לסטודנטים.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-center text-sm">
                    <span className="font-medium">שים לב:</span> עיבוד הסרטון עשוי לקחת מספר דקות. הסרטון עדיין לא יהיה ניתן לצפייה מיידית.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <Link to={`/courses/${videoData.id}`} className="block">
                      <div className="aspect-video relative">
                        <img 
                          src={getThumbnailUrl()}
                          alt={videoData.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {formatDuration(videoData.video_len)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{videoData.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{videoData.description || 'אין תיאור'}</p>
                        {videoData.feedback && videoData.feedback.length > 0 && (
                          <div className="mt-3 flex items-center gap-1">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {calculateAverageRating(videoData.feedback)} ★
                            </div>
                            <span className="text-xs text-gray-500">
                              ({videoData.feedback.length} ביקורות)
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">פרטי הסרטון:</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">קורס:</span>
                        <span className="font-medium">{videoData.course_name || 'לא ידוע'}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">מרצה:</span>
                        <span className="font-medium">{videoData.tutor_name || 'לא ידוע'}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">אורך הסרטון:</span>
                        <span className="font-medium">{formatDuration(videoData.video_len)}</span>
                      </li>
                      {videoData.price && (
                        <li className="flex justify-between items-center">
                          <span className="text-gray-600">מחיר:</span>
                          <span className="font-medium">₪{videoData.price}</span>
                        </li>
                      )}
                      {videoData.sale_price && (
                        <li className="flex justify-between items-center">
                          <span className="text-gray-600">מחיר מבצע:</span>
                          <span className="font-medium text-red-600">₪{videoData.sale_price}</span>
                        </li>
                      )}
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">מספר חלקים:</span>
                        <span className="font-medium">{videoData.episodes?.length || 0}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">תאריך העלאה:</span>
                        <span className="font-medium">{new Date(videoData.created_at).toLocaleDateString('he-IL')}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-600">קישור לדף הקורס:</span>
                        <Link 
                          to={`/courses/${videoData.id}`}
                          className={`text-sm font-medium px-3 py-1 rounded-full ${styles.buttonPrimary}`}
                        >
                          צפה בדף הקורס
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {videoData.episodes && videoData.episodes.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">חלקי הסרטון ({videoData.episodes.length}):</h3>
                    <div className="space-y-3">
                      {videoData.episodes.map((episode) => (
                        <div key={episode.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">
                              <span className="inline-block w-6 h-6 text-center bg-blue-100 text-blue-800 rounded-full mr-2 text-sm">
                                {episode.episode_index}
                              </span>
                              {episode.title}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatDuration(episode.start_time)} - {formatDuration(episode.end_time)}
                            </span>
                          </div>
                          {episode.description && (
                            <p className="text-sm text-gray-600">{episode.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {videoData.feedback && videoData.feedback.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">ביקורות ({videoData.feedback.length}):</h3>
                      <div className="flex items-center">
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-2">
                          {calculateAverageRating(videoData.feedback)} ★
                        </div>
                        <span className="text-sm text-gray-500">
                          {getPositiveReviewCount(videoData.feedback)} ביקורות חיוביות
                        </span>
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                      {videoData.feedback
                        .filter(review => review.comment && review.comment.trim() !== '')
                        .slice(0, 5)
                        .map(review => (
                          <div key={review.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(review.created_at).toLocaleDateString('he-IL')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-medium text-blue-900 mb-3">מה עכשיו?</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-800">
                    <li>הסרטון שלך זמין כעת בתוך דף הקורס</li>
                    <li>הסרטון בתהליך עיבוד ויהיה זמין לצפייה בדקות הקרובות</li>
                    <li>סטודנטים יכולים לקנות ולצפות בסרטון</li>
                    <li>תוכל לצפות בסטטיסטיקות וניתוחים בלוח המחוונים שלך</li>
                    <li>תוכל לערוך את פרטי הסרטון בכל עת דרך לוח המחוונים</li>
                  </ul>
                  <div className="mt-4 flex justify-center">
                    <p className="text-blue-800 text-center">מועבר ללוח המחוונים באופן אוטומטי בעוד:</p>
                  </div>
                  <div className="flex justify-center mt-2">
                    <CountdownTimer seconds={20} />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                  <Button
                    className={`${styles.buttonPrimary} px-6 py-3 rounded-lg font-medium`}
                    onClick={() => navigate('/dashboard')}
                  >
                    מעבר ללוח המחוונים
                  </Button>
                  
                  <Link
                    to={`/courses/${videoData.id}`}
                    className={`${styles.buttonSecondary || 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-6 py-3 rounded-lg font-medium text-center`}
                  >
                    צפה בדף הקורס
                  </Link>
                  
                  <Button
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-6 py-3 rounded-lg font-medium"
                    onClick={() => navigate('/upload')}
                  >
                    העלאת סרטון נוסף
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">לא נמצאו פרטי הסרטון</p>
                <Button
                  className={`${styles.buttonPrimary} px-6 py-3 rounded-lg font-medium mt-4`}
                  onClick={() => navigate('/dashboard')}
                >
                  מעבר ללוח המחוונים
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 