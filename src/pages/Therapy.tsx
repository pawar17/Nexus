import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const therapyActivities = [
  {
    id: "exercises",
    title: "EXERCISES",
    emoji: "💪",
    description: "Physical therapy moves",
    color: "bg-gradient-to-br from-red-400 to-orange-400",
  },
  {
    id: "stretching",
    title: "STRETCHING",
    emoji: "🤸",
    description: "Gentle stretches",
    color: "bg-gradient-to-br from-blue-400 to-cyan-400",
  },
  {
    id: "games",
    title: "THERAPY GAMES",
    emoji: "🎯",
    description: "Fun therapy activities",
    color: "bg-gradient-to-br from-green-400 to-teal-400",
  },
  {
    id: "progress",
    title: "MY PROGRESS",
    emoji: "📊",
    description: "See how you're doing",
    color: "bg-gradient-to-br from-purple-400 to-pink-400",
  },
];

const Therapy = () => {
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
            <Button size="lg" variant="outline" className="gap-2">
              📅 Schedule
            </Button>
          </div>
        </header>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Therapy Time! ⭐
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {therapyActivities.map((activity) => (
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
            <CardTitle className="text-2xl">🎉 Great Job!</CardTitle>
            <CardDescription className="text-lg">
              You're working so hard! Keep going, you're amazing!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Therapy;
