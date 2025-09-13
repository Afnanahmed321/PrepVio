import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import YouTube from "react-youtube";

// Reusable component for displaying channel information
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

// Single playlist item
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

// Video player (using react-youtube)
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
      if (event.target.interval) {
        clearInterval(event.target.interval);
      }
      event.target.interval = setInterval(async () => {
        try {
          const currentTime = await event.target.getCurrentTime();
          onTimeUpdate(Math.floor(currentTime));
        } catch (error) {
          console.error("Error getting current time:", error);
        }
      }, 1000);
    } else {
      // Paused or stopped
      if (event.target.interval) {
        clearInterval(event.target.interval);
        event.target.interval = null;
      }
    }
  };

  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();
    const disablePrintScreen = (e) => {
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText("");
        alert("⚠️ Screenshots are disabled on this page!");
      }
    };
    const disableCopy = (e) => {
      e.preventDefault();
      alert("⚠️ Copying text is disabled on this page!");
    };
    const disableSelect = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keyup", disablePrintScreen);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("selectstart", disableSelect);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keyup", disablePrintScreen);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("selectstart", disableSelect);
    };
  }, []);

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

// Sidebar with playlist
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

// Quiz Modal
const QuizModal = ({ quiz, onAnswer, onClose }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleButtonClick = (option) => {
    setSelectedAnswer(option);
    onAnswer(option);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm z-[100] animate-fadeIn">
      <div className="relative bg-gray-800 rounded-3xl p-8 w-full max-w-lg mx-4 shadow-2xl transform transition-transform duration-300 scale-100">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-white">Quiz Question</h2>
          {selectedAnswer && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl font-bold"
            >
              ✖
            </button>
          )}
        </div>

        <span className="text-gray-500 text-sm font-semibold block mb-4">
          {quiz.questionNumber || ""}
        </span>

        <p className="mb-8 text-gray-300 text-xl font-medium leading-relaxed">
          {quiz.question}
        </p>

        <div className="flex flex-col gap-4">
          {quiz.options.map((option, i) => {
            let buttonClasses =
              "w-full py-4 rounded-xl font-bold transition-all duration-200 ease-in-out transform";
            let hoverClasses = "hover:-translate-y-1 hover:shadow-lg";

            if (selectedAnswer) {
              if (option === quiz.correctAnswer) {
                buttonClasses += " bg-green-600 text-white shadow-green-500/30";
                hoverClasses = "";
              } else if (option === selectedAnswer && option !== quiz.correctAnswer) {
                buttonClasses += " bg-red-600 text-white shadow-red-500/30";
                hoverClasses = "";
              } else {
                buttonClasses += " bg-gray-700 text-gray-400 cursor-not-allowed";
                hoverClasses = "";
              }
            } else {
              buttonClasses += " bg-gray-700 text-gray-200 " + hoverClasses;
            }

            return (
              <button
                key={i}
                className={buttonClasses}
                onClick={() => handleButtonClick(option)}
                disabled={!!selectedAnswer}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="mt-6 text-center text-lg font-bold">
            {selectedAnswer === quiz.correctAnswer ? (
              <span className="text-green-400">Correct! You've got it.</span>
            ) : (
              <span className="text-red-400">
                Incorrect! The correct answer was:
                <span className="block mt-1 font-extrabold text-white">
                  "{quiz.correctAnswer}"
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main VideoPlayer Component
export default function VideoPlayer() {
  const { channelId, courseId } = useParams();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [durations, setDurations] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizQueue, setQuizQueue] = useState([]);
  const [player, setPlayer] = useState(null);
  const [shownQuizzes, setShownQuizzes] = useState(new Set());

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
        const data = response.data.data;
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

        try {
          const quizResponse = await axios.get(`${BASE_URL}/quizzes/by-playlist-document/${selectedPlaylist._id}`);
          
          if (quizResponse.data.success) {
            const quizData = quizResponse.data.data;
            const videoQuizzes = quizData?.videos || [];
            
            const allQuestions = videoQuizzes.reduce((acc, videoQuiz) => {
              if (videoQuiz.questions) {
                return acc.concat(videoQuiz.questions.map(q => ({
                  ...q,
                  videoId: videoQuiz.videoId
                })));
              }
              return acc;
            }, []);

            setQuizQuestions(allQuestions);

          } else {
            setQuizQuestions([]);
          }
        } catch (quizError) {
          console.error("Error fetching quizzes (might be normal if no quizzes exist):", quizError);
          setQuizQuestions([]);
        }

      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchContent();
  }, [selectedPlaylist, YOUTUBE_API_KEY, BASE_URL]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setSelectedVideoId(video.snippet.resourceId.videoId);
    setShownQuizzes(new Set());
    setQuizQueue([]);
    setIsQuizActive(false);
    setCurrentQuiz(null);
  };

  const handleTimeUpdate = (currentTime) => {
    if (!quizQuestions || quizQuestions.length === 0 || !selectedVideoId) return;

    const dueQuizzes = quizQuestions.filter((q) => {
      if (q.videoId !== selectedVideoId) {
        return false;
      }

      const quizTime = Math.floor(q.timestamp);
      const timeDiff = Math.abs(quizTime - currentTime);
      const isDue = timeDiff <= 1 && !shownQuizzes.has(q._id);
      
      return isDue;
    });

    if (dueQuizzes.length > 0) {
      setQuizQueue((prev) => [...prev, ...dueQuizzes]);
      setShownQuizzes((prev) => {
        const newSet = new Set(prev);
        dueQuizzes.forEach((q) => newSet.add(q._id));
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (!isQuizActive && quizQueue.length > 0) {
      const nextQuiz = quizQueue[0];
      setCurrentQuiz(nextQuiz);
      setIsQuizActive(true);
      if (player) {
        player.pauseVideo();
      }
    }
  }, [quizQueue, isQuizActive, player]);

  const handleQuizSubmit = (selectedAnswer) => {
    setTimeout(() => {
      if (player) {
        player.playVideo();
      }
      setQuizQueue((prev) => prev.slice(1));
      setIsQuizActive(false);
      setCurrentQuiz(null);
    }, 2000);
  };

  const handleQuizClose = () => {
    if (player) {
      player.playVideo();
    }
    setQuizQueue((prev) => prev.slice(1));
    setIsQuizActive(false);
    setCurrentQuiz(null);
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
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
          <div>Quizzes loaded: {quizQuestions.length}</div>
          <div>Quiz active: {isQuizActive ? 'Yes' : 'No'}</div>
          <div>Queue: {quizQueue.length}</div>
        </div>
      )}
      
      {isQuizActive && currentQuiz && (
        <QuizModal 
          quiz={currentQuiz} 
          onAnswer={handleQuizSubmit} 
          onClose={handleQuizClose}
        />
      )}
      
      <div className="flex flex-col lg:flex-row space-y-10 lg:space-y-0 lg:space-x-10">
        <PlayListPlayer 
          video={selectedVideo} 
          onPlayerReady={setPlayer} 
          onTimeUpdate={handleTimeUpdate} 
        />
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