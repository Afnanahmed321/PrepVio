import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ServiceRouter from "./pages/ServiceDetails/ServiceRouter.jsx"; // New component
import Channels from "./pages/ServiceDetails/Learn and perform/Channels.jsx";
import CheckYourAbility from "./pages/ServiceDetails/CheckYourAbility.jsx";
import VideoPlayer from "./pages/ServiceDetails/Learn and perform/VideoPlayer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import {SmoothCursor} from "@/components/ui/smooth-cursor";
import Login from './components/Authentication/Login.jsx'
import ProtectedRoutes from '../utils/ProtectedRoutes.jsx'

function App() {
  return (
    <>
    <SmoothCursor />
      

       <BrowserRouter>
       <ScrollToTop />
        <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path="/" element={<Home />} />
        <Route path="/services/:serviceSlug" element={<ServiceRouter />} />
            <Route element={<ProtectedRoutes/>}>
              
              <Route path="/services/:serviceSlug/:courseId" element={<Channels />} />
              <Route path="/:channelName/:channelId/:courseId" element={<VideoPlayer />} />
              <Route path="/services/check-your-ability" element={<CheckYourAbility />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;