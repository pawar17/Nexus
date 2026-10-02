import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Talk from "./pages/Talk";
import Play from "./pages/Play";
import Learn from "./pages/Learn";
import Rest from "./pages/Rest";
import Eat from "./pages/Eat";
import Therapy from "./pages/Therapy";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/talk" element={<Talk />} />
          <Route path="/play" element={<Play />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/rest" element={<Rest />} />
          <Route path="/eat" element={<Eat />} />
          <Route path="/therapy" element={<Therapy />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
