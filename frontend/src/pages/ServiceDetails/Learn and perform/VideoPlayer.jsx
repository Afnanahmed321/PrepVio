// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Modal from "../../../../../Admin/src/components/Modal";
// import axios from "axios";
// import YouTube from "react-youtube";

// // ✅ Reusable component for displaying channel information
// const ChannelCard = ({ name, imageUrl }) => (
//   <div className="bg-indigo-400 rounded-xl text-white p-4 mb-4 flex items-center space-x-4">
//     <img
//       src={imageUrl || "/fallback.jpg"}
//       alt={name}
//       className="w-16 h-16 rounded-sm object-cover"
//     />
//     <div>
//       <div className="text-lg font-semibold">{name}</div>
//       <div className="mt-2 underline cursor-pointer">My Notes</div>
//     </div>
//   </div>
// );

// // ✅ Single playlist item
// const PlayListItem = ({ video, index, duration, onVideoSelect, isPlaying }) => {
//   const title = video?.snippet?.title || "No Title";
//   const thumbnail = video?.snippet?.thumbnails?.medium?.url;

//   return (
//     <div
//       onClick={() => onVideoSelect(video)}
//       className={`cursor-pointer rounded-xl text-black p-2 flex items-center space-x-4 transition
//       ${isPlaying ? "bg-gray-300 text-black" : "bg-gray-100 hover:bg-gray-200"}`}
//     >
//       <div className="w-[100px] h-[70px] flex-shrink-0 overflow-hidden rounded bg-black">
//         {thumbnail && (
//           <img src={thumbnail} alt={title} className="w-full h-full object-contain" />
//         )}
//       </div>
//       <div className="flex flex-col justify-between h-[70px] w-full">
//         <div className="text-sm font-semibold leading-tight line-clamp-2">
//           {index + 1}. {title}
//         </div>
//         <div className="text-xs text-black mt-1 flex items-center space-x-2">
//           <span>Duration: {duration || "N/A"}</span>
//           {isPlaying && (
//             <span className="text-blue-900 font-semibold whitespace-nowrap">
//               Now Playing
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Video player (using react-youtube)
// const PlayListPlayer = ({ video, onPlayerReady, onTimeUpdate }) => {
//   const videoId = video?.snippet?.resourceId?.videoId;
//   const title = video?.snippet?.title;

//   if (!videoId) {
//     return (
//       <div className="w-full lg:w-2/3 bg-white p-2 rounded-xl shadow-md text-center">
//         <div className="h-64 flex items-center justify-center text-gray-500">
//           Select a video to play.
//         </div>
//       </div>
//     );
//   }

//   const opts = {
//   height: "475",   // change this value
//   width: "845",    // change this value
//   playerVars: {
//     autoplay: 1,
//     controls: 1,
//   },
// };

//   const handleReady = (event) => {
//     if (onPlayerReady) onPlayerReady(event.target); // pass player instance up
//   };

//   const handleStateChange = (event) => {
//     if (event.data === 1) {
//       // Playing
//       event.target.interval = setInterval(async () => {
//         const currentTime = await event.target.getCurrentTime();
//         onTimeUpdate(Math.floor(currentTime));
//       }, 1000);
//     } else if (event.target.interval) {
//       clearInterval(event.target.interval);
//     }
//   };

//   return (
//     <div className="w-full lg:w-2/3 bg-white p-4 rounded-xl shadow-md">
//       <div className="aspect-video mb-4 overflow-hidden">
//   <YouTube
//     videoId={videoId}
//     opts={opts}
//     onReady={handleReady}
//     onStateChange={handleStateChange}
//   />
// </div>

//       <div className="flex items-start justify-between gap-2 mb-2">
//         <h2 className="text-lg font-semibold line-clamp-2 w-full pr-2">{title}</h2>
//         <button className="border border-black bg-white hover:bg-gray-300 text-black text-md px-3 py-1 rounded-md whitespace-nowrap">
//           Watch Later
//         </button>
//       </div>
//     </div>
//   );
// };

