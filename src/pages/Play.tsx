import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const games = [
  {
    id: "cause-effect",
    title: "CAUSE & EFFECT",
    emoji: "✨",
    description: "Touch to create fun effects",
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
  },
  {
    id: "music",
    title: "MUSIC MAKER",
    emoji: "🎹",
    description: "Make beautiful sounds",
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    id: "story",
    title: "STORY TIME",
    emoji: "📚",
    description: "Listen to fun stories",
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    id: "drawing",
    title: "DRAWING PAD",
    emoji: "🖍️",
    description: "Create colorful art",
    color: "bg-gradient-to-br from-green-400 to-green-600",
  },
];

const Play = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <Link to="/">
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full h-16 px-8 text-xl font-semibold border-2"
            >
              <ArrowLeft className="mr-3 h-6 w-6" />
              Back to Home
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline"
            className="rounded-full h-16 w-16 p-0 border-2 hover:border-yellow-400"
          >
            <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            <span className="sr-only">Favorites</span>
          </Button>
        </header>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Choose Your Game 🎪
        </h1>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {games.map((game) => (
            <button
              key={game.id}
              className={`${game.color} text-white rounded-3xl p-8 shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 min-h-[200px] group`}
            >
              <div className="flex flex-col items-center justify-center text-center h-full">
                <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform">
                  {game.emoji}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {game.title}
                </h2>
                <p className="text-lg opacity-90">
                  {game.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Recommendation */}
        <div className="bg-accent/20 border-4 border-accent rounded-3xl p-6 md:p-8 text-center">
          <div className="text-5xl mb-3">🧱</div>
          <h3 className="text-2xl md:text-3xl font-bold text-accent-foreground mb-2">
            Recommended: Building Blocks
          </h3>
          <p className="text-xl text-accent-foreground/80">
            Based on your recent activity
          </p>
        </div>
      </div>
    </div>
  );
};

export default Play;
