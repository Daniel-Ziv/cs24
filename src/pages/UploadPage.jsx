/* UploadPage.jsx */
import { useState, useRef, useEffect } from 'react';
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import { courseStyles, courseTypeOptions } from '../config/courseStyles';
import useAuth from '../hooks/useAuth';
import { useUppy } from '../hooks/useUppy';
import { supabase } from '../lib/supabase';
import { showNotification } from '../components/ui/notification';

/* ------------------------------------------------------------------ */
/* 1. constants                                                        */
/* ------------------------------------------------------------------ */

const UPPY_VERSION = '3.3.1';
const UPPY_CSS = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.css`;
const UPPY_JS  = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.js`;
const UPLOAD_FUNCTION_ENDPOINT = process.env.REACT_APP_UPLOAD_FUNCTION_ENDPOINT;

// Add error checking for required environment variable
if (!UPLOAD_FUNCTION_ENDPOINT) {
  console.error('Missing upload function endpoint configuration. Please check your environment setup.');
}

/* ------------------------------------------------------------------ */
/* 2. component                                                        */
/* ------------------------------------------------------------------ */

const uploadCustomThumbnail = async (file, videoId, accessToken) => {
  console.log('Starting uploadCustomThumbnail with:', {
    fileName: file.name,
    videoId,
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL
  });

  // 1) Convert file to base64
  const fileBase64 = await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(',')[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const url = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/upload-thumbnail`;
  console.log('Making request to:', url);

  // 2) POST to your Edge Function
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileBase64,
      fileName: file.name,
      fileType: file.type,
      videoId
    })
  });

  console.log('Response status:', res.status);
  const { url: thumbnailUrl, error } = await res.json();
  if (!res.ok) throw new Error(error || 'Upload failed');
  return thumbnailUrl;
};

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseType, setCourseType] = useState('cs');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailTime, setThumbnailTime] = useState(20); // Default to 20 seconds
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  // Original tutor check states (commented out temporarily)
  /* const [isTutor, setIsTutor] = useState(false);
  const [isCheckingTutor, setIsCheckingTutor] = useState(true); */
  // Temporary override to bypass tutor check
  const [isTutor, setIsTutor] = useState(true);
  const [isCheckingTutor, setIsCheckingTutor] = useState(false);
  
  // New state for courses and degrees
  const [courses, setCourses] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [uppyFiles, setUppyFiles] = useState(0);

  const courseTypeRef = useRef(localStorage.getItem('courseType') || 'cs');
  const auth = useAuth();
  const styles = courseStyles[courseTypeRef.current] || courseStyles.cs;
  
  const { uppyRef, dashRef, progress, uploading, startUpload } = useUppy(auth);

  /* Temporarily disabled tutor status check */
  useEffect(() => {
    const checkTutorStatus = async () => {
      console.log('Checking tutor status...');
      setIsCheckingTutor(true);
      
      if (!auth.session) {
        console.log('No auth session, setting isTutor to false');
        setIsTutor(false);
        setIsCheckingTutor(false);
        return;
      }

      try {
        console.log('Making RPC call to check tutor status...');
        const { data, error } = await supabase.rpc('is_tutor_and_id', {
          p_user_id: auth.session.user.id
        });

        if (error) {
          console.error('Error checking tutor status:', error);
          setIsTutor(false);
        } else {
          console.log('Tutor status result:', data);
          // Access the is_tutor property from the first object in the array
          const isTutorResult = data?.[0]?.is_tutor ?? false;
          //setIsTutor(isTutorResult);
          setIsTutor(true);
        }
      } catch (err) {
        console.error('Exception checking tutor status:', err);
        setIsTutor(false);
      } finally {
        setIsCheckingTutor(false);
      }
    };

    checkTutorStatus();
  }, [auth.session]);

  // Fetch courses data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.rpc("get_courses_with_degree");
        if (error) {
          console.error('Error fetching courses:', error);
          showNotification('שגיאה בטעינת הקורסים', 'error');
        } else {
          console.log('Courses data:', data);
          setCourses(data);
        }
      } catch (err) {
        console.error('Exception fetching courses:', err);
        showNotification('שגיאה בטעינת הקורסים', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Get unique degrees from courses
  const degrees = [...new Set(courses.map(course => course.degree_name))];
  
  // Get filtered courses for selected degree
  const filteredCourses = courses.filter(
    course => course.degree_name === selectedDegree
  );

  const handleDegreeChange = (e) => {
    const newDegree = e.target.value;
    setSelectedDegree(newDegree);
    setSelectedCourse(''); // Reset course selection when degree changes
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview); // Clean up the preview URL
    }
    setThumbnailPreview(null);
    setThumbnailUrl(null);
  };

  const handleUpload = async () => {
    console.log('Starting handleUpload...');
    let thumbnailUrl = null;

    try {
      // First handle thumbnail upload if one was selected
      if (thumbnail) {
        console.log('Thumbnail selected, starting upload...');
        setIsUploadingThumbnail(true);
        try {
          // We'll use a temporary ID for the thumbnail upload
          const tempVideoId = 'temp-' + Date.now();
          thumbnailUrl = await uploadCustomThumbnail(
            thumbnail,
            tempVideoId,
            auth.session.access_token
          );
          console.log('Thumbnail uploaded successfully:', thumbnailUrl);
        } catch (error) {
          console.error('Error uploading thumbnail:', error);
          showNotification('שגיאה בהעלאת התמונה הממוזערת', 'error');
          return;
        } finally {
          setIsUploadingThumbnail(false);
        }
      } else {
        console.log('No thumbnail selected, skipping upload');
      }

      // Then handle video upload
      const result = await startUpload(
        title, 
        description, 
        selectedDegree, 
        selectedCourse, // This is the course_id
        thumbnail, 
        price, 
        salePrice
      );
      console.log('Video upload result:', result);
      
      if (result.success) {
        // Insert video data
        const { data: tutorId, error: tutorError } = await supabase.rpc("get_tutor_id_by_user_id", {
          p_user_id: auth.session.user.id
        });
        
        if (tutorError) {
          console.error('Error getting tutor ID:', tutorError);
          showNotification('שגיאה בקבלת מזהה מורה', 'error');
          return;
        }
        
        if (!tutorId) {
          console.error('No tutor ID found for user');
          showNotification('לא נמצא מזהה מורה למשתמש', 'error');
          return;
        }

        console.log("Using Tutor ID:", tutorId);

        const payload = {
          p_tutor_id: tutorId,
          p_course_id: selectedCourse, // This is the course_id from the select
          p_video_uid: result.videoId,
          p_title: title,
          p_price: parseInt(price),
          p_sale_price: salePrice ? parseInt(salePrice) : null,
          p_description: description,
          p_video_len: result.duration,
          p_thumbnail: thumbnailTime,
          p_custom_thumbnail_url: thumbnailUrl
        };

        console.log("Inserting video with payload:", payload);

        await supabase.rpc('insert_video_course', payload);

        // Clear form fields
        setTitle('');
        setDescription('');
        setSelectedDegree('');
        setSelectedCourse('');
        setThumbnail(null);
        setThumbnailPreview(null);
        setThumbnailUrl(null);
        setThumbnailTime(20);
        setPrice('');
        setSalePrice('');
        
        showNotification('הסרטון הועלה בהצלחה', 'success');
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      showNotification('שגיאה בתהליך ההעלאה', 'error');
    }
  };

  // Add effect to monitor Uppy files
  useEffect(() => {
    const interval = setInterval(() => {
      const filesCount = uppyRef.current?.getFiles().length || 0;
      if (filesCount !== uppyFiles) {
        setUppyFiles(filesCount);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [uppyFiles]);

  // Modify the button enable effect to use uppyFiles state
  useEffect(() => {
    // Check if either custom thumbnail or thumbnail time is set
    const hasThumbnailOption = !!thumbnail || (!thumbnail && thumbnailTime > 0);

    const enabled = !uploading && 
      !!auth.session && 
      !isCheckingTutor && 
      isTutor && 
      !!title.trim() && 
      !!description.trim() &&  // Add description requirement
      hasThumbnailOption &&    // Modified thumbnail condition
      !!price &&
      !!selectedDegree &&
      !!selectedCourse &&
      uppyFiles > 0;

    setIsButtonEnabled(enabled);

    console.log('Button enabled state:', enabled, {
      uploading,
      hasSession: !!auth.session,
      isCheckingTutor,
      isTutor,
      hasTitle: !!title.trim(),
      hasDescription: !!description.trim(),  // Add to logging
      hasThumbnailOption,                    // Add to logging
      hasCustomThumbnail: !!thumbnail,       // Add to logging
      thumbnailTime,                         // Add to logging
      hasPrice: !!price,
      selectedDegree,
      selectedCourse,
      hasFiles: uppyFiles
    });
  }, [uploading, auth.session, isCheckingTutor, isTutor, title, description, thumbnail, thumbnailTime, price, selectedDegree, selectedCourse, uppyFiles]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      <Navbar courseType={courseTypeRef.current} />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className={`text-4xl font-bold mb-8 text-center ${styles.textColor}`}>
          העלאת סרטוני לימוד
        </h1>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border">
            <CardHeader className={`bg-gradient-to-r ${styles.cardBg} text-white rounded-t-lg`}>
              <CardTitle className="text-xl md:text-2xl">העלה סרטון חדש</CardTitle>
              <CardDescription className="text-white/90">
                העלה סרטוני לימוד לשיתוף עם הקהילה
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {!auth.session && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Info className="text-red-500 shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold">עליך להתחבר כדי להעלות סרטונים</p>
                    <p className="text-red-700 text-sm mt-1">לחץ על כפתור ההתחברות בתפריט העליון</p>
                  </div>
                </div>
              )}

              {auth.session && !isCheckingTutor && !isTutor && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <Info className="text-yellow-500 shrink-0" />
                  <div>
                    <p className="text-yellow-800 font-semibold">רק מורים יכולים להעלות סרטונים</p>
                    <p className="text-yellow-700 text-sm mt-1">אנא צור קשר עם מנהל המערכת לקבלת הרשאות מורה</p>
                  </div>
                </div>
              )}

              {/* Degree Selection */}
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                  תואר *
                </label>
                <select
                  id="degree"
                  value={selectedDegree}
                  onChange={handleDegreeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!auth.session || loading}
                >
                  <option value="">בחר תואר</option>
                  {degrees.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                  קורס *
                </label>
                <select
                  id="course"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!auth.session || loading || !selectedDegree}
                >
                  <option value="">בחר קורס</option>
                  {filteredCourses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Input */}
              <LabeledInput
                id="videoTitle"
                label="כותרת הסרטון *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="הזן כותרת לסרטון"
                disabled={!auth.session}
              />

              {/* Description Textarea */}
              <LabeledTextarea
                id="videoDescription"
                label="תיאור הסרטון"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="תאר במה עוסק הסרטון (לא חובה)"
                disabled={!auth.session}
              />

              {/* Thumbnail Upload */}
              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                  תמונה ממוזערת *
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!auth.session || isUploadingThumbnail}
                  />
                  {thumbnail && (
                    <button
                      type="button"
                      onClick={handleRemoveThumbnail}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-200"
                      disabled={isUploadingThumbnail}
                    >
                      הסר תמונה
                    </button>
                  )}
                </div>
                {thumbnailPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">תצוגה מקדימה:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {isUploadingThumbnail && (
                  <div className="mt-2 text-sm text-blue-600">
                    מעלה תמונה ממוזערת...
                  </div>
                )}
              </div>

              {/* Thumbnail Time Selection - Only show if no custom thumbnail is selected */}
              {!thumbnail && (
                <div>
                  <label htmlFor="thumbnailTime" className="block text-sm font-medium text-gray-700 mb-1">
                    זמן תמונה ממוזערת (שניות) *
                  </label>
                  <input
                    type="number"
                    id="thumbnailTime"
                    value={thumbnailTime}
                    onChange={(e) => setThumbnailTime(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="הזן זמן בשניות"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    הזן את הזמן בשניות שבו תרצה שהתמונה הממוזערת תילקח מהסרטון
                  </p>
                </div>
              )}

              {/* Price Input */}
              <LabeledInput
                id="price"
                label="מחיר (₪) *"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="הזן מחיר"
                disabled={!auth.session}
              />

              {/* Sale Price Input */}
              <LabeledInput
                id="salePrice"
                label="מחיר מבצע (₪)"
                type="number"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                placeholder="הזן מחיר מבצע (לא חובה)"
                disabled={!auth.session}
              />

              {/* Uppy dashboard */}
              <div ref={dashRef} />

              <Button
                className={styles.buttonPrimary}
                onClick={handleUpload}
                disabled={!isButtonEnabled}
              >
                {uploading ? 'מעלה...' : 
                 !auth.session ? 'יש להתחבר תחילה' : 
                 isCheckingTutor ? 'בודק הרשאות...' :
                 !isTutor ? 'אין הרשאת מורה' : 
                 'העלה סרטון'}
              </Button>

              {uploading && <ProgressBar percent={progress} styles={styles} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ id, label, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...rest}
      />
    </div>
  );
}

function LabeledTextarea({ id, label, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...rest}
      />
    </div>
  );
}

function ProgressBar({ percent, styles }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>מעלה סרטון...</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${styles.buttonPrimary}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
