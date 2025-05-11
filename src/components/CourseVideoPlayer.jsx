import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Stream } from "@cloudflare/stream-react";

function CourseVideoPlayer({ courseId }) {
  const [streamToken, setStreamToken] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isVideoReady, setIsVideoReady] = useState(false);

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
      }}
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