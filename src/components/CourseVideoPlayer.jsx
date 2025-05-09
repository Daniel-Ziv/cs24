import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Stream } from "@cloudflare/stream-react";

function CourseVideoPlayer({ courseId }) {
  const [streamToken, setStreamToken] = useState("");
  const [videoId, setVideoId] = useState("");

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
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
      <div className="absolute top-0 left-0 w-full h-full">
        <Stream
          controls
          responsive
          src={videoId}
          signed
          streamToken={streamToken}
          className="w-full h-full"
          loading={<div className="p-4 text-center">Loading stream...</div>}
          onError={(error) => {
            console.error('Stream error:', error);
            return (
              <div className="p-4 text-center text-red-600">
                Error loading video. Please try again later.
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

export default CourseVideoPlayer; 