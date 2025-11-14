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
    emoji: "💬",
  },
  {
    id: "play",
    title: "PLAY",
    icon: Gamepad2,
    path: "/play",
    className: "activity-card-play",
    emoji: "🎨",
  },
  {
    id: "learn",
    title: "LEARN",
    icon: BookOpen,
    path: "/learn",
    className: "activity-card-learn",
    emoji: "🌈",
  },
  {
    id: "rest",
    title: "REST",
    icon: Moon,
    path: "/rest",
    className: "activity-card-rest",
    emoji: "🌙",
  },
  {
    id: "eat",
    title: "EAT",
    icon: Utensils,
    path: "/eat",
    className: "activity-card-eat",
    emoji: "🍕",
  },
  {
    id: "therapy",
    title: "THERAPY",
    icon: HeartPulse,
    path: "/therapy",
    className: "activity-card-therapy",
    emoji: "⭐",
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
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                Hi {childName}!
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {currentTime}
              </p>
            </div>
            <Link to="/settings">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full h-12 w-12 p-0 hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Activity Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Link
                key={activity.id}
                to={activity.path}
                className={`activity-card ${activity.className} group`}
              >
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-4xl md:text-5xl mb-3 transform group-hover:scale-105 transition-transform duration-200">
                    {activity.emoji}
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold tracking-tight">
                    {activity.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer hint */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">Tap any activity to get started</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
