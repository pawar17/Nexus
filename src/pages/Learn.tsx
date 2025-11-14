import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const lessons = [
  {
    id: "colors",
    title: "COLORS",
    emoji: "🎨",
    description: "Learn about colors",
    color: "bg-gradient-to-br from-red-400 to-yellow-400",
  },
  {
    id: "shapes",
    title: "SHAPES",
    emoji: "⭐",
    description: "Learn about shapes",
    color: "bg-gradient-to-br from-blue-400 to-purple-400",
  },
  {
    id: "numbers",
    title: "NUMBERS",
    emoji: "🔢",
    description: "Learn to count",
    color: "bg-gradient-to-br from-green-400 to-teal-400",
  },
  {
    id: "letters",
    title: "LETTERS",
    emoji: "📝",
    description: "Learn the alphabet",
    color: "bg-gradient-to-br from-orange-400 to-pink-400",
  },
];

const Learn = () => {
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
              ⭐ Favorites
            </Button>
          </div>
        </header>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Let's Learn Something New! 🌈
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lessons.map((lesson) => (
            <Card
              key={lesson.id}
              className={`${lesson.color} border-none text-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <CardHeader className="text-center">
                <div className="text-7xl mb-4">{lesson.emoji}</div>
                <CardTitle className="text-3xl">{lesson.title}</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  {lesson.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" variant="secondary" className="w-full">
                  START LESSON
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-accent/50 border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">🎯 Today's Challenge</CardTitle>
            <CardDescription className="text-lg">
              Complete 3 lessons to earn a special star! ⭐
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Learn;
