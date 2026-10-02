import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, RotateCcw, Trash2, Volume2, ChevronLeft, ChevronRight, Play as PlayIcon, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const games = [
  {
    id: "cause-effect",
    title: "Cause & Effect",
    emoji: "✨",
    description: "Touch for effects",
    color: "bg-gradient-to-br from-pink-500 to-rose-500",
  },
  {
    id: "music",
    title: "Music Maker",
    emoji: "🎹",
    description: "Make sounds",
    color: "bg-gradient-to-br from-purple-500 to-violet-500",
  },
  {
    id: "story",
    title: "Story Time",
    emoji: "📚",
    description: "Listen to stories",
    color: "bg-gradient-to-br from-blue-500 to-indigo-500",
  },
  {
    id: "drawing",
    title: "Drawing Pad",
    emoji: "🖍️",
    description: "Create art",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
];

// Cause & Effect Component
const CauseEffect = ({ onBack }: { onBack: () => void }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  const colors = ["#FF6B9D", "#C44569", "#F8B500", "#FF6B6B", "#4ECDC4", "#95E1D3", "#F38181", "#AA96DA"];

  const createParticle = (x: number, y: number) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 30 + 20;
    const newParticle = {
      id: particleIdRef.current++,
      x,
      y,
      color,
      size,
    };
    setParticles((prev) => [...prev, newParticle]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 2000);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createParticle(x, y);
      
      // Create multiple particles for effect
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 100;
          const offsetY = (Math.random() - 0.5) * 100;
          createParticle(x + offsetX, y + offsetY);
        }, i * 50);
      }
    }
  };

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      createParticle(x, y);
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 100;
          const offsetY = (Math.random() - 0.5) * 100;
          createParticle(x + offsetX, y + offsetY);
        }, i * 50);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="page-header">
          <Button onClick={onBack} variant="ghost" className="back-button">
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
        </header>

        <h1 className="page-title">✨ Cause & Effect</h1>

        <Card className="p-4 bg-card rounded-xl border border-border">
          <div className="text-center mb-4">
            <p className="text-base text-muted-foreground">Touch anywhere to create effects!</p>
          </div>
          <div
            ref={containerRef}
            onClick={handleClick}
            onTouchStart={handleTouch}
            className="relative w-full h-[600px] bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 rounded-2xl overflow-hidden cursor-pointer"
          >
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute rounded-full animate-ping"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  transform: "translate(-50%, -50%)",
                  animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl opacity-20">✨</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Music Maker Component
