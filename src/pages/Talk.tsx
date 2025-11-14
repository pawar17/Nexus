import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Edit, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const quickMessages = [
  { id: 1, text: "I'M HAPPY", emoji: "😄", color: "bg-yellow-400" },
  { id: 2, text: "I NEED HELP", emoji: "🙋", color: "bg-red-400" },
  { id: 3, text: "YES", emoji: "✅", color: "bg-green-400" },
  { id: 4, text: "NO", emoji: "❌", color: "bg-orange-400" },
];

const categories = [
  { id: "feel", label: "FEEL", emoji: "💝", color: "bg-pink-400" },
  { id: "want", label: "WANT", emoji: "🎁", color: "bg-blue-400" },
  { id: "hurt", label: "HURT", emoji: "🩹", color: "bg-red-400" },
  { id: "play", label: "PLAY", emoji: "🎪", color: "bg-purple-400" },
];

const categoryMessages: Record<string, { text: string; emoji: string }[]> = {
  feel: [
    { text: "I'm happy", emoji: "😄" },
    { text: "I'm sad", emoji: "😢" },
    { text: "I'm tired", emoji: "😴" },
    { text: "I'm excited", emoji: "🎉" },
  ],
  want: [
    { text: "I want to play", emoji: "🎪" },
    { text: "I want water", emoji: "💧" },
    { text: "I want music", emoji: "🎵" },
    { text: "I want a hug", emoji: "🤗" },
  ],
  hurt: [
    { text: "My head hurts", emoji: "🤕" },
    { text: "My tummy hurts", emoji: "🤒" },
    { text: "I need help", emoji: "🙋" },
    { text: "I'm uncomfortable", emoji: "😣" },
  ],
  play: [
    { text: "Let's play games", emoji: "🎮" },
    { text: "Read me a story", emoji: "📚" },
    { text: "I want toys", emoji: "🧸" },
    { text: "Let's draw", emoji: "🖍️" },
  ],
};

const messageBuilderWords = [
  // Pronouns & Starters
  { text: "I", emoji: "👤", category: "starters" },
  { text: "I want", emoji: "🎯", category: "starters" },
  { text: "I need", emoji: "🙋", category: "starters" },
  { text: "I feel", emoji: "💭", category: "starters" },
  { text: "I like", emoji: "❤️", category: "starters" },
  { text: "I don't like", emoji: "❌", category: "starters" },
  
  // Actions
  { text: "play", emoji: "🎮", category: "actions" },
  { text: "eat", emoji: "🍕", category: "actions" },
  { text: "drink", emoji: "🥤", category: "actions" },
  { text: "sleep", emoji: "😴", category: "actions" },
  { text: "read", emoji: "📚", category: "actions" },
  { text: "draw", emoji: "🖍️", category: "actions" },
  { text: "sing", emoji: "🎵", category: "actions" },
  { text: "dance", emoji: "💃", category: "actions" },
  
  // Objects
  { text: "water", emoji: "💧", category: "objects" },
  { text: "food", emoji: "🍎", category: "objects" },
  { text: "toys", emoji: "🧸", category: "objects" },
  { text: "music", emoji: "🎵", category: "objects" },
  { text: "story", emoji: "📖", category: "objects" },
  { text: "hug", emoji: "🤗", category: "objects" },
  { text: "help", emoji: "🆘", category: "objects" },
  { text: "bathroom", emoji: "🚽", category: "objects" },
  
  // Feelings
  { text: "happy", emoji: "😄", category: "feelings" },
  { text: "sad", emoji: "😢", category: "feelings" },
  { text: "tired", emoji: "😴", category: "feelings" },
  { text: "excited", emoji: "🎉", category: "feelings" },
  { text: "scared", emoji: "😨", category: "feelings" },
  { text: "angry", emoji: "😠", category: "feelings" },
  { text: "hurt", emoji: "🤕", category: "feelings" },
  { text: "okay", emoji: "👍", category: "feelings" },
  
  // Common words
  { text: "please", emoji: "🙏", category: "common" },
  { text: "thank you", emoji: "🙂", category: "common" },
  { text: "yes", emoji: "✅", category: "common" },
  { text: "no", emoji: "❌", category: "common" },
  { text: "more", emoji: "➕", category: "common" },
  { text: "done", emoji: "✔️", category: "common" },
  { text: "now", emoji: "⏰", category: "common" },
  { text: "later", emoji: "⏳", category: "common" },
];

