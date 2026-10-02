import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NexusProvider, useNexus } from "@/lib/store";
import { AccessLayer } from "@/access/AccessLayer";
import Home, { Intro } from "./pages/Home";
import Talk from "./pages/Talk";
import Eat from "./pages/Eat";
import Play from "./pages/Play";
import Learn from "./pages/Learn";
import Rest from "./pages/Rest";
import Therapy from "./pages/Therapy";
import Caregiver from "./pages/Caregiver";
import NotFound from "./pages/NotFound";

function Shell() {
  const { pathname } = useLocation();
  const { settings } = useNexus();
  // Switch scanning and dwell are for the child's screens, not the caregiver panel or the intro
  const paused = pathname.startsWith("/caregiver") || !settings.introSeen;

  return (
    <>
      <AccessLayer paused={paused} />
      <Intro />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/talk" element={<Talk />} />
        <Route path="/eat" element={<Eat />} />
        <Route path="/play" element={<Play />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/rest" element={<Rest />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/caregiver" element={<Caregiver />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <NexusProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Shell />
    </BrowserRouter>
  </NexusProvider>
);

export default App;
