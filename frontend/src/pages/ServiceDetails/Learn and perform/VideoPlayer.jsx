import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

// Reusable component for displaying channel information.
const ChannelCard = ({ name, channel, image }) => (
  <div className="bg-indigo-400 rounded-xl text-white p-4 mb-4 flex items-center space-x-4">
    <img src={image} alt="Instructor" className="w-16 h-16 rounded-sm object-cover" />
    <div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-sm">{channel}</div>
      <div className="mt-2 underline cursor-pointer">My Notes</div>
    </div>
  </div>
);

// Single playlist item
const PlayListItem = ({ video, index, duration, onVideoSelect, isPlaying }) => {
  const title = video?.snippet?.title || "No Title";
  const thumbnail = video?.snippet?.thumbnails?.medium?.url;

  return (
    <div
      onClick={() => onVideoSelect(video)}
      className={`cursor-pointer rounded-xl text-black p-2 flex items-center space-x-4 transition
      ${isPlaying ? 'bg-gray-300 text-black' : 'bg-gray-100 hover:bg-gray-200'}`}
    >
      <div className="w-[100px] h-[70px] flex-shrink-0 overflow-hidden rounded bg-black">
        {thumbnail && <img src={thumbnail} alt={title} className="w-full h-full object-contain" />}
      </div>
      <div className="flex flex-col justify-between h-[70px] w-full">
        <div className="text-sm font-semibold leading-tight line-clamp-2">
          {index + 1}. {title}
        </div>
        <div className="text-xs text-black mt-1 flex items-center space-x-2">
          <span>Duration: {duration || "N/A"}</span>
          {isPlaying && (
            <span className="text-blue-900 font-semibold whitespace-nowrap">Now Playing</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Video player
const PlayListPlayer = ({ video, loading }) => {
  const videoId = video?.snippet?.resourceId?.videoId;
  const title = video?.snippet?.title;

  if (loading || !videoId) {
    return (
      <div className="w-full lg:w-2/3 bg-white p-2 rounded-xl shadow-md text-center">
        <div className="animate-pulse h-64 bg-gray-200 rounded-xl mb-4" />
        <p className="text-sm text-gray-500">Loading video...</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-2/3 bg-white p-4 rounded-xl shadow-md">
      <div className="aspect-video mb-4">
        <iframe
          className="w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h2 className="text-lg font-semibold line-clamp-2 w-full pr-2">{title}</h2>
        <button className="border border-black bg-white hover:bg-gray-300 text-black text-md px-3 py-1 rounded-md whitespace-nowrap">
          Watch Later
        </button>
      </div>
    </div>
  );
};

// Sidebar with playlist
const PlayListSidebar = ({ videos, durations, totalDuration, onVideoSelect, selectedVideoId, channelData }) => {
  const isDurationLoading = !totalDuration;

  return (
    <div className="w-full lg:w-1/3 bg-white p-2 rounded-xl shadow-md">
      <ChannelCard name={channelData.name} channel={channelData.handle} image={channelData.image} />
      
      <div className="text-sm font-semibold mb-1">Lesson Playlist</div>
      <div className="text-xs text-gray-500 mb-2">
        Total Duration: {isDurationLoading ? "Loading..." : totalDuration}
      </div>
      <div className="max-h-[400px] overflow-y-auto pr-1 space-y-4">
        {videos.map((video, index) => {
          const videoId = video?.snippet?.resourceId?.videoId;
          return (
            <PlayListItem
              key={video.id}
              index={index}
              video={video}
              duration={durations[videoId]}
              onVideoSelect={onVideoSelect}
              isPlaying={selectedVideoId === videoId}
            />
          );
        })}
      </div>
    </div>
  );
};

// VideoPlayer for a single playlist
const VideoPlayerHome = ({ playlistData }) => {
  const apiKey = "AIzaSyBs569PnYQUNFUXon5AMersGFuKS8aS1QQ";
  const contentLink = playlistData.link;
  const contentType = playlistData.type;

  const [videos, setVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [totalDuration, setTotalDuration] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatDuration = (iso) => {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const h = parseInt(match?.[1] || 0);
    const m = parseInt(match?.[2] || 0);
    const s = parseInt(match?.[3] || 0);
    const hh = h > 0 ? `${h}:` : "";
    const mm = m < 10 && h > 0 ? `0${m}` : `${m}`;
    const ss = s < 10 ? `0${s}` : `${s}`;
    return `${hh}${mm}:${ss}`;
  };

  const durationToSeconds = (iso) => {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const h = parseInt(match?.[1] || 0);
    const m = parseInt(match?.[2] || 0);
    const s = parseInt(match?.[3] || 0);
    return h * 3600 + m * 60 + s;
  };

  const secondsToHMS = (total) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const fetchPlaylistVideos = async () => {
    setLoading(true);
    try {
      if (contentType === "playlist") {
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${contentLink}&key=${apiKey}&maxResults=50`;
        const playlistRes = await fetch(playlistUrl);
        const playlistData = await playlistRes.json();
        const playlistVideos = playlistData.items || [];
        
        if (playlistVideos.length === 0) {
          setVideos([]);
          setLoading(false);
          return;
        }

        setVideos(playlistVideos);

        const videoIds = playlistVideos.map(video => video.snippet.resourceId.videoId).join(',');
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`;
        const videosRes = await fetch(videosUrl);
        const videosData = await videosRes.json();
        const videoDetails = videosData.items || [];

        const newDurations = {};
        let totalSeconds = 0;
        videoDetails.forEach(video => {
          newDurations[video.id] = formatDuration(video.contentDetails.duration);
          totalSeconds += durationToSeconds(video.contentDetails.duration);
        });

        setDurations(newDurations);
        setTotalDuration(secondsToHMS(totalSeconds));

        setSelectedVideo(playlistVideos[0]);
        setSelectedVideoId(playlistVideos[0].snippet.resourceId.videoId);
      } else if (contentType === "video") {
        const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${contentLink}&key=${apiKey}`;
        const videoRes = await fetch(videoUrl);
        const videoData = await videoRes.json();
        const videoItem = videoData.items?.[0];
        
        if (!videoItem) {
          setVideos([]);
          setLoading(false);
          return;
        }

        const singleVideo = [{
          id: videoItem.id,
          snippet: { ...videoItem.snippet, resourceId: { videoId: videoItem.id } },
          contentDetails: videoItem.contentDetails
        }];

        setVideos(singleVideo);
        setDurations({ [videoItem.id]: formatDuration(videoItem.contentDetails.duration) });
        setTotalDuration(secondsToHMS(durationToSeconds(videoItem.contentDetails.duration)));
        setSelectedVideo(singleVideo[0]);
        setSelectedVideoId(videoItem.id);
      }
    } catch (err) {
      console.error("Error loading content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistVideos();
  }, [contentLink, contentType]);

  const handleVideoSelect = (video) => {
    setLoading(true);
    setTimeout(() => {
      const id = video.snippet.resourceId.videoId;
      setSelectedVideo(video);
      setSelectedVideoId(id);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
        <PlayListPlayer video={selectedVideo} loading={loading} />
        <PlayListSidebar
          videos={videos}
          durations={durations}
          totalDuration={totalDuration}
          selectedVideoId={selectedVideoId}
          onVideoSelect={handleVideoSelect}
          channelData={playlistData.channelId}
        />
      </div>
    </div>
  );
};

// Main VideoPlayer Component
const VideoPlayer = () => {
  const { channelId, courseId } = useParams(); // fetch both channelId & courseId
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        // fetch playlists by both channelId and courseId
        const response = await fetch(`${BASE_URL}/playlists/${channelId}/${courseId}`);
        const data = await response.json();
        setAllPlaylists(data);
        setSelectedPlaylist(data.length > 0 ? data[0] : null);
      } catch (error) {
        console.error("Failed to fetch playlists from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    if (channelId && courseId) {
      fetchPlaylists();
    }
  }, [channelId, courseId]);

  if (loading) return (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <p className="text-xl font-semibold text-gray-700">Loading playlists...</p>
    </div>
  );

  if (!selectedPlaylist) return (
    <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
      <p className="text-xl font-semibold text-gray-700">No playlists found for this course.</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {selectedPlaylist && <VideoPlayerHome playlistData={selectedPlaylist} />}
    </div>
  );
};

export default VideoPlayer;
