import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import LearnAndPerform from "./pages/ServiceDetails/Learn and perform/LearnAndPerform.jsx";
import Channels from "./pages/ServiceDetails/Learn and perform/Channels.jsx"; 
import CheckYourAbility from "./pages/ServiceDetails/CheckYourAbility.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import VideoPlayer from "./pages/ServiceDetails/Learn and perform/VideoPlayer.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Service details */}
        <Route path="/services/:serviceSlug" element={<LearnAndPerform />} />
        <Route path="/services/:serviceSlug/:courseId" element={<Channels />} />

        {/* Channel details (video player for that channel) */}
        {/* Updated route to include a channel ID parameter */}
        <Route path="/:channelId" element={<VideoPlayer />} />

        {/* Check Your Ability */}
        <Route
          path="/services/check-your-ability"
          element={<CheckYourAbility />}
        />
      </Routes>
    </>
  );
}

export default App;
