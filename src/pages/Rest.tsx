import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const restActivities = [
  {
    id: "breathing",
    title: "BREATHING",
    emoji: "💨",
    description: "Calm breathing exercises",
    color: "bg-gradient-to-br from-blue-300 to-blue-500",
  },
  {
    id: "music",
    title: "CALM MUSIC",
    emoji: "🎵",
    description: "Relaxing sounds",
    color: "bg-gradient-to-br from-purple-300 to-purple-500",
  },
  {
    id: "stories",
    title: "BEDTIME STORIES",
    emoji: "📖",
    description: "Peaceful stories",
    color: "bg-gradient-to-br from-indigo-300 to-indigo-500",
  },
  {
    id: "visualize",
    title: "HAPPY PLACE",
    emoji: "🌈",
    description: "Imagine calm places",
    color: "bg-gradient-to-br from-teal-300 to-teal-500",
  },
];

const Rest = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <Button size="lg" variant="outline" className="gap-2">
                <ArrowLeft className="h-6 w-6" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Time to Rest & Relax 🌙
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {restActivities.map((activity) => (
            <Card
              key={activity.id}
              className={`${activity.color} border-none text-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <CardHeader className="text-center">
                <div className="text-7xl mb-4">{activity.emoji}</div>
                <CardTitle className="text-3xl">{activity.title}</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  {activity.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" variant="secondary" className="w-full">
                  START
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-accent/50 border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">✨ Rest Time Tips</CardTitle>
            <CardDescription className="text-lg">
              Take your time. Close your eyes. Breathe slowly. You're doing great!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Rest;
