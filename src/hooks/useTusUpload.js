import { useState, useRef } from 'react';
import * as tus from 'tus-js-client';
import { supabase } from '../lib/supabase';
import { showNotification } from '../components/ui/notification';

// Helper function to get video duration
const getVideoDuration = (file) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const duration = Math.round(video.duration);
      window.URL.revokeObjectURL(video.src);
      resolve(duration);
    };
    
    video.onerror = (e) => {
      console.error('Error getting video duration:', e);
      resolve(0);
    };
    
    video.src = URL.createObjectURL(file);
  });
};

export function useTusUpload(auth) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const uploadRef = useRef(null);
  const currentVideoUidRef = useRef(null);

  const abort = () => {
    return new Promise((resolve) => {
      if (uploadRef.current) {
        // Get the videoUid before aborting
        const videoUid = currentVideoUidRef.current;
        
        // Abort the upload
        uploadRef.current.abort();
        console.log('Upload aborted, returning videoUid:', videoUid);
        
        // Reset states
        setIsUploading(false);
        setUploadProgress(0);
        uploadRef.current = null;
        currentVideoUidRef.current = null;
        
        // Resolve with the videoUid
        resolve(videoUid);
      } else {
        resolve(null);
      }
    });
  };

  const upload = async (file, metadata = {}, onComplete) => {
    console.log('Starting upload process for file:', file.name);
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    currentVideoUidRef.current = null;

    try {
      if (!auth || !auth.session || !auth.session.access_token) {
        throw new Error('No active session or access token');
      }

      // Get video duration before starting upload
      console.log('Starting duration detection');
      const duration = await getVideoDuration(file);
      console.log('Adding duration to metadata:', duration);
      metadata.duration = duration;

      // Log the complete metadata object
      console.log('Complete upload metadata:', metadata);

      // 1. Get signed URL from quick-worker endpoint
      const supabaseUrl = supabase.supabaseUrl;
      const quickWorkerEndpoint = `${supabaseUrl}/functions/v1/quick-worker`;
      
      const createResponse = await fetch(quickWorkerEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.session.access_token}`,
          'Upload-Length': file.size.toString(),
          'Tus-Resumable': '1.0.0',
          'Upload-Metadata': `name ${btoa(file.name)},type ${btoa(file.type)},requiresignedurls`,
          'Upload-Creator': metadata.tutorId?.toString() || '0',
        }
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({ message: createResponse.statusText }));
        throw new Error(`Failed to get upload URL: ${errorData.message || createResponse.statusText}`);
      }

      const uploadUrl = createResponse.headers.get('Location');
      if (!uploadUrl) {
        throw new Error('No upload URL received');
      }

      // Get video UID from stream-media-id header
      const videoUid = createResponse.headers.get('stream-media-id');
      if (!videoUid) {
        throw new Error('No video UID received in stream-media-id header');
      }

      
      // Store the videoUid immediately after getting it from the headers
      currentVideoUidRef.current = videoUid;

      // 2. Upload using tus
      return new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: uploadUrl,
          retryDelays: [0, 1000, 3000, 5000],
          metadata: {
            filename: file.name,
            filetype: file.type,
            ...metadata
          },
          headers: {},
          onError: function(err) {
            console.error('Tus upload error:', err);
            const error = new Error(err.message);
            error.videoUid = currentVideoUidRef.current;
            setError(error);
            setIsUploading(false);
            showNotification('שגיאה בהעלאת הקובץ', 'error');
            uploadRef.current = null;
            currentVideoUidRef.current = null;
            reject(error);
          },
          onProgress: function(bytesUploaded, bytesTotal) {
            const percentage = Math.floor((bytesUploaded / bytesTotal) * 100);
            setUploadProgress(percentage);
          },
          onSuccess: function() {
            console.log('Upload success, passing metadata to callback:', metadata);
            setIsUploading(false);
            setUploadProgress(100);
            uploadRef.current = null;
            const videoUid = currentVideoUidRef.current;
            currentVideoUidRef.current = null;
            onComplete?.(videoUid, metadata);
            resolve(videoUid);
          }
        });

        uploadRef.current = upload;
        upload.start();
      });
    } catch (err) {
      
      // If we have a videoUid when the error occurs, attach it to the error
      if (currentVideoUidRef.current) {
        err.videoUid = currentVideoUidRef.current;
      }
      setError(err);
      setIsUploading(false);
      uploadRef.current = null;
      currentVideoUidRef.current = null;
      showNotification(`שגיאה בהעלאה: ${err.message}`, 'error');
      throw err;
    }
  };

  return {
    upload,
    uploadProgress,
    isUploading,
    error,
    abort
  };
} 