const MusicMaker = ({ onBack }: { onBack: () => void }) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);

  const notes = [
    { id: 0, name: "C", color: "bg-red-400", frequency: 261.63 },
    { id: 1, name: "D", color: "bg-orange-400", frequency: 293.66 },
    { id: 2, name: "E", color: "bg-yellow-400", frequency: 329.63 },
    { id: 3, name: "F", color: "bg-green-400", frequency: 349.23 },
    { id: 4, name: "G", color: "bg-blue-400", frequency: 392.00 },
    { id: 5, name: "A", color: "bg-indigo-400", frequency: 440.00 },
    { id: 6, name: "B", color: "bg-purple-400", frequency: 493.88 },
    { id: 7, name: "C", color: "bg-pink-400", frequency: 523.25 },
  ];

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = (frequency: number, id: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);

    setActiveNotes((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setActiveNotes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <Button onClick={onBack} size="lg" variant="outline" className="rounded-full h-16 px-8 text-xl font-semibold border-2">
            <ChevronLeft className="mr-3 h-6 w-6" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">🎹 Music Maker 🎹</h1>
          <div className="w-32"></div>
        </header>
        
        <Card className="p-6 bg-card rounded-3xl shadow-xl border-2">
          <div className="text-center mb-6">
            <p className="text-xl text-muted-foreground">Tap the keys to make music!</p>
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => playNote(note.frequency, note.id)}
                className={`${note.color} ${
                  activeNotes.has(note.id) ? "scale-90 shadow-inner" : "hover:scale-105 shadow-lg"
                } text-white rounded-xl p-8 md:p-12 transition-all duration-150 min-w-[80px] md:min-w-[120px]`}
              >
                <div className="text-3xl md:text-4xl font-bold">{note.name}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Story Time Component
const StoryTime = ({ onBack }: { onBack: () => void }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stories = [
    {
      title: "The Friendly Dragon",
      content: "Once upon a time, there was a friendly dragon named Sparkle. Sparkle loved to help others and make new friends. Every day, Sparkle would fly around the kingdom, helping anyone who needed it. The children loved Sparkle because the dragon was kind and gentle. Sparkle showed everyone that being different is wonderful!",
      emoji: "🐉",
    },
    {
      title: "The Magic Garden",
      content: "In a beautiful garden, flowers could talk and sing! Every morning, the sunflowers would sing happy songs, and the roses would dance in the breeze. A little girl named Lily visited the garden every day. The flowers loved Lily because she was kind and took care of them. Together, they created the most magical garden in the world!",
      emoji: "🌺",
    },
    {
      title: "The Brave Little Star",
      content: "High up in the sky, there was a little star named Twinkle. Twinkle was smaller than all the other stars, but had the biggest heart. One night, Twinkle noticed that a child was afraid of the dark. So Twinkle shined extra bright to help the child feel safe. From that day on, Twinkle became known as the bravest star in the sky!",
      emoji: "⭐",
    },
    {
      title: "The Happy Cloud",
      content: "Cloudy was a special cloud who loved to make people smile. Instead of rain, Cloudy would make colorful shapes in the sky. Sometimes Cloudy would look like a bunny, sometimes like a heart, and sometimes like a rainbow. Everyone in the town would look up and smile when they saw Cloudy's happy shapes!",
      emoji: "☁️",
    },
  ];

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopSpeaking();
    } else {
      speak(stories[currentStoryIndex].content);
    }
  };

  const nextStory = () => {
    stopSpeaking();
    setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    stopSpeaking();
    setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <Button onClick={onBack} size="lg" variant="outline" className="rounded-full h-16 px-8 text-xl font-semibold border-2">
            <ChevronLeft className="mr-3 h-6 w-6" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">📚 Story Time 📚</h1>
          <div className="w-32"></div>
        </header>
        
        <Card className="p-8 bg-card rounded-3xl shadow-xl border-2">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">{stories[currentStoryIndex].emoji}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {stories[currentStoryIndex].title}
            </h2>
          </div>
          
          <div className="bg-muted rounded-2xl p-6 mb-6 min-h-[300px]">
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              {stories[currentStoryIndex].content}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={prevStory}
              className="h-16 px-8 rounded-full text-xl font-bold"
            >
              <ChevronLeft className="mr-3 h-6 w-6" />
              Previous
            </Button>
            <Button
              size="lg"
              onClick={handlePlayPause}
              className="h-16 px-8 rounded-full text-xl font-bold flex-1 min-w-[200px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-3 h-6 w-6" />
                  PAUSE
                </>
              ) : (
                <>
                  <PlayIcon className="mr-3 h-6 w-6" />
                  PLAY STORY
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={nextStory}
              className="h-16 px-8 rounded-full text-xl font-bold"
            >
              Next
              <ChevronRight className="ml-3 h-6 w-6" />
            </Button>
          </div>

          <div className="mt-4 text-center text-muted-foreground">
            Story {currentStoryIndex + 1} of {stories.length}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Drawing Pad Component
const DrawingPad = ({ onBack }: { onBack: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(10);

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#FFC0CB",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    toast.success("Canvas cleared!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <Button onClick={onBack} size="lg" variant="outline" className="rounded-full h-16 px-8 text-xl font-semibold border-2">
            <ChevronLeft className="mr-3 h-6 w-6" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">🖍️ Drawing Pad 🖍️</h1>
          <div className="w-32"></div>
        </header>
        
        <Card className="p-6 bg-card rounded-3xl shadow-xl border-2">
          <div className="mb-4">
            <div className="flex flex-wrap gap-3 mb-4">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-full border-4 ${
                    color === c ? "border-foreground scale-110" : "border-transparent"
                  } transition-all`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="text-lg font-semibold">Brush Size:</label>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold w-12">{brushSize}px</span>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={clearCanvas}
                className="h-12 px-6 rounded-full"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Clear
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-4 border-gray-300 dark:border-gray-600">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[500px] touch-none cursor-crosshair"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

// Main Play Component
const Play = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame === "cause-effect") {
    return <CauseEffect onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "music") {
    return <MusicMaker onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "story") {
    return <StoryTime onBack={() => setSelectedGame(null)} />;
  }
  if (selectedGame === "drawing") {
    return <DrawingPad onBack={() => setSelectedGame(null)} />;
  }

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

        <h1 className="page-title">Play & Games</h1>

        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-3">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`${game.color} text-white rounded-xl p-5 shadow-md hover:-translate-y-1 active:translate-y-0 transition-all duration-200`}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="emoji-large mb-3">
                  {game.emoji}
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {game.title}
                </h2>
                <p className="text-sm text-white/80">
                  {game.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Play;