// // ✅ Sidebar with playlist
// const PlayListSidebar = ({ videos, durations, onVideoSelect, selectedVideoId, channelData }) => {
//   return (
//     <div className="w-full lg:w-1/3 bg-white p-2 rounded-xl shadow-md">
//       <ChannelCard name={channelData?.name} imageUrl={channelData?.imageUrl} />
//       <div className="text-sm font-semibold mb-1">Lesson Playlist</div>
//       <div className="max-h-[400px] overflow-y-auto pr-1 space-y-4">
//         {videos.map((video, index) => {
//           const videoId = video?.snippet?.resourceId?.videoId;
//           return (
//             <PlayListItem
//               key={video.id}
//               index={index}
//               video={video}
//               duration={durations[videoId]}
//               onVideoSelect={onVideoSelect}
//               isPlaying={selectedVideoId === videoId}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // ✅ Quiz Modal
// const QuizModal = ({ quiz, onAnswer }) => {
//   const [selectedAnswer, setSelectedAnswer] = useState(null);

//   const handleButtonClick = (option) => {
//     setSelectedAnswer(option);
//     onAnswer(option);
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Quiz!</h2>
//         <p className="mb-4 text-lg">{quiz.question}</p>
//         <div className="flex flex-col space-y-2">
//           {quiz.options.map((option, i) => (
//             <button
//               key={i}
//               className={`w-full p-3 rounded-md text-white font-medium transition-colors
//                 ${
//                   selectedAnswer === option
//                     ? option === quiz.correctAnswer
//                       ? "bg-green-500"
//                       : "bg-red-500"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               onClick={() => handleButtonClick(option)}
//               disabled={selectedAnswer !== null}
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//         <p className="mt-4 text-center text-sm text-gray-500">
//           {selectedAnswer &&
//             (selectedAnswer === quiz.correctAnswer
//               ? "Correct!"
//               : `Incorrect. The answer is "${quiz.correctAnswer}".`)}
//         </p>
//       </div>
//     </div>
//   );
// };

// // ✅ Main VideoPlayer Component
// export default function VideoPlayer() {
//   const { channelId, courseId } = useParams();
//   const [selectedPlaylist, setSelectedPlaylist] = useState(null);
//   const [videos, setVideos] = useState([]);
//   const [durations, setDurations] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedVideo, setSelectedVideo] = useState(null);
//   const [selectedVideoId, setSelectedVideoId] = useState(null);

//   // Quiz state
//   const [quizzes, setQuizzes] = useState([]);
//   const [isQuizActive, setIsQuizActive] = useState(false);
//   const [currentQuiz, setCurrentQuiz] = useState(null);
//   const [player, setPlayer] = useState(null);

//   const BASE_URL = "http://localhost:5000/api";
//   const YOUTUBE_API_KEY = "AIzaSyBs569PnYQUNFUXon5AMersGFuKS8aS1QQ";

//   const formatDuration = (iso) => {
//     const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
//     const h = parseInt(match?.[1] || 0);
//     const m = parseInt(match?.[2] || 0);
//     const s = parseInt(match?.[3] || 0);
//     const hh = h > 0 ? `${h}:` : "";
//     const mm = m < 10 && h > 0 ? `0${m}` : `${m}`;
//     const ss = s < 10 ? `0${s}` : `${s}`;
//     return `${hh}${mm}:${ss}`;
//   };

//   // 1. Fetch playlists
//   useEffect(() => {
//     const fetchPlaylists = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/playlists/${channelId}/${courseId}`);
//         const data = response.data;
//         if (data.length > 0) {
//           setSelectedPlaylist(data[0]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch playlists:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (channelId && courseId) {
//       fetchPlaylists();
//     }
//   }, [channelId, courseId]);

//   // 2. Fetch videos + durations + quizzes
//   useEffect(() => {
//     const fetchContent = async () => {
//       if (!selectedPlaylist) return;
//       const contentLink = selectedPlaylist.link;
//       const contentType = selectedPlaylist.type;

