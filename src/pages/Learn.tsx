import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const lessons = [
  {
    id: "colors",
    title: "Colors",
    emoji: "🎨",
    description: "Learn colors",
    color: "bg-gradient-to-br from-rose-500 to-orange-500",
  },
  {
    id: "shapes",
    title: "Shapes",
    emoji: "⭐",
    description: "Learn shapes",
    color: "bg-gradient-to-br from-blue-500 to-violet-500",
  },
  {
    id: "numbers",
    title: "Numbers",
    emoji: "🔢",
    description: "Learn to count",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    id: "letters",
    title: "Letters",
    emoji: "📝",
    description: "Learn alphabet",
    color: "bg-gradient-to-br from-amber-500 to-pink-500",
  },
];

const colorItems = [
  { name: "Red", color: "bg-red-500", emoji: "🔴" },
  { name: "Blue", color: "bg-blue-500", emoji: "🔵" },
  { name: "Green", color: "bg-green-500", emoji: "🟢" },
  { name: "Yellow", color: "bg-yellow-500", emoji: "🟡" },
  { name: "Orange", color: "bg-orange-500", emoji: "🟠" },
  { name: "Purple", color: "bg-purple-500", emoji: "🟣" },
  { name: "Pink", color: "bg-pink-500", emoji: "🌸" },
  { name: "Brown", color: "bg-amber-800", emoji: "🟤" },
];

const shapes = [
  { name: "Circle", emoji: "⭕", description: "Round like a ball" },
  { name: "Square", emoji: "⬜", description: "Four equal sides" },
  { name: "Triangle", emoji: "🔺", description: "Three sides" },
  { name: "Rectangle", emoji: "▭", description: "Long square" },
  { name: "Star", emoji: "⭐", description: "Shiny in the sky" },
  { name: "Heart", emoji: "❤️", description: "Full of love" },
  { name: "Diamond", emoji: "💎", description: "Sparkly shape" },
  { name: "Oval", emoji: "🥚", description: "Like an egg" },
];

const numbers = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  word: ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"][i],
  emoji: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"][i],
}));

const letters = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i);
  const words = [
    "Apple", "Ball", "Cat", "Dog", "Elephant", "Fish", "Guitar", "House",
    "Ice", "Jelly", "Kite", "Lion", "Moon", "Nest", "Orange", "Pizza",
    "Queen", "Rainbow", "Sun", "Tree", "Umbrella", "Violin", "Water",
    "X-ray", "Yoyo", "Zebra"
  ];
  return {
    letter,
    word: words[i],
    emoji: ["🍎", "⚽", "🐱", "🐶", "🐘", "🐟", "🎸", "🏠", "🧊", "🍮", "🪁", "🦁", "🌙", "🪺", "🍊", "🍕", "👑", "🌈", "☀️", "🌳", "☂️", "🎻", "💧", "🩻", "🪀", "🦓"][i],
  };
});

const Learn = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleColorClick = (color: typeof colorItems[0]) => {
    speak(`This is ${color.name}`);
    toast.success(`${color.name} color!`);
  };

  const handleShapeClick = (shape: typeof shapes[0]) => {
    speak(`This is a ${shape.name}. ${shape.description}`);
    toast.success(`Shape: ${shape.name}`);
  };

  const handleNumberClick = (num: typeof numbers[0]) => {
    speak(`${num.word}. ${num.number}`);
    toast.success(`Number ${num.number}: ${num.word}`);
  };

  const handleLetterClick = (letter: typeof letters[0]) => {
    speak(`${letter.letter} for ${letter.word}`);
    toast.success(`${letter.letter} - ${letter.word}`);
  };

  const completeLesson = () => {
    if (selectedLesson) {
      setCompletedLessons((prev) => new Set(prev).add(selectedLesson));
      speak("Great job! You completed the lesson!");
      toast.success("Lesson completed! ⭐");
    }
  };

  if (selectedLesson === "colors") {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <Button onClick={() => setSelectedLesson(null)} variant="ghost" className="gap-2 mb-4 -ml-2">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </header>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">🎨 Colors</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {colorItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleColorClick(item)}
                className={`${item.color} text-white rounded-lg p-6 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <div className="text-base font-semibold">{item.name}</div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <Button onClick={completeLesson} className="px-6">
              Complete Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLesson === "shapes") {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <Button onClick={() => setSelectedLesson(null)} variant="ghost" className="gap-2 mb-4 -ml-2">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </header>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">⭐ Shapes</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {shapes.map((shape, idx) => (
              <button
                key={idx}
                onClick={() => handleShapeClick(shape)}
                className="bg-card border border-border hover:bg-muted/50 text-card-foreground rounded-lg p-5 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <div className="text-4xl mb-2">{shape.emoji}</div>
                <div className="text-base font-semibold mb-1">{shape.name}</div>
                <div className="text-xs text-muted-foreground">{shape.description}</div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <Button onClick={completeLesson} className="px-6">
              Complete Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLesson === "numbers") {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <Button onClick={() => setSelectedLesson(null)} variant="ghost" className="gap-2 mb-4 -ml-2">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </header>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">🔢 Numbers</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {numbers.map((num, idx) => (
              <button
                key={idx}
                onClick={() => handleNumberClick(num)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-5 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <div className="text-4xl mb-2">{num.emoji}</div>
                <div className="text-2xl font-bold mb-1">{num.number}</div>
                <div className="text-sm">{num.word}</div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <Button onClick={completeLesson} className="px-6">
              Complete Lesson
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedLesson === "letters") {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6">
            <Button onClick={() => setSelectedLesson(null)} variant="ghost" className="gap-2 mb-4 -ml-2">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Button>
          </header>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">📝 Letters</h1>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            {letters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(letter)}
                className="bg-card border border-border hover:bg-muted/50 text-card-foreground rounded-lg p-3 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <div className="text-2xl mb-1">{letter.emoji}</div>
                <div className="text-xl font-bold mb-0.5">{letter.letter}</div>
                <div className="text-xs text-muted-foreground">{letter.word}</div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <Button onClick={completeLesson} className="px-6">
              Complete Lesson
            </Button>
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
          Learning
        </h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson.id)}
              className={`${lesson.color} border-none text-white rounded-xl p-5 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all duration-200 shadow-md relative`}
            >
              {completedLessons.has(lesson.id) && (
                <div className="absolute top-2 right-2 text-xl">✓</div>
              )}
              <div className="text-center">
                <div className="text-5xl mb-3">{lesson.emoji}</div>
                <div className="text-xl font-bold mb-1">{lesson.title}</div>
                <div className="text-white/80 text-sm">
                  {lesson.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {completedLessons.size > 0 && (
          <Card className="bg-muted/50 border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
              <CardDescription className="text-sm">
                {completedLessons.size} of {lessons.length} lessons completed
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Learn;
