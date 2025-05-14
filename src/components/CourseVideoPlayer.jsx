import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Stream } from "@cloudflare/stream-react";

function CourseVideoPlayer({ courseId, activeEpisode, onEpisodeComplete }) {
  const [streamToken, setStreamToken] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);
  const streamRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const lastEpisodeRef = useRef(null);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  useEffect(() => {
    const getVideoDetails = async () => {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return;
      
      const res = await fetch(process.env.REACT_APP_CLOUDFLARE_PLAY_END_POINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          video_id: courseId
        })
      });

      const data = await res.json();
      console.log('Video response:', data);
      
      if (res.ok && data.signed_url) {
        try {
          const url = new URL(data.signed_url);
          const pathParts = url.pathname.split('/');
          const vid = pathParts[1];
          const token = url.searchParams.get('token');
          
          if (!vid || !token) {
            throw new Error('Invalid URL structure');
          }

          setVideoId(vid);
          setStreamToken(token);
        } catch (error) {
          console.error('Error parsing video URL:', error);
        }
      } else {
        console.error('Error getting video details:', data?.error || res.statusText);
      }
    };

    getVideoDetails();
  }, [courseId]);

  // Handle episode changes
  useEffect(() => {
    if (!activeEpisode || !streamRef.current) return;

    // Only seek if the episode has changed
    if (lastEpisodeRef.current?.id !== activeEpisode.id) {
      try {
        console.log('Seeking to:', activeEpisode.start_time);
        streamRef.current.currentTime = activeEpisode.start_time;
        // Store the current episode
        lastEpisodeRef.current = activeEpisode;
      } catch (error) {
        console.error('Error seeking to episode start:', error);
      }
    }
  }, [activeEpisode]);

  // Monitor current time and handle episode boundaries
  useEffect(() => {
    if (activeEpisode && currentTime >= activeEpisode.end_time && streamRef.current && !isUpdatingProgress) {
      try {
        streamRef.current.pause();
        setIsUpdatingProgress(true);
        
        // Call the RPC to update watched episodes
        const updateProgress = async () => {
          const { data: episodesWatched, error } = await supabase
            .rpc('update_episodes_watched', {
              p_video_course_id: courseId,
              p_episode_index: activeEpisode.index
            });

          if (error) {
            console.error('Failed to mark episode as watched:', error);
          } else {
            console.log('Updated watched episodes:', episodesWatched);
            // Notify parent component about completion
            onEpisodeComplete?.(episodesWatched);
          }
          setIsUpdatingProgress(false);
        };

        updateProgress();
      } catch (error) {
        console.error('Error handling episode completion:', error);
        setIsUpdatingProgress(false);
      }
    }
  }, [currentTime, activeEpisode, courseId, onEpisodeComplete, isUpdatingProgress]);

  const handlePlay = () => {
    if (activeEpisode && streamRef.current) {
      // If we're outside the episode bounds, seek to start
      if (currentTime < activeEpisode.start_time || currentTime >= activeEpisode.end_time) {
        try {
          streamRef.current.currentTime = activeEpisode.start_time;
        } catch (error) {
          console.error('Error seeking on play:', error);
        }
      }
    }
  };

  if (!streamToken || !videoId) {
    return <div className="p-4 text-center">Loading video...</div>;
  }

  return (
    <Stream
      controls
      responsive
      src={videoId}
      signed
      streamToken={streamToken}
      className="w-full h-full"
      streamRef={streamRef}
      loading={<div className="p-4 text-center">Loading stream...</div>}
      onLoadedData={() => {
        setIsVideoReady(true);
        // Find and hide the thumbnail
        const thumbnailImg = document.getElementById('thumbnail-img');
        if (thumbnailImg) {
          thumbnailImg.style.display = 'none';
        }
        // Show the video player
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
          videoPlayer.style.display = 'block';
        }
        // If there's an active episode, seek to its start time
        if (activeEpisode && streamRef.current) {
          try {
            streamRef.current.currentTime = activeEpisode.start_time;
            lastEpisodeRef.current = activeEpisode;
          } catch (error) {
            console.error('Error seeking to episode start:', error);
          }
        }
      }}
      onTimeUpdate={(e) => {
        if (streamRef.current) {
          setCurrentTime(streamRef.current.currentTime);
        }
      }}
      onPlay={handlePlay}
      onError={(error) => {
        console.error('Stream error:', error);
        return (
          <div className="p-4 text-center text-red-600">
            Error loading video. Please try again later.
          </div>
        );
      }}
    />
  );
}

export default CourseVideoPlayer; 