//       let videoItems = [];
//       try {
//         if (contentType === "playlist") {
//           const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${contentLink}&key=${YOUTUBE_API_KEY}&maxResults=50`;
//           const playlistRes = await axios.get(playlistUrl);
//           videoItems = playlistRes.data.items || [];
//         } else if (contentType === "video") {
//           const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${contentLink}&key=${YOUTUBE_API_KEY}`;
//           const videoRes = await axios.get(videoUrl);
//           const videoItem = videoRes.data.items?.[0];
//           if (videoItem) {
//             videoItems = [
//               {
//                 id: videoItem.id,
//                 snippet: { ...videoItem.snippet, resourceId: { videoId: videoItem.id } },
//                 contentDetails: videoItem.contentDetails,
//               },
//             ];
//           }
//         }

//         setVideos(videoItems);
//         if (videoItems.length > 0) {
//           setSelectedVideo(videoItems[0]);
//           setSelectedVideoId(videoItems[0].snippet.resourceId.videoId);
//         }

//         const videoIds = videoItems.map((v) => v.snippet.resourceId.videoId).join(",");
//         if (videoIds) {
//           const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
//           const videosRes = await axios.get(videosUrl);
//           const videoDetails = videosRes.data.items || [];
//           const newDurations = {};
//           videoDetails.forEach((video) => {
//             newDurations[video.id] = formatDuration(video.contentDetails.duration);
//           });
//           setDurations(newDurations);
//         }

//         const quizResponse = await axios.get(`${BASE_URL}/quizzes/by-playlist/${selectedPlaylist._id}`);
//         setQuizzes(quizResponse.data);
//       } catch (error) {
//         console.error("Error fetching content:", error);
//       }
//     };
//     fetchContent();
//   }, [selectedPlaylist]);

//   const handleVideoSelect = (video) => {
//     setSelectedVideo(video);
//     setSelectedVideoId(video.snippet.resourceId.videoId);
//   };

//   const handleQuizSubmit = (selectedAnswer) => {
//     if (player) player.playVideo();
//     setTimeout(() => {
//       setIsQuizActive(false);
//       setCurrentQuiz(null);
//     }, 2000);
//   };

//   const handleTimeUpdate = (currentTime) => {
//     const quizTrigger = quizzes.find((q) => Math.floor(q.timestamp) === currentTime);
//     if (quizTrigger && !isQuizActive) {
//       setIsQuizActive(true);
//       setCurrentQuiz(quizTrigger);
//       if (player) player.pauseVideo();
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <p className="text-xl font-semibold text-gray-700">Loading playlists...</p>
//       </div>
//     );

//   if (!selectedPlaylist)
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <p className="text-xl font-semibold text-gray-700">
//           No playlists found for this course.
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
//       {isQuizActive && currentQuiz && <QuizModal quiz={currentQuiz} onAnswer={handleQuizSubmit} />}
//       <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
//         <PlayListPlayer video={selectedVideo} onPlayerReady={setPlayer} onTimeUpdate={handleTimeUpdate} />
//         <PlayListSidebar
//           videos={videos}
//           durations={durations}
//           onVideoSelect={handleVideoSelect}
//           selectedVideoId={selectedVideoId}
//           channelData={selectedPlaylist.channelId}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";

// ✅ Reusable component for displaying channel information
const ChannelCard = ({ name, imageUrl }) => (
  <div className="bg-indigo-400 rounded-xl text-white p-4 mb-4 flex items-center space-x-4">
    <img
      src={imageUrl || "/fallback.jpg"}
      alt={name}
      className="w-16 h-16 rounded-sm object-cover"
    />
    <div>
      <div className="text-lg font-semibold">{name}</div>
      <div className="mt-2 underline cursor-pointer">My Notes</div>
    </div>
  </div>
);

