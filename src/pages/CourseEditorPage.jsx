/* CourseEditorPage.jsx */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardTitle, CardContent, CardDescription
} from '../components/ui/card';
import { CardFooter } from '../components/ui/card-footer';
import { Button } from '../components/ui/button';
import { 
  ChevronLeft, Plus, Trash2, MoveUp, MoveDown, 
  Video, Folder, Save, FileVideo, Edit, Check, X, Info, RefreshCw, Pencil, ChevronUp, ChevronDown, Badge, Upload, Loader2, Trash
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { courseStyles } from '../config/courseStyles';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { showNotification } from '../components/ui/notification';
import { v4 as uuidv4 } from 'uuid';
import { useTusUpload } from '../hooks/useTusUpload';
import CourseDetailsEditModal from '../components/CourseDetailsEditModal';
import DeleteVideoModal from '../components/DeleteVideoModal';
import DeleteChapterModal from '../components/DeleteChapterModal';

// Hardcoded endpoints
const GET_EDIT_COURSE_ENDPOINT = '/functions/v1/get-edit-course-page';
const SAVE_COURSE_ENDPOINT = '/functions/v1/save-course';

export default function CourseEditorPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const courseTypeRef = useRef(localStorage.getItem('courseType') || 'cs');
  const styles = courseStyles[courseTypeRef.current] || courseStyles.cs;
  
  // Authorization state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Course metadata
  const [courseData, setCourseData] = useState({
    id: courseId,
    title: '',
    description: '',
    thumbnailUrl: '',
    price: 0,
    salePrice: null,
    status: 'draft'
  });
  
  // Course content structure
  const [chapters, setChapters] = useState([
    {
      id: uuidv4(),
      title: 'פרק 1: מבוא לקורס',
      description: 'סקירה כללית של נושאי הקורס',
      isEditing: false,
      videos: [
        {
          id: uuidv4(),
          title: 'הקדמה והצגת הקורס',
          description: 'היכרות עם המרצה ומבנה הקורס',
          duration: '05:30',
          status: 'pending',
          isEditing: false
        }
      ]
    }
  ]);
  
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadConfig, setUploadConfig] = useState({
    createUploadEndpoint: '',
    confirmUploadEndpoint: '',
    uploadCourseMetadataEndpoint: '',
    chunkSize: 5242880, // Default 5MB
    tusVersion: '1.0.0',
    allowedOrigins: '',
    requiredVideoVersion: '1'
  });
  const [currentUpload, setCurrentUpload] = useState({
    chapterId: null,
    videoId: null,
    progress: 0
  });
  
  const [deletedVideos, setDeletedVideos] = useState([]);
  
  const { upload, uploadProgress, isUploading: isTusUploading, error: tusError, abort } = useTusUpload(auth);
  
  // Add this near the other state declarations
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Add new state for delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  
  // Add new state for delete chapter modal
  const [deleteChapterModalOpen, setDeleteChapterModalOpen] = useState(false);
  const [pendingChapterDelete, setPendingChapterDelete] = useState(null);
  
  /* Use the endpoint to check authorization status and fetch course data */
  useEffect(() => {
    const fetchCourseData = async () => {
      setIsCheckingAuth(true);
      setLoading(true);
      
      if (!auth.session) {
        setIsAuthorized(false);
        setIsCheckingAuth(false);
        setLoading(false);
        return;
      }

      try {
        // Get the Supabase URL from the client
        const supabaseUrl = supabase.supabaseUrl;
        const editCourseEndpoint = `${supabaseUrl}${GET_EDIT_COURSE_ENDPOINT}?video_id=${courseId}`;
        
        // Call the endpoint to check authorization and get course data
        const response = await fetch(editCourseEndpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.session.access_token}`
          }
        });

        // Parse the response body
        const responseData = await response.json();

        if (!response.ok || responseData.error) {
          console.log('User not authorized or course not found:', responseData.error || 'Unknown error');
          setIsAuthorized(false);
          setIsCheckingAuth(false);
          setLoading(false);
          
          // Redirect to no access page
          navigate('/no-access');
          return;
        }

        // Extract the video course data
        const videoCourse = responseData.video_course || {};
        
        // Set course data
        setCourseData({
          id: videoCourse.id || courseId,
          title: videoCourse.title || '',
          description: videoCourse.description || '',
          thumbnailUrl: videoCourse.custom_thumbnail_url || 'https://via.placeholder.com/800x450',
          price: videoCourse.price || 0,
          salePrice: videoCourse.sale_price || null,
          status: videoCourse.shown ? 'published' : 'draft',
          courseId: videoCourse.course_id,
          videoUid: videoCourse.video_uid
        });
        
        // Process video titles and episodes to create chapters structure
        if (videoCourse.video_titles && videoCourse.video_titles.length > 0) {
          const formattedChapters = videoCourse.video_titles.map(title => {
            // Sort episodes by episode_index
            const episodes = title.video_episodes || [];
            const sortedEpisodes = [...episodes].sort((a, b) => a.episode_index - b.episode_index);
            
            return {
              id: String(title.id),
              title: title.title || 'פרק ללא כותרת',
              description: '', // Not provided in the data
              isEditing: false,
              videos: sortedEpisodes.map(episode => ({
                id: String(episode.id),
                title: episode.title || '',
                description: episode.description || '',
                episode_len: episode.episode_len || 0,
                status: episode.video_uid ? 'uploaded' : 'pending',
                videoUid: episode.video_uid,
                episodeIndex: episode.episode_index,
                isEditing: false
              }))
            };
          });
          
          setChapters(formattedChapters);
        } else {
          // If no chapters data, keep default chapter
          setChapters([
            {
              id: uuidv4(),
              title: 'פרק 1: מבוא לקורס',
              description: 'סקירה כללית של נושאי הקורס',
              isEditing: false,
              videos: [
                {
                  id: uuidv4(),
                  title: 'הקדמה והצגת הקורס',
                  description: 'היכרות עם המרצה ומבנה הקורס',
                  duration: '05:30',
                  status: 'pending',
                  isEditing: false
                }
              ]
            }
          ]);
        }
        
        // Set config from response
        if (responseData.createUploadEndpoint) {
          setUploadConfig({
            createUploadEndpoint: responseData.createUploadEndpoint,
            confirmUploadEndpoint: responseData.confirmUploadEndpoint,
            uploadCourseMetadataEndpoint: responseData.uploadCourseMetadataEndpoint,
            chunkSize: responseData.chunkSize,
            tusVersion: responseData.tusVersion,
            allowedOrigins: responseData.allowedOrigins,
            requiredVideoVersion: responseData.requiredVideoVersion
          });
        }
        
        // Set authorization state
        setIsAuthorized(true);
        
      } catch (err) {
        console.error('Exception fetching course data:', err);
        setIsAuthorized(false);
        setLoading(false);
        
        // Redirect to no access page on error
        navigate('/no-access');
      } finally {
        setIsCheckingAuth(false);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [auth.session, courseId, navigate]);
  
  // Add a new chapter
  const handleAddChapter = () => {
    const newChapter = {
      id: uuidv4(),
      title: `פרק ${chapters.length + 1}`,
      description: '',
      isEditing: true,
      videos: []
    };
    
    setChapters([...chapters, newChapter]);
    setEditingChapterId(newChapter.id);
  };
  
  // Add a new video to a chapter
  const handleAddVideo = (chapterId) => {
    const updatedChapters = chapters.map(chapter => {
      if (chapter.id === chapterId) {
        const newVideo = {
          id: uuidv4(),
          title: `סרטון ${chapter.videos.length + 1}`,
          description: '',
          duration: '00:00',
          status: 'pending',
          isEditing: true
        };
        
        return {
          ...chapter,
          videos: [...chapter.videos, newVideo]
        };
      }
      return chapter;
    });
    
    setChapters(updatedChapters);
    const newVideoId = updatedChapters.find(c => c.id === chapterId)?.videos.slice(-1)[0]?.id;
    if (newVideoId) {
      setEditingVideoId(newVideoId);
    }
  };
  
  // Delete a chapter
  const handleDeleteChapter = (chapterId) => {
    if (chapters.length <= 1) {
      showNotification('נדרש לפחות פרק אחד בקורס', 'warning');
      return;
    }
    
    // Find the chapter being deleted
    const chapter = chapters.find(ch => ch.id === chapterId);
    
    // Count uploaded videos in this chapter
    const uploadedVideosCount = chapter?.videos.filter(video => video.videoUid).length || 0;
    
    // If the chapter has uploaded videos, show confirmation modal
    if (uploadedVideosCount > 0) {
      setPendingChapterDelete({ chapterId, chapter, uploadedVideosCount });
      setDeleteChapterModalOpen(true);
      return;
    }
    
    // If no uploaded videos, delete immediately
    performDeleteChapter(chapterId);
  };
  
  // New function to perform the actual chapter deletion
  const performDeleteChapter = (chapterId) => {
    // Find the chapter being deleted
    const chapter = chapters.find(ch => ch.id === chapterId);
    
    // Add all videos with UIDs from this chapter to deletedVideos
    if (chapter) {
      const videosWithUids = chapter.videos
        .filter(video => video.videoUid)
        .map(video => video.videoUid);
      
      if (videosWithUids.length > 0) {
        const newDeletedVideos = [...(Array.isArray(deletedVideos) ? deletedVideos : []), ...videosWithUids];
        setDeletedVideos(newDeletedVideos);
      }
    }
    
    setChapters(chapters.filter(chapter => chapter.id !== chapterId));
  };
  
  // Delete a video
  const handleDeleteVideo = (chapterId, videoId) => {
    // Find the video being deleted to get its UID if it exists
    const chapter = chapters.find(ch => ch.id === chapterId);
    const video = chapter?.videos.find(v => v.id === videoId);
    
    // If the video is uploaded, show confirmation modal
    if (video?.videoUid) {
      setPendingDelete({ chapterId, videoId, video });
      setDeleteModalOpen(true);
      return;
    }
    
    // If no videoUid, delete immediately
    performDeleteVideo(chapterId, videoId);
  };
  
  // New function to perform the actual deletion
  const performDeleteVideo = (chapterId, videoId) => {
    // Find the video being deleted to get its UID if it exists
    const chapter = chapters.find(ch => ch.id === chapterId);
    const video = chapter?.videos.find(v => v.id === videoId);
    
    // If the video had a UID, add it to deletedVideos
    if (video?.videoUid) {
      const newDeletedVideos = [...(Array.isArray(deletedVideos) ? deletedVideos : []), video.videoUid];
      setDeletedVideos(newDeletedVideos);
    }
    
    setChapters(chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          videos: chapter.videos.filter(video => video.id !== videoId)
        };
      }
      return chapter;
    }));
  };
  
  // Move chapter up or down
  const handleMoveChapter = (chapterId, direction) => {
    const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (direction === 'up' && chapterIndex > 0) {
      const newChapters = [...chapters];
      [newChapters[chapterIndex], newChapters[chapterIndex - 1]] = 
        [newChapters[chapterIndex - 1], newChapters[chapterIndex]];
      setChapters(newChapters);
    } else if (direction === 'down' && chapterIndex < chapters.length - 1) {
      const newChapters = [...chapters];
      [newChapters[chapterIndex], newChapters[chapterIndex + 1]] = 
        [newChapters[chapterIndex + 1], newChapters[chapterIndex]];
      setChapters(newChapters);
    }
  };
  
  // Move video up or down within a chapter
  const handleMoveVideo = (chapterId, videoId, direction) => {
    setChapters(chapters.map(chapter => {
      if (chapter.id === chapterId) {
        const videoIndex = chapter.videos.findIndex(video => video.id === videoId);
        if (direction === 'up' && videoIndex > 0) {
          const newVideos = [...chapter.videos];
          [newVideos[videoIndex], newVideos[videoIndex - 1]] = 
            [newVideos[videoIndex - 1], newVideos[videoIndex]];
          return { ...chapter, videos: newVideos };
        } else if (direction === 'down' && videoIndex < chapter.videos.length - 1) {
          const newVideos = [...chapter.videos];
          [newVideos[videoIndex], newVideos[videoIndex + 1]] = 
            [newVideos[videoIndex + 1], newVideos[videoIndex]];
          return { ...chapter, videos: newVideos };
        }
      }
      return chapter;
    }));
  };
  
  // Edit a chapter
  const handleEditChapter = (chapterId) => {
    setEditingChapterId(chapterId);
    setEditingVideoId(null);
  };
  
  // Save chapter edits
  const handleSaveChapterEdit = (chapterId, title, description) => {
    const updatedChapters = chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          title,
          description
        };
      }
      return chapter;
    });
    
    setChapters(updatedChapters);
    setEditingChapterId(null);
    showNotification('פרק עודכן בהצלחה', 'success');
  };
  
  // Cancel chapter edit
  const handleCancelChapterEdit = () => {
    setEditingChapterId(null);
  };
  
  // Edit video title/description
  const handleEditVideo = (chapterId, videoId) => {
    // Only set the video ID, don't set the chapter ID
    setEditingVideoId(videoId);
  };
  
  // Save video edits
  const handleSaveVideoEdit = (chapterId, videoId, title, description) => {
    // Update the chapter's videos with the new data
    const updatedChapters = chapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          videos: chapter.videos.map(video => {
            if (video.id === videoId) {
              return {
                ...video,
                title,
                description,
                isEditing: false
              };
            }
            return video;
          })
        };
      }
      return chapter;
    });
    
    setChapters(updatedChapters);
    setEditingVideoId(null);
    showNotification('וידאו עודכן בהצלחה', 'success');
  };
  
  // Cancel video edit
  const handleCancelVideoEdit = () => {
    setEditingVideoId(null);
  };
  
  // Upload video function
  const handleUploadVideo = async (chapterId, videoId, file) => {
    if (!auth || !auth.session) {
      showNotification('לא ניתן להעלות וידאו כעת, אנא התחבר', 'error');
      return;
    }

    try {
      // Get the video that's being uploaded
      const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
      if (chapterIndex === -1) throw new Error('פרק לא נמצא');
      const videoIndex = chapters[chapterIndex].videos.findIndex(v => v.id === videoId);
      if (videoIndex === -1) throw new Error('וידאו לא נמצא');
      const video = chapters[chapterIndex].videos[videoIndex];

      setCurrentUpload({
        chapterId,
        videoId,
        progress: 0
      });

      const videoUid = await upload(
        file, 
        { 
          title: video.title, 
          description: video.description, 
          courseId: courseData.id,
          chapterId: chapterId,
          videoId: videoId,
          tutorId: courseData.tutor_id
        }, 
        async (videoUid, metadata) => {
          const updatedChapters = [...chapters];
          updatedChapters[chapterIndex].videos[videoIndex].status = 'uploaded';
          updatedChapters[chapterIndex].videos[videoIndex].videoUid = videoUid;
          updatedChapters[chapterIndex].videos[videoIndex].episode_len = metadata?.duration || 0;
          
          setChapters(updatedChapters);
          showNotification('הוידאו הועלה בהצלחה', 'success');
          
          await handleSaveCourse();
          refreshCourseData();
        }
      );

    } catch (error) {
      
      // If we have a videoUid from the error, add it to deletedVideos
      if (error.videoUid) {
        const newDeletedVideos = [...deletedVideos, error.videoUid];
        setDeletedVideos(newDeletedVideos);
        
        // Save course immediately with the new deletedVideos
        await handleSaveCourse(newDeletedVideos);
      }

      // Reset upload state
      setCurrentUpload(null);
      
      // Keep video in pending state
      setChapters(chapters.map(chapter => {
        if (chapter.id === chapterId) {
          return {
            ...chapter,
            videos: chapter.videos.map(video => {
              if (video.id === videoId) {
                return {
                  ...video,
                  status: 'pending',
                };
              }
              return video;
            })
          };
        }
        return chapter;
      }));
    }
  };
  
  // Save course content
  const handleSaveCourse = async (deletedVideosOverride) => {
    if (!auth.session || !courseId) return;
    
    try {
      setIsSaving(true);
      
      // Format the data for the backend
      const saveCourseData = {
        video_course: {
          id: courseData.id,
          course_id: courseData.courseId,
          title: courseData.title,
          description: courseData.description,
          price: parseFloat(courseData.price) || 0,
          sale_price: courseData.salePrice ? parseFloat(courseData.salePrice) : null,
          custom_thumbnail_url: courseData.thumbnailUrl,
          shown: courseData.status === 'published' ? 1 : 0
        },
        video_titles: chapters.map((chapter, chapterIndex) => ({
          id: parseInt(chapter.id) || null,
          title: chapter.title,
          title_index: chapterIndex,
          video_episodes: chapter.videos.map((video, videoIndex) => ({
            id: parseInt(video.id) || null,
            episode_index: videoIndex,
            title: video.title,
            description: video.description || '',
            video_uid: video.videoUid || null,
            episode_len: video.episode_len || null
          }))
        })),
        // Use the override if provided, otherwise use the state
        deleted_video_uids: deletedVideosOverride || deletedVideos,
        // Include thumbnail data if it exists
        fileBase64: courseData.fileBase64,
        fileName: courseData.fileName,
        fileType: courseData.fileType
      };
      
      // Call the endpoint to save the course
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}${SAVE_COURSE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.session.access_token}`
        },
        body: JSON.stringify(saveCourseData)
      });
      
      // Parse the response
      const responseData = await response.json();
      
      if (response.ok && !responseData.error) {
        showNotification('הקורס נשמר בהצלחה', 'success');
        
        // Clear the deleted videos array after successful save
        setDeletedVideos([]);
        
        // Refresh course data to get updates from the server
        refreshCourseData();
      } else {
        console.error('Error saving course:', responseData.error || 'Unknown error');
        showNotification('שגיאה בשמירת הקורס', 'error');
      }
    } catch (err) {
      console.error('Exception saving course:', err);
      showNotification('שגיאה בשמירת הקורס', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Generate chapter and video stats
  const totalChapters = chapters.length;
  const totalVideos = chapters.reduce((acc, chapter) => acc + chapter.videos.length, 0);
  const totalVideosUploaded = chapters.reduce(
    (acc, chapter) => acc + chapter.videos.filter(v => v.status === 'uploaded').length, 
    0
  );
  
  // Chapter editing component
  const ChapterEditForm = ({ chapter, onSave, onCancel }) => {
    const [title, setTitle] = useState(chapter.title);
    const [description, setDescription] = useState(chapter.description);
    
    return (
      <div className="p-3 rounded-md bg-blue-50">
        <div className="flex flex-col space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">שם הפרק</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="הזן שם לפרק"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">תיאור (לא חובה)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
              placeholder="תיאור קצר של הפרק (לא חובה)"
              rows={3}
              dir="rtl"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
              ביטול
            </Button>
            <Button
              variant="default"
              className={`${styles.buttonPrimary} gap-1`}
              onClick={() => onSave(title, description)}
            >
              <Check className="h-4 w-4" />
              שמירה
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // Video editing component
  const VideoEditForm = ({ video, onSave, onCancel }) => {
    const [title, setTitle] = useState(video.title);
    const [description, setDescription] = useState(video.description);
    
    return (
      <div className="bg-blue-50 p-4 rounded-md space-y-3">
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            כותרת הסרטון
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="הזן כותרת לסרטון"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">
            תיאור הסרטון
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            placeholder="הזן תיאור קצר לסרטון (לא חובה)"
            rows={2}
          />
        </div>
        <div className="flex justify-end space-x-2 space-x-reverse">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-blue-200 hover:bg-blue-50"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
            ביטול
          </Button>
          <Button
            size="sm"
            className={`${styles.buttonPrimary} gap-1`}
            onClick={() => onSave(title, description)}
          >
            <Check className="h-4 w-4" />
            שמירה
          </Button>
        </div>
      </div>
    );
  };

  // Function to refresh course data from the API
  const refreshCourseData = async () => {
    if (!auth.session || !courseId) return;
    
    try {
      setLoading(true);
      
      // Get the Supabase URL from the client
      const supabaseUrl = supabase.supabaseUrl;
      const editCourseEndpoint = `${supabaseUrl}${GET_EDIT_COURSE_ENDPOINT}?video_id=${courseId}`;
      
      // Call the endpoint to get updated course data
      const response = await fetch(editCourseEndpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.session.access_token}`
        }
      });

      // Parse the response
      const responseData = await response.json();
      
      if (response.ok && !responseData.error) {
        // Extract the video course data
        const videoCourse = responseData.video_course || {};
        
        // Set course data
        setCourseData({
          id: videoCourse.id || courseId,
          title: videoCourse.title || '',
          description: videoCourse.description || '',
          thumbnailUrl: videoCourse.custom_thumbnail_url || 'https://via.placeholder.com/800x450',
          price: videoCourse.price || 0,
          salePrice: videoCourse.sale_price || null,
          status: videoCourse.shown ? 'published' : 'draft',
          courseId: videoCourse.course_id,
          videoUid: videoCourse.video_uid
        });
        
        // Process video titles and episodes to create chapters structure
        if (videoCourse.video_titles && videoCourse.video_titles.length > 0) {
          const formattedChapters = videoCourse.video_titles.map(title => {
            // Sort episodes by episode_index
            const episodes = title.video_episodes || [];
            const sortedEpisodes = [...episodes].sort((a, b) => a.episode_index - b.episode_index);
            
            return {
              id: String(title.id),
              title: title.title || 'פרק ללא כותרת',
              description: '', // Not provided in the data
              isEditing: false,
              videos: sortedEpisodes.map(episode => ({
                id: String(episode.id),
                title: episode.title || '',
                description: episode.description || '',
                episode_len: episode.episode_len || 0,
                status: episode.video_uid ? 'uploaded' : 'pending',
                videoUid: episode.video_uid,
                episodeIndex: episode.episode_index,
                isEditing: false
              }))
            };
          });
          
          setChapters(formattedChapters);
        }
        
        // Set config from response
        if (responseData.createUploadEndpoint) {
          setUploadConfig({
            createUploadEndpoint: responseData.createUploadEndpoint,
            confirmUploadEndpoint: responseData.confirmUploadEndpoint,
            uploadCourseMetadataEndpoint: responseData.uploadCourseMetadataEndpoint,
            chunkSize: responseData.chunkSize,
            tusVersion: responseData.tusVersion,
            allowedOrigins: responseData.allowedOrigins,
            requiredVideoVersion: responseData.requiredVideoVersion
          });
        }
        
        showNotification('נטען מחדש בהצלחה', 'success');
      } else {
        console.error('Error refreshing course data:', responseData.error || 'Unknown error');
        showNotification('שגיאה בטעינת נתוני הקורס', 'error');
      }
    } catch (err) {
      console.error('Exception refreshing course data:', err);
      showNotification('שגיאה בטעינת נתוני הקורס', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update the isUploading check in the JSX to use both states
  const isUploadingAny = isTusUploading;

  // Update the handleSaveCourseDetails function
  const handleSaveCourseDetails = (editedData) => {
    // Just update the courseData
    setCourseData({
      ...courseData,
      title: editedData.title,
      description: editedData.description,
      price: parseFloat(editedData.price) || 0,
      salePrice: editedData.salePrice ? parseFloat(editedData.salePrice) : null,
      status: editedData.status,
      // Use the preview URL for immediate display
      thumbnailUrl: editedData.previewUrl || courseData.thumbnailUrl,
      // Keep the file data for the next save if provided
      fileBase64: editedData.fileBase64,
      fileName: editedData.fileName,
      fileType: editedData.fileType
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white" dir="rtl">
      <Navbar courseType={courseTypeRef.current} />

      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${styles.textColor} flex items-center gap-2`}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil className="h-6 w-6" />
              </Button>
              עריכת קורס: {courseData.title}
            </h1>
            <Button 
              variant="default" 
              className={`gap-2 ${styles.buttonPrimary}`}
              onClick={() => handleSaveCourse()}
              disabled={isSaving || !isAuthorized}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  שמירת קורס
                </>
              )}
            </Button>
          </div>

          {/* Progress steps */}
          <div className="mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500 text-white">
                  <Check className="h-5 w-5" />
                </div>
                <div className="mr-3 text-lg font-medium">פרטי הקורס</div>
              </div>
              <div className="w-16 h-1 mx-4 bg-green-500"></div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.bgColor} text-white font-bold`}>
                  2
                </div>
                <div className="mr-3 text-lg font-medium">תוכן הקורס</div>
              </div>
            </div>
          </div>

          {!auth.session && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-center gap-3 max-w-2xl mx-auto">
              <Info className="text-red-500 shrink-0" />
              <div>
                <p className="text-red-800 font-semibold">עליך להתחבר כדי לערוך קורס</p>
                <p className="text-red-700 text-sm mt-1">לחץ על כפתור ההתחברות בתפריט העליון</p>
              </div>
            </div>
          )}

          {isCheckingAuth && (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">בודק הרשאות...</p>
              </div>
            </div>
          )}

          {!isCheckingAuth && isAuthorized && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Course content editor (main) */}
              <div className="md:col-span-3">
                <Card className="shadow-md border">
                  <CardHeader className={`bg-gradient-to-r ${styles.cardBg} text-white rounded-t-lg`}>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      פרקים וסרטונים
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      נהל את מבנה הקורס שלך
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="p-6">
                      <Button 
                        onClick={handleAddChapter}
                        className="w-full border border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-blue-700 py-3 rounded-md flex items-center justify-center gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        הוספת פרק חדש
                      </Button>
                    </div>

                    <div className="space-y-6 px-6 pb-6">
                      {chapters.map((chapter, chapterIndex) => (
                        <div 
                          key={chapter.id} 
                          className="mb-5 bg-white rounded-lg shadow-sm p-4 border border-blue-100"
                        >
                          {editingChapterId === chapter.id ? (
                            <ChapterEditForm 
                              chapter={chapter}
                              onSave={(title, description) => handleSaveChapterEdit(chapter.id, title, description)}
                              onCancel={handleCancelChapterEdit}
                            />
                          ) : (
                            <div>
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h3 className="text-lg font-medium">{chapter.title}</h3>
                                  {chapter.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{chapter.description}</p>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditChapter(chapter.id)}
                                    disabled={loading || isUploadingAny}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMoveChapter(chapter.id, 'up')}
                                    disabled={chapterIndex === 0 || loading || isUploadingAny}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMoveChapter(chapter.id, 'down')}
                                    disabled={chapterIndex === chapters.length - 1 || loading || isUploadingAny}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteChapter(chapter.id)}
                                    disabled={chapters.length <= 1 || loading || isUploadingAny}
                                  >
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              
                              {/* Videos in chapter */}
                              <div className="mt-4 space-y-3">
                                {chapter.videos.map((video, videoIndex) => (
                                  <div
                                    key={video.id}
                                    className="mb-2 p-3 bg-white rounded-md shadow-sm border border-blue-50 hover:border-blue-200 transition-colors"
                                  >
                                    {editingVideoId === video.id ? (
                                      <VideoEditForm
                                        video={video}
                                        onSave={(title, description) => handleSaveVideoEdit(chapter.id, video.id, title, description)}
                                        onCancel={handleCancelVideoEdit}
                                      />
                                    ) : (
                                      <div>
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <div className="ms-2">{videoIndex + 1}.</div>
                                            <h4 className="font-medium text-lg">{video.title || 'וידאו ללא כותרת'}</h4>
                                            {video.episode_len > 0 && (
                                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                {Math.floor(video.episode_len / 60)}:{(video.episode_len % 60).toString().padStart(2, '0')}
                                              </span>
                                            )}
                                          </div>
                                          
                                          <div className="flex space-x-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleEditVideo(chapter.id, video.id)}
                                              disabled={loading || isUploadingAny}
                                            >
                                              <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleMoveVideo(chapter.id, video.id, 'up')}
                                              disabled={videoIndex === 0 || loading || isUploadingAny}
                                            >
                                              <ChevronUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleMoveVideo(chapter.id, video.id, 'down')}
                                              disabled={videoIndex === chapter.videos.length - 1 || loading || isUploadingAny}
                                            >
                                              <ChevronDown className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => handleDeleteVideo(chapter.id, video.id)}
                                              disabled={loading || isUploadingAny}
                                            >
                                              <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                          </div>
                                        </div>
                                        
                                        {video.description && (
                                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{video.description}</p>
                                        )}
                                        
                                        <div className="mt-3 flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <Badge
                                              variant={video.status === 'uploaded' ? 'success' : 'default'}
                                              className={video.status === 'uploaded' ? 'bg-green-100 text-green-800' : ''}
                                            >
                                              {video.status === 'uploaded' ? 'הועלה' : 'ממתין להעלאה'}
                                            </Badge>
                                            {video.status === 'uploaded' && (
                                              <span className="text-xs text-gray-500">UID: {video.videoUid || 'N/A'}</span>
                                            )}
                                          </div>
                                          
                                          {/* File upload section */}
                                          {isUploadingAny && currentUpload.chapterId === chapter.id && currentUpload.videoId === video.id ? (
                                            <div className="w-1/2">
                                              <div className="flex items-center">
                                                <div className="mr-2">
                                                  <Loader2 className="h-4 w-4 animate-spin" />
                                                </div>
                                                <div className="w-full bg-blue-100 rounded-full h-2.5">
                                                  <div 
                                                    className="bg-blue-600 h-2.5 rounded-full" 
                                                    style={{ width: `${uploadProgress}%` }}
                                                  ></div>
                                                </div>
                                                <span className="ml-2 text-sm">{uploadProgress}%</span>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="ml-2 text-red-500 hover:text-red-700"
                                                  onClick={async () => {
                                                    try {
                                                      // Cancel the actual upload and get the videoUid
                                                      const canceledVideoUid = await abort();
                                                      
                                                      // If we got a videoUid from the canceled upload, add it to existing deletedVideos
                                                      if (canceledVideoUid) {
                                                        // Create new array with both existing deleted videos and the canceled one
                                                        const newDeletedVideos = [...new Set([...deletedVideos, canceledVideoUid])];
                                                        
                                                        // Update state and save
                                                        setDeletedVideos(newDeletedVideos);
                                                        
                                                        // Save the course with the combined array
                                                        await handleSaveCourse(newDeletedVideos);
                                                      } else {
                                                        // Even if no new videoUid, we should still save with existing deletedVideos
                                                        if (deletedVideos.length > 0) {
                                                          await handleSaveCourse(deletedVideos);
                                                        }
                                                      }
                                                    } catch (err) {
                                                      console.error('Error canceling upload:', err);
                                                      showNotification('שגיאה בביטול ההעלאה', 'error');
                                                    } finally {
                                                      // Reset upload state
                                                      setCurrentUpload({
                                                        chapterId: null,
                                                        videoId: null,
                                                        progress: 0
                                                      });
                                                    }
                                                  }}
                                                >
                                                  <X className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <div>
                                              <input
                                                type="file"
                                                id={`file-upload-${video.id}`}
                                                className="hidden"
                                                accept="video/*"
                                                onChange={(e) => {
                                                  if (e.target.files && e.target.files[0]) {
                                                    handleUploadVideo(chapter.id, video.id, e.target.files[0]);
                                                  }
                                                }}
                                                disabled={video.status === 'uploaded' || isUploadingAny}
                                              />
                                              <label
                                                htmlFor={`file-upload-${video.id}`}
                                                className={`
                                                  inline-flex items-center px-3 py-1 text-sm
                                                  rounded-md border
                                                  ${(video.status === 'uploaded' || isUploadingAny)
                                                    ? 'bg-blue-50 text-blue-400 border-blue-200 cursor-not-allowed' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 cursor-pointer'}
                                                `}
                                              >
                                                {video.status === 'uploaded' ? (
                                                  <Check className="h-4 w-4 mr-1" />
                                                ) : (
                                                  <Upload className="h-4 w-4 mr-1" />
                                                )}
                                                {video.status === 'uploaded' ? 'הועלה' : 'העלאת וידאו'}
                                              </label>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                
                                <Button 
                                  onClick={() => handleAddVideo(chapter.id)}
                                  className="w-full border border-dashed border-blue-200 hover:bg-blue-50/50 py-2 rounded-md flex items-center justify-center gap-2 text-blue-600"
                                  disabled={loading || isUploadingAny}
                                >
                                  <Plus className="h-4 w-4" />
                                  הוספת סרטון
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course overview (sidebar) */}
              <div className="md:col-span-1">
                <div className="space-y-6">
                  <Card className="shadow-md border">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">פרטי הקורס</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <img 
                          src={courseData.thumbnailUrl} 
                          alt="Course thumbnail" 
                          className="w-full aspect-video object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{courseData.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{courseData.description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-100 p-2 rounded-md">
                          <div className="text-gray-500">מחיר</div>
                          <div className="font-semibold">₪{courseData.price}</div>
                        </div>
                        <div className="bg-gray-100 p-2 rounded-md">
                          <div className="text-gray-500">סטטוס</div>
                          <div className="font-semibold">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                              {courseData.status === 'published' ? 'פורסם' : 'טיוטה'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setIsEditModalOpen(true)}
                        >
                          עריכת פרטי קורס
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full flex items-center justify-center gap-1"
                          onClick={refreshCourseData}
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1" />
                              רענון נתונים
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full flex items-center justify-center gap-1"
                          onClick={() => navigate(`/course/${courseId}`)}
                        >
                          <FileVideo className="h-4 w-4 mr-1" />
                          צפייה בקורס
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md border">
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">סיכום תוכן</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                          <span className="text-blue-700">פרקים</span>
                          <span className="font-bold text-blue-900">{totalChapters}</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                          <span className="text-blue-700">סרטונים</span>
                          <span className="font-bold text-blue-900">{totalVideos}</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                          <span className="text-blue-700">הועלו</span>
                          <span className="font-bold text-blue-900">{totalVideosUploaded} / {totalVideos}</span>
                        </div>
                        <div className="mt-4">
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(totalVideosUploaded / Math.max(totalVideos, 1)) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-center">
                            {totalVideosUploaded} מתוך {totalVideos} סרטונים הועלו
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Details Edit Modal */}
      <CourseDetailsEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        courseData={courseData}
        onSave={handleSaveCourseDetails}
        courseType={courseTypeRef.current}
      />

      {/* Add the DeleteVideoModal */}
      <DeleteVideoModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        videoTitle={pendingDelete?.video?.title || ''}
        onConfirm={() => {
          if (pendingDelete) {
            performDeleteVideo(pendingDelete.chapterId, pendingDelete.videoId);
            setPendingDelete(null);
          }
        }}
      />

      {/* Add the DeleteChapterModal */}
      <DeleteChapterModal
        open={deleteChapterModalOpen}
        onOpenChange={setDeleteChapterModalOpen}
        chapterTitle={pendingChapterDelete?.chapter?.title || ''}
        uploadedVideosCount={pendingChapterDelete?.uploadedVideosCount || 0}
        onConfirm={() => {
          if (pendingChapterDelete) {
            performDeleteChapter(pendingChapterDelete.chapterId);
            setPendingChapterDelete(null);
          }
        }}
      />
    </div>
  );
} 