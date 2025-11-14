import { Link } from "react-router-dom";
import { MessageSquare, Gamepad2, BookOpen, Moon, Utensils, HeartPulse, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const activities = [
  {
    id: "talk",
    title: "TALK",
    icon: MessageSquare,
    path: "/talk",
    className: "activity-card-talk",
    emoji: "👄",
  },
  {
    id: "play",
    title: "PLAY",
    icon: Gamepad2,
    path: "/play",
    className: "activity-card-play",
    emoji: "🎮",
  },
  {
    id: "learn",
    title: "LEARN",
    icon: BookOpen,
    path: "/learn",
    className: "activity-card-learn",
    emoji: "📚",
  },
  {
    id: "rest",
    title: "REST",
    icon: Moon,
    path: "/rest",
    className: "activity-card-rest",
    emoji: "🛏️",
  },
  {
    id: "eat",
    title: "EAT",
    icon: Utensils,
    path: "/eat",
    className: "activity-card-eat",
    emoji: "🍽️",
  },
  {
    id: "therapy",
    title: "THERAPY",
    icon: HeartPulse,
    path: "/therapy",
    className: "activity-card-therapy",
    emoji: "💪",
  },
];

const Index = () => {
  const childName = "Emma";
  const currentTime = new Date().toLocaleTimeString("en-US", { 
    hour: "numeric", 
    minute: "2-digit",
    hour12: true 
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                Hi {childName}! <span className="inline-block animate-bounce">🌟</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                {currentTime}
              </p>
            </div>
            <Link to="/settings">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full h-16 w-16 p-0 border-2 hover:border-primary"
              >
                <Settings className="h-8 w-8" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Link
                key={activity.id}
                to={activity.path}
                className={`activity-card ${activity.className} group`}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-6xl md:text-7xl mb-4 transform group-hover:scale-110 transition-transform">
                    {activity.emoji}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
                    {activity.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer hint */}
        <footer className="mt-12 text-center text-muted-foreground">
          <p className="text-lg">Tap any activity to get started</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