// ✅ Single playlist item
const PlayListItem = ({ video, index, duration, onVideoSelect, isPlaying }) => {
  const title = video?.snippet?.title || "No Title";
  const thumbnail = video?.snippet?.thumbnails?.medium?.url;

  return (
    <div
      onClick={() => onVideoSelect(video)}
      className={`cursor-pointer rounded-xl text-black p-2 flex items-center space-x-4 transition
      ${isPlaying ? "bg-gray-300 text-black" : "bg-gray-100 hover:bg-gray-200"}`}
    >
      <div className="w-[100px] h-[70px] flex-shrink-0 overflow-hidden rounded bg-black">
        {thumbnail && (
          <img src={thumbnail} alt={title} className="w-full h-full object-contain" />
        )}
      </div>
      <div className="flex flex-col justify-between h-[70px] w-full">
        <div className="text-sm font-semibold leading-tight line-clamp-2">
          {index + 1}. {title}
        </div>
        <div className="text-xs text-black mt-1 flex items-center space-x-2">
          <span>Duration: {duration || "N/A"}</span>
          {isPlaying && (
            <span className="text-blue-900 font-semibold whitespace-nowrap">
              Now Playing
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Video player (using react-youtube)
const PlayListPlayer = ({ video, onPlayerReady, onTimeUpdate }) => {
  const videoId = video?.snippet?.resourceId?.videoId;
  const title = video?.snippet?.title;

  if (!videoId) {
    return (
      <div className="w-full lg:w-2/3 bg-white p-2 rounded-xl shadow-md text-center">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Select a video to play.
        </div>
      </div>
    );
  }

  const opts = {
    height: "475",
    width: "845",
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  const handleReady = (event) => {
    if (onPlayerReady) onPlayerReady(event.target);
  };

  const handleStateChange = (event) => {
    if (event.data === 1) {
      // Playing
      event.target.interval = setInterval(async () => {
        const currentTime = await event.target.getCurrentTime();
        onTimeUpdate(Math.floor(currentTime));
      }, 1000);
    } else if (event.target.interval) {
      clearInterval(event.target.interval);
    }
  };

  return (
    <div className="w-full lg:w-2/3 bg-white p-4 rounded-xl shadow-md">
      <div className="aspect-video mb-4 overflow-hidden rounded-lg">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onStateChange={handleStateChange}
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

// ✅ Sidebar with playlist
const PlayListSidebar = ({ videos, durations, onVideoSelect, selectedVideoId, channelData }) => {
  return (
    <div className="w-full lg:w-1/3 bg-white p-2 rounded-xl shadow-md">
      <ChannelCard name={channelData?.name} imageUrl={channelData?.imageUrl} />
      <div className="text-sm font-semibold mb-1">Lesson Playlist</div>
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

// ✅ Quiz Modal
const QuizModal = ({ quiz, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleButtonClick = (option) => {
    setSelectedAnswer(option);
    onAnswer(option);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100]">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Quiz!</h2>
        <p className="mb-4 text-lg">{quiz.question}</p>
        <div className="flex flex-col space-y-2">
          {quiz.options.map((option, i) => (
            <button
              key={i}
              className={`w-full p-3 rounded-md text-white font-medium transition-colors
                ${
                  selectedAnswer === option
                    ? option === quiz.correctAnswer
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              onClick={() => handleButtonClick(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          {selectedAnswer &&
            (selectedAnswer === quiz.correctAnswer
              ? "Correct!"
              : `Incorrect. The answer is "${quiz.correctAnswer}".`)}
        </p>
      </div>
    </div>
  );
};

// ✅ Main VideoPlayer Component
export default function VideoPlayer() {
  const { channelId, courseId } = useParams();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Quiz state
  const [quizzes, setQuizzes] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizQueue, setQuizQueue] = useState([]); // ✅ queue for multiple quizzes
  const [player, setPlayer] = useState(null);
  const [shownQuizzes, setShownQuizzes] = useState(new Set()); // ✅ prevent repeats

  const BASE_URL = "http://localhost:5000/api";
  const YOUTUBE_API_KEY = "AIzaSyBs569PnYQUNFUXon5AMersGFuKS8aS1QQ";

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

  // 1. Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/playlists/${channelId}/${courseId}`);
        const data = response.data;
        if (data.length > 0) {
          setSelectedPlaylist(data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    if (channelId && courseId) {
      fetchPlaylists();
    }
  }, [channelId, courseId]);

  // 2. Fetch videos + durations + quizzes
  useEffect(() => {
    const fetchContent = async () => {
      if (!selectedPlaylist) return;
      const contentLink = selectedPlaylist.link;
      const contentType = selectedPlaylist.type;

      let videoItems = [];
      try {
        if (contentType === "playlist") {
          const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${contentLink}&key=${YOUTUBE_API_KEY}&maxResults=50`;
          const playlistRes = await axios.get(playlistUrl);
          videoItems = playlistRes.data.items || [];
        } else if (contentType === "video") {
          const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${contentLink}&key=${YOUTUBE_API_KEY}`;
          const videoRes = await axios.get(videoUrl);
          const videoItem = videoRes.data.items?.[0];
          if (videoItem) {
            videoItems = [
              {
                id: videoItem.id,
                snippet: { ...videoItem.snippet, resourceId: { videoId: videoItem.id } },
                contentDetails: videoItem.contentDetails,
              },
            ];
          }
        }

        setVideos(videoItems);
        if (videoItems.length > 0) {
          setSelectedVideo(videoItems[0]);
          setSelectedVideoId(videoItems[0].snippet.resourceId.videoId);
        }

        const videoIds = videoItems.map((v) => v.snippet.resourceId.videoId).join(",");
        if (videoIds) {
          const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
          const videosRes = await axios.get(videosUrl);
          const videoDetails = videosRes.data.items || [];
          const newDurations = {};
          videoDetails.forEach((video) => {
            newDurations[video.id] = formatDuration(video.contentDetails.duration);
          });
          setDurations(newDurations);
        }

        const quizResponse = await axios.get(`${BASE_URL}/quizzes/by-playlist/${selectedPlaylist._id}`);
        setQuizzes(quizResponse.data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchContent();
  }, [selectedPlaylist]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setSelectedVideoId(video.snippet.resourceId.videoId);
    setShownQuizzes(new Set()); // reset shown quizzes when switching video
    setQuizQueue([]); // reset queue
  };

  // ✅ Push due quizzes into queue
  const handleTimeUpdate = (currentTime) => {
    const dueQuizzes = quizzes.filter(
      (q) => Math.floor(q.timestamp) === currentTime && !shownQuizzes.has(q._id)
    );

    if (dueQuizzes.length > 0) {
      setQuizQueue((prev) => [...prev, ...dueQuizzes]);
      setShownQuizzes((prev) => {
        const newSet = new Set(prev);
        dueQuizzes.forEach((q) => newSet.add(q._id));
        return newSet;
      });
    }
  };

  // ✅ Process quiz queue
  useEffect(() => {
    if (!isQuizActive && quizQueue.length > 0) {
      const nextQuiz = quizQueue[0];
      setCurrentQuiz(nextQuiz);
      setIsQuizActive(true);
      if (player) player.pauseVideo();
    }
  }, [quizQueue, isQuizActive, player]);

  // ✅ Handle submit
  const handleQuizSubmit = () => {
    if (player) player.playVideo();
    setTimeout(() => {
      setIsQuizActive(false);
      setQuizQueue((prev) => prev.slice(1));
      setCurrentQuiz(null);
    }, 2000);
  };

  if (loading)
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">Loading playlists...</p>
      </div>
    );

  if (!selectedPlaylist)
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-700">
          No playlists found for this course.
        </p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans relative">
      {isQuizActive && currentQuiz && <QuizModal quiz={currentQuiz} onAnswer={handleQuizSubmit} />}
      <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
        <PlayListPlayer video={selectedVideo} onPlayerReady={setPlayer} onTimeUpdate={handleTimeUpdate} />
        <PlayListSidebar
          videos={videos}
          durations={durations}
          onVideoSelect={handleVideoSelect}
          selectedVideoId={selectedVideoId}
          channelData={selectedPlaylist.channelId}
        />
      </div>
    </div>
  );
}
