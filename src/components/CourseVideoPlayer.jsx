import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Stream } from "@cloudflare/stream-react";

async function getPlaybackToken(videoUID) {
  const { data, error } = await supabase.functions.invoke('signed-token', {
    body: { videoUID }
  });

  if (error) {
    console.error("Token error:", error);
    return null;
  }

  return data.token;
}

function CourseVideoPlayer({ courseId, activeEpisode, onEpisodeComplete }) {
  const [streamToken, setStreamToken] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const streamRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const lastEpisodeIdRef = useRef(null);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  useEffect(() => {
    const getVideoDetails = async () => {
      const { data: auth } = await supabase.auth.getSession();
      if (!auth.session) return;

      try {
        const token = await getPlaybackToken(courseId);
        if (token) {
          setVideoId(courseId);
          setStreamToken(token);
        }
      } catch (error) {
        console.error("Error getting video details:", error);
      }
    };

    getVideoDetails();
  }, [courseId]);

  useEffect(() => {
    if (!isPlayerReady || !activeEpisode || !streamRef.current) return;

    if (lastEpisodeIdRef.current !== activeEpisode.id) {
      try {
        streamRef.current.pause();
        streamRef.current.currentTime = activeEpisode.start_time;
        lastEpisodeIdRef.current = activeEpisode.id;
      } catch (err) {
        // Error handling preserved without console.log
      }
    }
  }, [activeEpisode, isPlayerReady]);

  useEffect(() => {
    if (activeEpisode && currentTime >= activeEpisode.end_time && streamRef.current && !isUpdatingProgress) {
      try {
        streamRef.current.pause();
        setIsUpdatingProgress(true);
        
        const updateProgress = async () => {
          const { data: episodesWatched, error } = await supabase
            .rpc('update_episodes_watched', {
              p_video_course_id: courseId,
              p_episode_index: activeEpisode.index
            });

          if (!error && onEpisodeComplete) {
            onEpisodeComplete(episodesWatched);
          }
          setIsUpdatingProgress(false);
        };

        updateProgress();
      } catch (error) {
        setIsUpdatingProgress(false);
      }
    }
  }, [currentTime, activeEpisode, courseId, onEpisodeComplete, isUpdatingProgress]);

  const handlePlay = () => {
    if (activeEpisode && streamRef.current) {
      if (currentTime < activeEpisode.start_time || currentTime >= activeEpisode.end_time) {
        try {
          streamRef.current.currentTime = activeEpisode.start_time;
        } catch (error) {
          // Error handling preserved without console.log
        }
      }
    }
  };

  const handleLoadedData = () => {
    setIsPlayerReady(true);

    const thumbnailImg = document.getElementById("thumbnail-img");
    if (thumbnailImg) thumbnailImg.style.display = "none";
    const videoPlayer = document.getElementById("video-player");
    if (videoPlayer) videoPlayer.style.display = "block";

    if (activeEpisode && streamRef.current) {
      try {
        streamRef.current.pause();
        streamRef.current.currentTime = activeEpisode.start_time;
        lastEpisodeIdRef.current = activeEpisode.id;
      } catch (err) {
        // Error handling preserved without console.log
      }
    }
  };

  if (!streamToken || !videoId) {
    return <div className="p-4 text-center">Loading video...</div>;
  }

  return (
  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
    <Stream
      controls
      src={streamToken}
      streamRef={streamRef}
      loading={<div className="p-4 text-center">Loading stream...</div>}
      onLoadedData={handleLoadedData}
      onTimeUpdate={(e) => {
        if (streamRef.current) {
          setCurrentTime(streamRef.current.currentTime);
        }
      }}
      onPlay={handlePlay}
      onError={(error) => (
        <div className="p-4 text-center text-red-600">
          Error loading video. Please try again later.
        </div>
      )}
      autoplay={false}
    />

    {/* Watermark overlay */}
    <div
      style={{
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        color: 'white',
        padding: '5px 10px',
        fontSize: '12px',
        borderRadius: '4px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {`Daniel Ziv • ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`}
    </div>
  </div>
);
}

export default CourseVideoPlayer;
