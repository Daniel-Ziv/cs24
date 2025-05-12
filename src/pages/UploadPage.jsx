/* UploadPage.jsx */
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Info } from "lucide-react";
import Navbar from "../components/Navbar";
import { courseStyles, courseTypeOptions } from "../config/courseStyles";
import useAuth from "../hooks/useAuth";
import { useUppy } from "../hooks/useUppy";
import { supabase } from "../lib/supabase";
import { showNotification } from "../components/ui/notification";

/* ------------------------------------------------------------------ */
/* 1. constants                                                        */
/* ------------------------------------------------------------------ */

const UPPY_VERSION = "3.3.1";
const UPPY_CSS = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.css`;
const UPPY_JS = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.js`;
const UPLOAD_FUNCTION_ENDPOINT = process.env.REACT_APP_UPLOAD_FUNCTION_ENDPOINT;

// Add error checking for required environment variable
if (!UPLOAD_FUNCTION_ENDPOINT) {
  console.error(
    "Missing upload function endpoint configuration. Please check your environment setup."
  );
}

/* ------------------------------------------------------------------ */
/* 2. component                                                        */
/* ------------------------------------------------------------------ */

const uploadCustomThumbnail = async (file, videoId, accessToken) => {
  console.log("Starting uploadCustomThumbnail with:", {
    fileName: file.name,
    videoId,
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  });

  // 1) Convert file to base64
  const fileBase64 = await new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(",")[1]);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const url = `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/upload-thumbnail`;
  console.log("Making request to:", url);

  // 2) POST to your Edge Function
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileBase64,
      fileName: file.name,
      fileType: file.type,
      videoId,
    }),
  });

  console.log("Response status:", res.status);
  const { url: thumbnailUrl, error } = await res.json();
  if (!res.ok) throw new Error(error || "Upload failed");
  return thumbnailUrl;
};

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseType, setCourseType] = useState("cs");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailTime, setThumbnailTime] = useState(20); // Default to 20 seconds
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  // Original tutor check states (commented out temporarily)
  /* const [isTutor, setIsTutor] = useState(false);
  const [isCheckingTutor, setIsCheckingTutor] = useState(true); */
  // Temporary override to bypass tutor check
  const [isTutor, setIsTutor] = useState(true);
  const [isCheckingTutor, setIsCheckingTutor] = useState(false);

  // New state for courses and degrees
  const [courses, setCourses] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [uppyFiles, setUppyFiles] = useState(0);

  // New state for additional fields
  const [topicNumber, setTopicNumber] = useState("");
  const [topicName, setTopicName] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const courseTypeRef = useRef(localStorage.getItem("courseType") || "cs");
  const auth = useAuth();
  const styles = courseStyles[courseTypeRef.current] || courseStyles.cs;

  const { uppyRef, dashRef, progress, uploading, startUpload } = useUppy(auth);

  /* Temporarily disabled tutor status check */
  useEffect(() => {
    const checkTutorStatus = async () => {
      console.log("Checking tutor status...");
      setIsCheckingTutor(true);

      if (!auth.session) {
        console.log("No auth session, setting isTutor to false");
        setIsTutor(false);
        setIsCheckingTutor(false);
        return;
      }

      try {
        console.log("Making RPC call to check tutor status...");
        const { data, error } = await supabase.rpc("is_tutor_and_id", {
          p_user_id: auth.session.user.id,
        });

        if (error) {
          console.error("Error checking tutor status:", error);
          setIsTutor(false);
        } else {
          console.log("Tutor status result:", data);
          // Access the is_tutor property from the first object in the array
          const isTutorResult = data?.[0]?.is_tutor ?? false;
          //setIsTutor(isTutorResult);
          setIsTutor(true);
        }
      } catch (err) {
        console.error("Exception checking tutor status:", err);
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
          console.error("Error fetching courses:", error);
          showNotification("שגיאה בטעינת הקורסים", "error");
        } else {
          console.log("Courses data:", data);
          setCourses(data);
        }
      } catch (err) {
        console.error("Exception fetching courses:", err);
        showNotification("שגיאה בטעינת הקורסים", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Get unique degrees from courses
  const degrees = [...new Set(courses.map((course) => course.degree_name))];

  // Get filtered courses for selected degree
  const filteredCourses = courses.filter(
    (course) => course.degree_name === selectedDegree
  );

  const handleDegreeChange = (e) => {
    const newDegree = e.target.value;
    setSelectedDegree(newDegree);
    setSelectedCourse(""); // Reset course selection when degree changes
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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
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
    console.log("Starting handleUpload...");
    let thumbnailUrl = null;

    try {
      // First handle thumbnail upload if one was selected
      if (thumbnail) {
        console.log("Thumbnail selected, starting upload...");
        setIsUploadingThumbnail(true);
        try {
          // We'll use a temporary ID for the thumbnail upload
          const tempVideoId = "temp-" + Date.now();
          thumbnailUrl = await uploadCustomThumbnail(
            thumbnail,
            tempVideoId,
            auth.session.access_token
          );
          console.log("Thumbnail uploaded successfully:", thumbnailUrl);
        } catch (error) {
          console.error("Error uploading thumbnail:", error);
          showNotification("שגיאה בהעלאת התמונה הממוזערת", "error");
          return;
        } finally {
          setIsUploadingThumbnail(false);
        }
      } else {
        console.log("No thumbnail selected, skipping upload");
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
      console.log("Video upload result:", result);

      if (result.success) {
        // Insert video data
        const { data: tutorId, error: tutorError } = await supabase.rpc(
          "get_tutor_id_by_user_id",
          {
            p_user_id: auth.session.user.id,
          }
        );

        if (tutorError) {
          console.error("Error getting tutor ID:", tutorError);
          showNotification("שגיאה בקבלת מזהה מורה", "error");
          return;
        }

        if (!tutorId) {
          console.error("No tutor ID found for user");
          showNotification("לא נמצא מזהה מורה למשתמש", "error");
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
          p_custom_thumbnail_url: thumbnailUrl,
          // New fields
          p_topic_number: parseInt(topicNumber),
          p_topic_name: topicName,
          p_chapter_number: parseInt(chapterNumber),
          p_chapter_name: chapterName,
        };

        console.log("Inserting video with payload:", payload);

        await supabase.rpc("insert_video_course", payload);

        // Clear form fields
        setTitle("");
        setDescription("");
        setSelectedDegree("");
        setSelectedCourse("");
        setThumbnail(null);
        setThumbnailPreview(null);
        setThumbnailUrl(null);
        setThumbnailTime(20);
        setPrice("");
        setSalePrice("");
        setTopicNumber("");
        setTopicName("");
        setChapterNumber("");
        setChapterName("");
        setVideoFile(null);

        showNotification("הסרטון הועלה בהצלחה", "success");
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      showNotification("שגיאה בתהליך ההעלאה", "error");
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

  // Modify the button enable effect to use uppyFiles state and new fields
  useEffect(() => {
    // Check if either custom thumbnail or thumbnail time is set
    const hasThumbnailOption = !!thumbnail || (!thumbnail && thumbnailTime > 0);

    const enabled =
      !uploading &&
      !!auth.session &&
      !isCheckingTutor &&
      isTutor &&
      !!title.trim() &&
      !!description.trim() &&
      hasThumbnailOption &&
      !!price &&
      !!selectedDegree &&
      !!selectedCourse &&
      !!topicNumber.trim() &&
      !!topicName.trim() &&
      !!chapterNumber.trim() &&
      !!chapterName.trim() &&
      (uppyFiles > 0 || !!videoFile);

    setIsButtonEnabled(enabled);

    console.log("Button enabled state:", enabled, {
      uploading,
      hasSession: !!auth.session,
      isCheckingTutor,
      isTutor,
      hasTitle: !!title.trim(),
      hasDescription: !!description.trim(),
      hasThumbnailOption,
      hasCustomThumbnail: !!thumbnail,
      thumbnailTime,
      hasPrice: !!price,
      selectedDegree,
      selectedCourse,
      hasTopicNumber: !!topicNumber.trim(),
      hasTopicName: !!topicName.trim(),
      hasChapterNumber: !!chapterNumber.trim(),
      hasChapterName: !!chapterName.trim(),
      hasFiles: uppyFiles,
      hasVideoFile: !!videoFile,
    });
  }, [
    uploading,
    auth.session,
    isCheckingTutor,
    isTutor,
    title,
    description,
    thumbnail,
    thumbnailTime,
    price,
    selectedDegree,
    selectedCourse,
    uppyFiles,
    topicNumber,
    topicName,
    chapterNumber,
    chapterName,
    videoFile,
  ]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100"
      dir="rtl"
    >
      <Navbar courseType={courseTypeRef.current} />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="text-center mb-16 relative">
          <h1
            className={`text-5xl font-bold ${styles.textColor} mb-4 relative inline-block`}
          >
            <span className="relative z-10">העלאת סרטוני לימוד</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300 opacity-30 transform -rotate-1 z-0"></span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4 leading-relaxed">
            שתף את הידע שלך עם הקהילה ועזור לסטודנטים להצליח בלימודים
          </p>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <svg
              width="120"
              height="12"
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2C10 7 30 10 60 10C90 10 110 7 118 2"
                stroke={styles.textColor.replace("text-", "var(--")}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <CardHeader
              className={`bg-gradient-to-r ${styles.cardBg} text-white py-10 rounded-t-xl relative overflow-hidden`}
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
              </div>
              <CardTitle className="text-3xl font-bold relative z-10">
                העלה סרטון חדש
              </CardTitle>
              <CardDescription className="text-white/90 text-lg mt-2 relative z-10">
                העלה סרטוני לימוד לשיתוף עם הקהילה
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-8 bg-white">
              {!auth.session && (
                <div className="bg-red-50 border-r-4 border-red-500 rounded-lg p-5 mb-6 flex items-center gap-4 shadow-sm">
                  <Info className="text-red-500 shrink-0 h-8 w-8" />
                  <div>
                    <p className="text-red-800 font-semibold text-lg">
                      עליך להתחבר כדי להעלות סרטונים
                    </p>
                    <p className="text-red-700 mt-1">
                      לחץ על כפתור ההתחברות בתפריט העליון
                    </p>
                  </div>
                </div>
              )}

              {auth.session && !isCheckingTutor && !isTutor && (
                <div className="bg-yellow-50 border-r-4 border-yellow-500 rounded-lg p-5 mb-6 flex items-center gap-4 shadow-sm">
                  <Info className="text-yellow-500 shrink-0 h-8 w-8" />
                  <div>
                    <p className="text-yellow-800 font-semibold text-lg">
                      רק מורים יכולים להעלות סרטונים
                    </p>
                    <p className="text-yellow-700 mt-1">
                      אנא צור קשר עם מנהל המערכת לקבלת הרשאות מורה
                    </p>
                  </div>
                </div>
              )}

              {/* Form sections with grouping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Course Information Section */}
                <div className="col-span-full bg-blue-50/50 p-8 rounded-xl shadow-sm border border-blue-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-5 border-b pb-3">
                    <div className="mr-3 bg-blue-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold ${styles.textColor}`}>
                      מידע על הקורס
                    </h3>
                  </div>

                  {/* Degree Selection */}
                  <div className="mb-5">
                    <label
                      htmlFor="degree"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      תואר <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="degree"
                      value={selectedDegree}
                      onChange={handleDegreeChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={!auth.session || loading}
                    >
                      <option value="">בחר תואר</option>
                      {degrees.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      התואר האקדמי אליו משתייך הקורס (למשל, מדעי המחשב)
                    </p>
                  </div>

                  {/* Course Selection */}
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      קורס <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="course"
                      value={selectedCourse}
                      onChange={handleCourseChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      disabled={!auth.session || loading || !selectedDegree}
                    >
                      <option value="">בחר קורס</option>
                      {filteredCourses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                      שם הקורס (למשל, מבני נתונים, אלגוריתמים)
                    </p>
                  </div>
                </div>

                {/* Topic Information Section */}
                <div className="col-span-full bg-green-50/50 p-8 rounded-xl shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-5 border-b pb-3">
                    <div className="mr-3 bg-green-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-700">
                      מידע על הנושא
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Topic Number Input */}
                    <LabeledInput
                      id="topicNumber"
                      label="מספר נושא בתוך הקורס"
                      type="number"
                      min="1"
                      value={topicNumber}
                      onChange={(e) => setTopicNumber(e.target.value)}
                      placeholder="לדוג': 1"
                      disabled={!auth.session}
                      helperText="מספר סידורי של הנושא בתוך הקורס. קובע את סדר הנושאים."
                      required={true}
                    />

                    {/* Topic Name Input */}
                    <LabeledInput
                      id="topicName"
                      label="שם הנושא"
                      value={topicName}
                      onChange={(e) => setTopicName(e.target.value)}
                      placeholder="לדוג': עצים, רשימות מקושרות"
                      disabled={!auth.session}
                      helperText="הנושא המרכזי אליו שייך הסרטון."
                      required={true}
                    />

                    {/* Chapter Number Input */}
                    <LabeledInput
                      id="chapterNumber"
                      label="מספר פרק בתוך הנושא"
                      type="number"
                      min="1"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(e.target.value)}
                      placeholder="לדוג': 1"
                      disabled={!auth.session}
                      helperText="סדר הסרטון בתוך הנושא (משמש למיון סרטונים)."
                      required={true}
                    />

                    {/* Chapter Name Input */}
                    <LabeledInput
                      id="chapterName"
                      label="שם הפרק"
                      value={chapterName}
                      onChange={(e) => setChapterName(e.target.value)}
                      placeholder="לדוג': מהי רקורסיה?"
                      disabled={!auth.session}
                      helperText="שם הפרק או הנושא המשני של הסרטון."
                      required={true}
                    />
                  </div>
                </div>

                {/* Video Details Section */}
                <div className="col-span-full bg-purple-50/50 p-8 rounded-xl shadow-sm border border-purple-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-5 border-b pb-3">
                    <div className="mr-3 bg-purple-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-purple-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-purple-700">
                      פרטי הסרטון
                    </h3>
                  </div>

                  {/* Title Input */}
                  <LabeledInput
                    id="videoTitle"
                    label="כותרת הסרטון"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="הזן כותרת לסרטון"
                    disabled={!auth.session}
                    helperText="כותרת הסרטון, נראית לסטודנטים."
                    required={true}
                  />

                  {/* Description Textarea */}
                  <LabeledTextarea
                    id="videoDescription"
                    label="תיאור הסרטון"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="תאר במה עוסק הסרטון (לא חובה)"
                    disabled={!auth.session}
                    helperText="תיאור קצר של מה שהסרטון מכסה."
                  />
                </div>

                {/* Upload Section */}
                <div className="col-span-full bg-amber-50/50 p-8 rounded-xl shadow-sm border border-amber-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-5 border-b pb-3">
                    <div className="mr-3 bg-amber-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-amber-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-amber-700">
                      העלאת קבצים
                    </h3>
                  </div>

                  {/* Video Upload */}
                  <div className="mb-6">
                    <label
                      htmlFor="videoFile"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      סרטון <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-all duration-300 hover:border-blue-500 group bg-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="file"
                        id="videoFile"
                        accept="video/mp4,video/mov,video/webm"
                        onChange={handleVideoChange}
                        className="hidden"
                        disabled={!auth.session || uploading}
                      />
                      <label
                        htmlFor="videoFile"
                        className="cursor-pointer flex flex-col items-center justify-center py-8 relative z-10 transition-transform duration-300 group-hover:transform group-hover:scale-105"
                      >
                        <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 transition-all duration-300 group-hover:bg-blue-200 group-hover:text-blue-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                        <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                          {videoFile
                            ? videoFile.name
                            : "בחר קובץ וידאו או גרור לכאן"}
                        </span>
                        <span className="text-sm text-gray-500 mt-2 transition-colors duration-300 group-hover:text-gray-600">
                          פורמטים מקובלים: .mp4, .mov, .webm
                        </span>
                        {videoFile && (
                          <div className="mt-3 inline-flex items-center text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            קובץ נבחר
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="mb-6">
                    <label
                      htmlFor="thumbnail"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      תמונה ממוזערת <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-xl p-4 text-center transition-all duration-300 group relative overflow-hidden ${
                        thumbnailPreview
                          ? "border-green-300 bg-green-50/50"
                          : "border-gray-300 hover:border-blue-500 bg-white"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        disabled={!auth.session || isUploadingThumbnail}
                      />

                      {!thumbnailPreview ? (
                        <label
                          htmlFor="thumbnail"
                          className="cursor-pointer flex flex-col items-center justify-center py-8 relative z-10 transition-transform duration-300 group-hover:transform group-hover:scale-105"
                        >
                          <div className="w-16 h-16 mb-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 transition-all duration-300 group-hover:bg-amber-200 group-hover:text-amber-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                            בחר תמונה ממוזערת או גרור לכאן
                          </span>
                        </label>
                      ) : (
                        <div className="relative py-4">
                          <div className="relative rounded-lg overflow-hidden shadow-md mx-auto max-w-sm transition-transform duration-300 hover:transform hover:scale-102">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveThumbnail}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                            disabled={isUploadingThumbnail}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <div className="mt-3 inline-flex items-center text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            תמונה נבחרה
                          </div>
                        </div>
                      )}

                      {isUploadingThumbnail && (
                        <div className="mt-3 text-sm text-blue-600 flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          מעלה תמונה ממוזערת...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Time Selection - Only show if no custom thumbnail is selected */}
                  {!thumbnail && (
                    <div className="mb-6">
                      <label
                        htmlFor="thumbnailTime"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        זמן תמונה ממוזערת (שניות){" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="thumbnailTime"
                        value={thumbnailTime}
                        onChange={(e) =>
                          setThumbnailTime(
                            Math.max(0, parseInt(e.target.value) || 0)
                          )
                        }
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="לדוג': 20"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        זמן (בשניות) לחילוץ תמונה ממוזערת מהסרטון
                      </p>
                    </div>
                  )}
                </div>

                {/* Pricing Section */}
                <div className="col-span-full bg-teal-50/50 p-8 rounded-xl shadow-sm border border-teal-100 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center mb-5 border-b pb-3">
                    <div className="mr-3 bg-teal-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-teal-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-teal-700">תמחור</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Price Input */}
                    <LabeledInput
                      id="price"
                      label="מחיר (₪)"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="הזן מחיר"
                      disabled={!auth.session}
                      helperText="המחיר הרגיל של הסרטון בשקלים."
                      required={true}
                    />

                    {/* Sale Price Input */}
                    <LabeledInput
                      id="salePrice"
                      label="מחיר מבצע (₪)"
                      type="number"
                      min="0"
                      step="0.01"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="אם יש"
                      disabled={!auth.session}
                      helperText="מחיר מבצע (אם קיים)."
                    />
                  </div>
                </div>
              </div>

              {/* Uppy dashboard */}
              <div ref={dashRef} className="mt-6" />

              <div className="mt-10 flex flex-col items-center">
                <Button
                  className={`relative w-full max-w-md py-6 text-lg font-bold rounded-xl transition-all duration-500 overflow-hidden group ${
                    isButtonEnabled
                      ? `${styles.buttonPrimary} hover:shadow-lg hover:shadow-blue-200/50 transform hover:-translate-y-1`
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleUpload}
                  disabled={!isButtonEnabled}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {!uploading && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 group-hover:animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    )}
                    {uploading
                      ? "מעלה..."
                      : !auth.session
                      ? "יש להתחבר תחילה"
                      : isCheckingTutor
                      ? "בודק הרשאות..."
                      : !isTutor
                      ? "אין הרשאת מורה"
                      : "העלה סרטון"}
                  </span>
                  {isButtonEnabled && !uploading && (
                    <span className="absolute inset-0 h-full w-full bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500"></span>
                  )}
                </Button>

                {uploading && (
                  <div className="space-y-4 w-full max-w-md mt-8 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-blue-700 flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        מעלה סרטון...
                      </span>
                      <span className="text-gray-800 font-bold">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner relative">
                      <div
                        className="h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{
                          width: `${progress}%`,
                          background:
                            "linear-gradient(90deg, #3b82f6, #2563eb)",
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-white/30"
                          style={{
                            backgroundImage:
                              "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                            backgroundSize: "1rem 1rem",
                            animation: "progress-animation 1s linear infinite",
                          }}
                        ></div>
                      </div>
                    </div>
                    <style jsx>{`
                      @keyframes progress-animation {
                        0% {
                          background-position: 1rem 0;
                        }
                        100% {
                          background-position: 0 0;
                        }
                      }
                    `}</style>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ id, label, helperText, required, ...rest }) {
  return (
    <div className="mb-5 group">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
          {...rest}
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none border border-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
      </div>
      {helperText && (
        <p className="mt-2 text-sm text-gray-500 group-focus-within:text-blue-600 transition-colors duration-200">
          {helperText}
        </p>
      )}
    </div>
  );
}

function LabeledTextarea({ id, label, helperText, required, ...rest }) {
  return (
    <div className="mb-5 group">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <textarea
          id={id}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-400"
          {...rest}
        />
        <div className="absolute inset-0 rounded-lg pointer-events-none border border-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
      </div>
      {helperText && (
        <p className="mt-2 text-sm text-gray-500 group-focus-within:text-blue-600 transition-colors duration-200">
          {helperText}
        </p>
      )}
    </div>
  );
}
