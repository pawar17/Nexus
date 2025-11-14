import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const mealOptions = [
  {
    id: "breakfast",
    title: "Breakfast",
    emoji: "🥞",
    description: "Morning meals",
    color: "bg-gradient-to-br from-amber-500 to-orange-500",
    foods: [
      { name: "Pancakes", emoji: "🥞" },
      { name: "Cereal", emoji: "🥣" },
      { name: "Toast", emoji: "🍞" },
      { name: "Eggs", emoji: "🍳" },
      { name: "Fruit", emoji: "🍎" },
      { name: "Yogurt", emoji: "🥛" },
    ],
  },
  {
    id: "lunch",
    title: "Lunch",
    emoji: "🥗",
    description: "Midday meals",
    color: "bg-gradient-to-br from-emerald-500 to-green-500",
    foods: [
      { name: "Sandwich", emoji: "🥪" },
      { name: "Soup", emoji: "🍲" },
      { name: "Salad", emoji: "🥗" },
      { name: "Pasta", emoji: "🍝" },
      { name: "Pizza", emoji: "🍕" },
      { name: "Rice", emoji: "🍚" },
    ],
  },
  {
    id: "dinner",
    title: "Dinner",
    emoji: "🍝",
    description: "Evening meals",
    color: "bg-gradient-to-br from-rose-500 to-pink-500",
    foods: [
      { name: "Chicken", emoji: "🍗" },
      { name: "Fish", emoji: "🐟" },
      { name: "Pasta", emoji: "🍝" },
      { name: "Rice Bowl", emoji: "🍛" },
      { name: "Soup", emoji: "🍲" },
      { name: "Vegetables", emoji: "🥦" },
    ],
  },
  {
    id: "snacks",
    title: "Snacks",
    emoji: "🍪",
    description: "Treats & bites",
    color: "bg-gradient-to-br from-violet-500 to-purple-500",
    foods: [
      { name: "Cookies", emoji: "🍪" },
      { name: "Crackers", emoji: "🍘" },
      { name: "Fruit", emoji: "🍓" },
      { name: "Chips", emoji: "🍟" },
      { name: "Nuts", emoji: "🥜" },
      { name: "Cheese", emoji: "🧀" },
    ],
  },
];

const foodNeeds = [
  { id: "hungry", text: "I'm hungry", emoji: "😋" },
  { id: "thirsty", text: "I'm thirsty", emoji: "💧" },
  { id: "full", text: "I'm full", emoji: "😊" },
  { id: "more", text: "I want more", emoji: "🍽️" },
];

const Eat = () => {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
      toast.success(`Speaking: ${text}`);
    } else {
      toast.info(text);
    }
  };

  const handleFoodNeed = (need: typeof foodNeeds[0]) => {
    speak(need.text);
  };

  const handleFoodSelect = (food: { name: string; emoji: string }) => {
    const message = `I want ${food.name}`;
    speak(message);
    toast.success(`Selected: ${food.emoji} ${food.name}`);
  };

  const currentMeal = mealOptions.find((m) => m.id === selectedMeal);

  if (selectedMeal && currentMeal) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <Button
              onClick={() => setSelectedMeal(null)}
              variant="ghost"
              className="gap-2 mb-4 -ml-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </header>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            {currentMeal.emoji} {currentMeal.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentMeal.foods.map((food, idx) => (
              <button
                key={idx}
                onClick={() => handleFoodSelect(food)}
                className="bg-card hover:bg-muted/50 border border-border text-card-foreground rounded-lg p-5 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <div className="text-4xl mb-2">{food.emoji}</div>
                <div className="text-base font-medium">{food.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
          </Link>
        </header>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Mealtime
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">What do you need?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {foodNeeds.map((need) => (
              <Button
                key={need.id}
                variant="outline"
                onClick={() => handleFoodNeed(need)}
                className="h-20 flex flex-col gap-1.5 border-border hover:bg-muted/50"
              >
                <span className="text-2xl">{need.emoji}</span>
                <span className="text-xs font-medium">{need.text}</span>
              </Button>
            ))}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-3">Choose a meal</h2>
        <div className="grid grid-cols-2 gap-3">
          {mealOptions.map((meal) => (
            <button
              key={meal.id}
              onClick={() => setSelectedMeal(meal.id)}
              className={`${meal.color} border-none text-white rounded-xl p-5 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all duration-200 shadow-md`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{meal.emoji}</div>
                <div className="text-xl font-bold mb-1">{meal.title}</div>
                <div className="text-white/80 text-sm">
                  {meal.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Eat;
