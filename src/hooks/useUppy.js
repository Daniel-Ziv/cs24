import { useState, useRef, useEffect } from 'react';
import { showNotification } from '../components/ui/notification';
import { supabase } from '../lib/supabase';

const UPPY_VERSION = '3.3.1';
const UPPY_CSS = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.css`;
const UPPY_JS  = `https://releases.transloadit.com/uppy/v${UPPY_VERSION}/uppy.min.js`;
const UPLOAD_FUNCTION_ENDPOINT = process.env.REACT_APP_UPLOAD_FUNCTION_ENDPOINT;
const encode = (str) => btoa(unescape(encodeURIComponent(str)));

if (!UPLOAD_FUNCTION_ENDPOINT) {
  throw new Error('Missing upload function endpoint configuration. Please check your environment setup.');
}

export function useUppy(auth) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [videoLink, setVideoLink] = useState(null);
  
  const uppyRef = useRef(null);
  const dashRef = useRef(null);
  const uppyScriptsLoadedRef = useRef(false);

  useEffect(() => {
    if (uppyScriptsLoadedRef.current) {
      return;
    }

    const loadUppyScripts = async () => {
      if (!window.Uppy) {
        const inject = (tag, attrs) =>
          new Promise((res, rej) => {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([k, v]) => (el[k] = v));
            el.onload = () => res();
            el.onerror = (err) => rej(err);
            (tag === 'link' ? document.head : document.body).appendChild(el);
          });

        try {
          await inject('link', { rel: 'stylesheet', href: UPPY_CSS });
          await inject('script', { src: UPPY_JS, id: 'uppy-js' });
          uppyScriptsLoadedRef.current = true;
        } catch (error) {
          throw new Error('Failed to load Uppy scripts');
        }
      } else {
        uppyScriptsLoadedRef.current = true;
      }
    };

    loadUppyScripts();
  }, []);

  // Function to get an upload URL from our Edge Function
  const getUploadUrl = async (file, title) => {
    try {
      // Convert file size to minutes (approximate)
      // Assuming average bitrate of 2 Mbps (250 KB/s)
      const fileSizeInMB = file.size / (1024 * 1024);
      const estimatedMinutes = Math.ceil(fileSizeInMB / 15); // 15 MB per minute at 2 Mbps
      
      const response = await fetch(UPLOAD_FUNCTION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.session.access_token}`,
          'Upload-Length': file.size.toString(),
          'Tus-Resumable': '1.0.0',
          'Upload-Metadata': `name ${encode(title)},type ${encode(file.type)},requiresignedurls`,
          'Upload-Creator': `2`,
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get upload URL: ${response.status}`);
      }

      // Get the location URL from response headers
      const location = response.headers.get('location');
      
      // Get the Stream-Media-ID from response headers
      const streamMediaId = response.headers.get('stream-media-id');
      if (streamMediaId) {
        const videoLink = `https://watch.cloudflarestream.com/${streamMediaId}`;
        setVideoLink(videoLink);
        console.log('Video will be available at:', videoLink);
      }
      
      if (!location) {
        throw new Error('No location header in response');
      }

      console.log('Got upload URL:', location);
      return { uploadUrl: location, streamMediaId };
    } catch (error) {
      console.error('Error getting upload URL:', error);
      showNotification('שגיאה בקבלת קישור העלאה', 'error');
      throw error;
    }
  };

  // Helper for direct upload to Cloudflare
  const directUploadToCloudflare = async (file, uploadUrl) => {
    return new Promise((resolve, reject) => {
      // Use XHR for direct upload
      const xhr = new XMLHttpRequest();
      let offset = 0;
      const chunkSize = 5 * 1024 * 1024; // 5MB - Cloudflare's minimum chunk size requirement
      
      const uploadChunk = () => {
        const start = offset;
        const end = Math.min(offset + chunkSize, file.size);
        const chunk = file.slice(start, end);
        
        // For the first chunk, use PATCH to begin upload
        xhr.open('PATCH', uploadUrl, true);
        xhr.setRequestHeader('Tus-Resumable', '1.0.0');
        xhr.setRequestHeader('Upload-Offset', String(offset));
        xhr.setRequestHeader('Content-Type', 'application/offset+octet-stream');
        
        xhr.onload = () => {
          if (xhr.status === 204) {
            // Success, get new offset from response
            const newOffset = parseInt(xhr.getResponseHeader('Upload-Offset'), 10);
            offset = newOffset;
            
            // Calculate progress
            const progress = Math.floor((offset / file.size) * 100);
            setProgress(progress);
            
            if (offset < file.size) {
              // More chunks to upload
              uploadChunk();
            } else {
              // All done!
              resolve();
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}, response: ${xhr.responseText}`));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };
        
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const totalProgress = Math.floor(((offset + e.loaded) / file.size) * 100);
            setProgress(totalProgress);
          }
        };
        
        xhr.send(chunk);
      };
      
      // Start the first chunk
      uploadChunk();
    });
  };
  
  // Function to get video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.round(video.duration));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  // The main upload function
  const startUpload = async (title, description, courseType) => {
    const uppy = uppyRef.current;
    
    if (!uppy || !auth.session?.access_token) {
      showNotification('נא להתחבר כדי להעלות סרטון', 'error');
      return { success: false };
    }

    const files = uppy.getFiles();

    if (files.length === 0) {
      showNotification('נא לבחור קובץ להעלאה', 'error');
      return { success: false };
    }

    const file = files[0];
    
    // Get video duration before upload
    const duration = await getVideoDuration(file.data);
    
    // Ensure file has valid properties
    if (!file.name) file.name = 'unnamed_file.mp4';
    if (!file.type) file.type = 'video/mp4';
    
    if (!title.trim()) {
      showNotification('נא להזין כותרת לסרטון', 'error');
      return { success: false };
    }

    if (!description.trim()) {
      showNotification('נא להזין תיאור לסרטון', 'error');
      return { success: false };
    }

    // Show loading state
    setUploading(true);
    setProgress(0);

    try {
      // Get the upload URL and stream media ID
      const { uploadUrl, streamMediaId } = await getUploadUrl(file, title);
      setUploadUrl(uploadUrl);

      // Add metadata to file
      uppy.setFileState(file.id, {
        meta: {
          name: file.name || 'unnamed_file.mp4',
          type: file.type || 'video/mp4',
          title: title.trim(),
          description: description.trim(),
          courseType,
        }
      });

      // Use our custom upload function instead of Uppy's Tus
      await directUploadToCloudflare(file.data, uploadUrl);
      
      // Manually trigger the success event
      uppy.emit('upload-success', file, { 
        uploadURL: uploadUrl,
        status: 'success' 
      });
      
      uppy.emit('complete', { 
        successful: [file],
        failed: []
      });
      
      setUploading(false);
      showNotification('הוידאו הועלה בהצלחה!', 'success');
      
      return { success: true, videoId: streamMediaId, duration };
      
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('שגיאה בהעלאת הוידאו', 'error');
      setUploading(false);
      
      // Manually trigger the error event
      if (files.length > 0) {
        uppy.emit('upload-error', file, error);
      }
      
      return { success: false, error };
    }
  };

  useEffect(() => {
    if (!uppyScriptsLoadedRef.current || !window.Uppy || !auth.session?.access_token) {
      return;
    }

    if (uppyRef.current) {
      // Clear existing instance
      uppyRef.current.close();
      uppyRef.current = null;
    }
    
    // Create a new Uppy instance
    const _uppy = new window.Uppy.Uppy({
      debug: true,
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ['video/*'],
      },
      locale: {
        strings: { uploadXFiles: 'העלה %{smart_count} קבצים' },
      },
    });

    _uppy.use(window.Uppy.Dashboard, {
      target: dashRef.current,
      inline: true,
      height: 300,
      proudlyDisplayPoweredByUppy: false,
      note: 'ניתן להעלות סרטונים עד 10GB',
      hideUploadButton: true
    });

    // When files are added, just prepare the UI
    _uppy.on('file-added', (file) => {
      try {
        // Ensure file has valid name and type
        if (!file.name) file.name = 'unnamed_file.mp4';
        if (!file.type) file.type = 'video/mp4';
        
        // Reset states
        setUploadUrl(null);
        setVideoLink(null);
        setProgress(0);
      } catch (error) {
        console.error('Error preparing file:', error);
      }
    });

    // When files are removed, clear the states
    _uppy.on('file-removed', () => {
      setUploadUrl(null);
      setVideoLink(null);
      setProgress(0);
    });

    _uppy.on('upload-progress', (file, data) => {
      const progress = Math.floor((data.bytesUploaded / data.bytesTotal) * 100);
      setProgress(progress);
    });

    _uppy.on('complete', result => {
      setUploading(false);
      if (result.failed.length) {
        showNotification('שגיאה בהעלאת הוידאו', 'error');
      } else {
        if (videoLink) {
          showNotification(`הוידאו הועלה בהצלחה! צפה בו כאן: ${videoLink}`, 'success');
        } else {
          showNotification('הוידאו הועלה בהצלחה!', 'success');
        }
      }
    });

    _uppy.on('error', (error) => {
      console.error('Uppy error:', error);
      setUploading(false);
      showNotification('שגיאה בהעלאה. נסה שוב מאוחר יותר.', 'error');
    });

    // Configure Tus plugin for uploads
    _uppy.use(window.Uppy.Tus, {
      endpoint: null, // Will be set during startUpload
      removeFingerprintOnSuccess: true,
      chunkSize: 5 * 1024 * 1024, // 5MB - Cloudflare's minimum chunk size requirement
      retryDelays: [0, 1000, 3000, 5000],
      uploadDataDuringCreation: false, // Don't upload data during creation
      headers: {
        'Tus-Resumable': '1.0.0'
      }
    });

    uppyRef.current = _uppy;

    return () => {
      if (uppyRef.current) {
        uppyRef.current.close();
        uppyRef.current = null;
      }
    };
  }, [auth.session?.access_token]);

  return {
    uppyRef,
    dashRef,
    progress,
    uploading,
    uploadUrl,
    videoLink,
    startUpload
  };
} 