import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mealOptions = [
  {
    id: "breakfast",
    title: "BREAKFAST",
    emoji: "🥞",
    description: "Morning meals",
    color: "bg-gradient-to-br from-yellow-400 to-orange-400",
  },
  {
    id: "lunch",
    title: "LUNCH",
    emoji: "🥗",
    description: "Midday meals",
    color: "bg-gradient-to-br from-green-400 to-lime-400",
  },
  {
    id: "dinner",
    title: "DINNER",
    emoji: "🍝",
    description: "Evening meals",
    color: "bg-gradient-to-br from-red-400 to-pink-400",
  },
  {
    id: "snacks",
    title: "SNACKS",
    emoji: "🍪",
    description: "Yummy treats",
    color: "bg-gradient-to-br from-purple-400 to-indigo-400",
  },
];

const foodNeeds = [
  { id: "hungry", text: "I'm hungry", emoji: "😋" },
  { id: "thirsty", text: "I'm thirsty", emoji: "💧" },
  { id: "full", text: "I'm full", emoji: "😊" },
  { id: "more", text: "I want more", emoji: "🍽️" },
];

const Eat = () => {
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
          Mealtime! 🍕
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Tell us what you need:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {foodNeeds.map((need) => (
              <Button
                key={need.id}
                size="lg"
                className="h-24 flex flex-col gap-2 bg-primary hover:bg-primary/90"
              >
                <span className="text-4xl">{need.emoji}</span>
                <span className="text-sm">{need.text}</span>
              </Button>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4">Choose your meal:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mealOptions.map((meal) => (
            <Card
              key={meal.id}
              className={`${meal.color} border-none text-white cursor-pointer hover:scale-105 transition-transform`}
            >
              <CardHeader className="text-center">
                <div className="text-7xl mb-4">{meal.emoji}</div>
                <CardTitle className="text-3xl">{meal.title}</CardTitle>
                <CardDescription className="text-white/90 text-lg">
                  {meal.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" variant="secondary" className="w-full">
                  SEE OPTIONS
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eat;