const Talk = () => {
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [builderCategory, setBuilderCategory] = useState<string>("all");

  const handleQuickMessage = (text: string) => {
    setMessage(text);
    speak(text);
  };

  const handleCategoryMessage = (text: string) => {
    setMessage(text);
    speak(text);
  };

  const handleBuilderWord = (word: string) => {
    setMessage((prev) => {
      if (prev === "") {
        return word;
      }
      return prev + " " + word;
    });
  };

  const handleRemoveLastWord = () => {
    setMessage((prev) => {
      const words = prev.trim().split(/\s+/);
      words.pop();
      return words.join(" ");
    });
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
      toast.success("Speaking: " + text);
    } else {
      toast.info(text);
    }
  };

  const builderCategories = [
    { id: "all", label: "ALL", emoji: "🔤" },
    { id: "starters", label: "START", emoji: "🚀" },
    { id: "actions", label: "DO", emoji: "⚡" },
    { id: "objects", label: "THINGS", emoji: "📦" },
    { id: "feelings", label: "FEEL", emoji: "💝" },
    { id: "common", label: "COMMON", emoji: "⭐" },
  ];

  const filteredWords = builderCategory === "all" 
    ? messageBuilderWords 
    : messageBuilderWords.filter((word) => word.category === builderCategory);

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
        </header>

        {/* Quick Messages */}
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Quick Messages
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleQuickMessage(msg.text)}
                className={`${msg.color} text-white rounded-3xl p-8 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 min-h-[140px]`}
              >
                <div className="text-5xl mb-2">{msg.emoji}</div>
                <div className="text-xl md:text-2xl font-bold">{msg.text}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`${cat.color} text-white rounded-3xl p-6 shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ${
                  selectedCategory === cat.id ? "ring-4 ring-white ring-offset-4" : ""
                }`}
              >
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <div className="text-lg md:text-xl font-bold">{cat.label}</div>
              </button>
            ))}
          </div>

          {/* Category Messages */}
          {selectedCategory && (
            <Card className="p-6 bg-card rounded-3xl shadow-xl border-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryMessages[selectedCategory]?.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategoryMessage(msg.text)}
                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-2xl p-6 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{msg.emoji}</span>
                      <span className="text-xl font-semibold">{msg.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </section>

        {/* Message Builder */}
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Message Builder
          </h2>
          <Card className="p-6 bg-card rounded-3xl shadow-xl border-2">
            {/* Message Display */}
            <div className="bg-muted rounded-2xl p-6 mb-4 min-h-[100px] flex items-center">
              <p className="text-2xl md:text-3xl text-foreground font-medium break-words">
                {message || "Build your message..."}
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {builderCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setBuilderCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      builderCategory === cat.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <span className="mr-2">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Buttons */}
            <div className="mb-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBuilderWord(word.text)}
                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl p-4 shadow-md hover:scale-105 active:scale-95 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{word.emoji}</span>
                      <span className="text-base font-semibold">{word.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => message && speak(message)}
                disabled={!message}
                className="flex-1 min-w-[200px] h-16 rounded-full text-xl font-bold"
              >
                <Volume2 className="mr-3 h-6 w-6" />
                SPEAK
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleRemoveLastWord}
                disabled={!message}
                className="h-16 px-8 rounded-full text-xl font-bold"
              >
                <Delete className="mr-3 h-6 w-6" />
                UNDO
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setMessage("")}
                disabled={!message}
                className="h-16 px-8 rounded-full text-xl font-bold"
              >
                <Edit className="mr-3 h-6 w-6" />
                CLEAR
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Talk;
