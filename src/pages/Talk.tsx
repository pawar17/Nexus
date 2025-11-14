import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Edit, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const quickMessages = [
  { id: 1, text: "I'm happy", emoji: "😄", color: "bg-yellow-500" },
  { id: 2, text: "I need help", emoji: "🙋", color: "bg-rose-500" },
  { id: 3, text: "Yes", emoji: "✅", color: "bg-emerald-500" },
  { id: 4, text: "No", emoji: "❌", color: "bg-orange-500" },
];

const categories = [
  { id: "feel", label: "Feel", emoji: "💝", color: "bg-pink-500" },
  { id: "want", label: "Want", emoji: "🎁", color: "bg-blue-500" },
  { id: "hurt", label: "Hurt", emoji: "🩹", color: "bg-rose-500" },
  { id: "play", label: "Play", emoji: "🎪", color: "bg-purple-500" },
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
    { id: "all", label: "All", emoji: "🔤" },
    { id: "starters", label: "Start", emoji: "🚀" },
    { id: "actions", label: "Do", emoji: "⚡" },
    { id: "objects", label: "Things", emoji: "📦" },
    { id: "feelings", label: "Feel", emoji: "💝" },
    { id: "common", label: "Common", emoji: "⭐" },
  ];

  const filteredWords = builderCategory === "all" 
    ? messageBuilderWords 
    : messageBuilderWords.filter((word) => word.category === builderCategory);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="page-header">
          <Link to="/">
            <Button variant="ghost" className="back-button">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
          </Link>
        </header>

        <h1 className="page-title">Communication</h1>

        {/* Quick Messages */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Quick Messages
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleQuickMessage(msg.text)}
                className={`${msg.color} text-white rounded-xl p-5 shadow-md hover:-translate-y-1 active:translate-y-0 transition-all duration-200 min-h-[100px]`}
              >
                <div className="emoji-medium mb-2">{msg.emoji}</div>
                <div className="text-base font-semibold">{msg.text}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`${cat.color} text-white rounded-xl p-4 shadow-md hover:-translate-y-1 active:translate-y-0 transition-all duration-200 min-h-[90px] ${
                  selectedCategory === cat.id ? "ring-2 ring-offset-2 ring-foreground" : ""
                }`}
              >
                <div className="emoji-medium mb-1">{cat.emoji}</div>
                <div className="text-base font-semibold">{cat.label}</div>
              </button>
            ))}
          </div>

          {/* Category Messages */}
          {selectedCategory && (
            <Card className="p-4 bg-card rounded-xl border border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryMessages[selectedCategory]?.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategoryMessage(msg.text)}
                    className="interactive-button text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="emoji-medium">{msg.emoji}</span>
                      <span className="text-base font-medium">{msg.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </section>

        {/* Message Builder */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Message Builder
          </h2>
          <Card className="p-4 bg-card rounded-xl border border-border">
            {/* Message Display */}
            <div className="bg-muted rounded-lg p-4 mb-4 min-h-[80px] flex items-center">
              <p className="text-xl text-foreground font-medium break-words">
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      builderCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <span className="mr-1.5">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Word Buttons */}
            <div className="mb-4 max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBuilderWord(word.text)}
                    className="interactive-button text-left min-h-[70px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="emoji-small">{word.emoji}</span>
                      <span className="text-sm font-medium">{word.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => message && speak(message)}
                disabled={!message}
                className="flex-1 min-w-[150px]"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                Speak
              </Button>
              <Button
                variant="outline"
                onClick={handleRemoveLastWord}
                disabled={!message}
              >
                <Delete className="mr-2 h-5 w-5" />
                Undo
              </Button>
              <Button
                variant="outline"
                onClick={() => setMessage("")}
                disabled={!message}
              >
                <Edit className="mr-2 h-5 w-5" />
                Clear
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Talk;
