import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ServiceRouter from "./pages/ServiceDetails/ServiceRouter.jsx"; // New component
import Channels from "./pages/ServiceDetails/Learn and perform/Channels.jsx";
import CheckYourAbility from "./pages/ServiceDetails/CheckYourAbility.jsx";
import VideoPlayer from "./pages/ServiceDetails/Learn and perform/VideoPlayer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import {SmoothCursor} from "@/components/ui/smooth-cursor";

function App() {
  return (
    <>
    <SmoothCursor />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Dynamic service routing */}
        <Route path="/services/:serviceSlug" element={<ServiceRouter />} />
        <Route path="/services/:serviceSlug/:courseId" element={<Channels />} />
        <Route path="/:channelName/:channelId/:courseId" element={<VideoPlayer />} />
        <Route path="/services/check-your-ability" element={<CheckYourAbility />} />
      </Routes>
    </>
  );
}

export default App;