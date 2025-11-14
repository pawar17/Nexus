import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const restActivities = [
  {
    id: "breathing",
    title: "Breathing",
    emoji: "💨",
    description: "Calm exercises",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "music",
    title: "Music",
    emoji: "🎵",
    description: "Relaxing sounds",
    color: "bg-gradient-to-br from-purple-500 to-violet-500",
  },
  {
    id: "stories",
    title: "Stories",
    emoji: "📖",
    description: "Peaceful tales",
    color: "bg-gradient-to-br from-indigo-500 to-blue-500",
  },
  {
    id: "visualize",
    title: "Happy Place",
    emoji: "🌈",
    description: "Imagine calm",
    color: "bg-gradient-to-br from-teal-500 to-emerald-500",
  },
];

const bedtimeStories = [
  {
    title: "The Sleepy Moon",
    content: "Once upon a time, there was a sleepy moon who loved to watch over all the children at night. The moon would shine softly, creating a peaceful glow that helped everyone feel safe and calm. As the moon watched, all the children would drift off to sleep, feeling warm and cozy. The moon smiled, knowing everyone was resting peacefully.",
    emoji: "🌙",
  },
  {
    title: "The Gentle Ocean",
    content: "Imagine you're sitting by a gentle ocean. The waves are soft and calm, making a peaceful sound as they come to shore. The water is warm and the sand is soft beneath you. You can hear the gentle breeze and see the stars twinkling above. You feel completely relaxed and at peace.",
    emoji: "🌊",
  },
  {
    title: "The Cozy Forest",
    content: "Picture yourself in a cozy forest. The trees are tall and strong, protecting you. The leaves rustle softly in the breeze. Birds are singing gentle songs. You're wrapped in a warm blanket, feeling safe and comfortable. Everything is quiet and peaceful around you.",
    emoji: "🌲",
  },
];

const Rest = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (isBreathing) {
      let phaseIndex = 0;
      const phases: Array<{ phase: typeof breathingPhase; duration: number }> = [
        { phase: "inhale", duration: 4000 },
        { phase: "hold", duration: 2000 },
        { phase: "exhale", duration: 4000 },
      ];

      const cycle = () => {
        const current = phases[phaseIndex % phases.length];
        setBreathingPhase(current.phase);
        if (current.phase === "inhale") {
          setBreathingCount((prev) => prev + 1);
        }

        breathingIntervalRef.current = setTimeout(() => {
          phaseIndex++;
          if (isBreathing) {
            cycle();
          }
        }, current.duration);
      };

      cycle();
    } else {
      if (breathingIntervalRef.current) {
        clearTimeout(breathingIntervalRef.current);
      }
    }

    return () => {
      if (breathingIntervalRef.current) {
        clearTimeout(breathingIntervalRef.current);
      }
    };
  }, [isBreathing]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startCalmMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = 220; // A3 note - calming frequency
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);

    oscillator.start();
    oscillatorRef.current = oscillator;
    toast.success("Calm music playing...");
  };

  const stopCalmMusic = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      toast.info("Music stopped");
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 0.9;
      utterance.onend = () => setIsStoryPlaying(false);
      utterance.onerror = () => setIsStoryPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsStoryPlaying(true);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsStoryPlaying(false);
    }
  };

  if (selectedActivity === "breathing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => { setIsBreathing(false); setSelectedActivity(null); }} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">💨 Breathing Exercise 💨</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2">
            <div className="text-center mb-8">
              <div
                className={`mx-auto rounded-full transition-all duration-1000 ${
                  breathingPhase === "inhale"
                    ? "bg-blue-400 w-64 h-64"
                    : breathingPhase === "hold"
                    ? "bg-blue-500 w-72 h-72"
                    : "bg-blue-300 w-48 h-48"
                } flex items-center justify-center text-white text-4xl font-bold`}
              >
                {breathingPhase === "inhale" && "Breathe In"}
                {breathingPhase === "hold" && "Hold"}
                {breathingPhase === "exhale" && "Breathe Out"}
              </div>
            </div>
            <div className="text-center mb-6">
              <p className="text-2xl text-muted-foreground">Breaths: {breathingCount}</p>
            </div>
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setIsBreathing(!isBreathing)}
                className="h-16 px-8 rounded-full text-xl"
              >
                {isBreathing ? (
                  <>
                    <Pause className="mr-3 h-6 w-6" />
                    PAUSE
                  </>
                ) : (
                  <>
                    <Play className="mr-3 h-6 w-6" />
                    START
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedActivity === "music") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-950 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => { stopCalmMusic(); setSelectedActivity(null); }} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">🎵 Calm Music 🎵</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2">
            <div className="text-center mb-8">
              <div className="text-8xl mb-6">🎵</div>
              <p className="text-xl text-muted-foreground mb-8">
                Listen to peaceful, calming sounds to help you relax
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={startCalmMusic}
                className="h-16 px-8 rounded-full text-xl"
              >
                <Play className="mr-3 h-6 w-6" />
                PLAY MUSIC
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={stopCalmMusic}
                className="h-16 px-8 rounded-full text-xl"
              >
                <Pause className="mr-3 h-6 w-6" />
                STOP
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedActivity === "stories") {
    const story = bedtimeStories[currentStory];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => { stopSpeaking(); setSelectedActivity(null); }} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">📖 Bedtime Stories 📖</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{story.emoji}</div>
              <h2 className="text-3xl font-bold mb-4">{story.title}</h2>
            </div>
            <div className="bg-muted rounded-2xl p-6 mb-6 min-h-[200px]">
              <p className="text-lg leading-relaxed">{story.content}</p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  stopSpeaking();
                  setCurrentStory((prev) => (prev - 1 + bedtimeStories.length) % bedtimeStories.length);
                }}
                className="h-12 px-6"
              >
                Previous
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  if (isStoryPlaying) {
                    stopSpeaking();
                  } else {
                    speak(story.content);
                  }
                }}
                className="h-12 px-6"
              >
                {isStoryPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    PAUSE
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    PLAY STORY
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  stopSpeaking();
                  setCurrentStory((prev) => (prev + 1) % bedtimeStories.length);
                }}
                className="h-12 px-6"
              >
                Next
              </Button>
            </div>
            <div className="text-center mt-4 text-muted-foreground">
              Story {currentStory + 1} of {bedtimeStories.length}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedActivity === "visualize") {
    const happyPlaces = [
      { name: "Beach", emoji: "🏖️", description: "Warm sand, gentle waves, sunny sky" },
      { name: "Garden", emoji: "🌺", description: "Beautiful flowers, butterflies, peaceful" },
      { name: "Mountain", emoji: "⛰️", description: "Fresh air, amazing view, quiet" },
      { name: "Forest", emoji: "🌲", description: "Tall trees, birds singing, calm" },
      { name: "Clouds", emoji: "☁️", description: "Soft and fluffy, floating peacefully" },
      { name: "Stars", emoji: "⭐", description: "Twinkling lights, peaceful night" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-950 dark:to-cyan-950 p-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => setSelectedActivity(null)} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">🌈 Happy Place 🌈</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2 mb-6">
            <p className="text-xl text-center text-muted-foreground mb-8">
              Choose a peaceful place to imagine. Close your eyes and picture yourself there.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {happyPlaces.map((place, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    speak(`Imagine you're at a ${place.name}. ${place.description}. Take a deep breath and feel peaceful.`);
                    toast.success(`Visualizing: ${place.name}`);
                  }}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-2xl p-6 shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="text-5xl mb-2">{place.emoji}</div>
                  <div className="text-xl font-bold mb-1">{place.name}</div>
                  <div className="text-sm opacity-80">{place.description}</div>
                </button>
              ))}
            </div>
          </Card>
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
          Rest & Relax
        </h1>

        <div className="grid grid-cols-2 gap-3">
          {restActivities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => setSelectedActivity(activity.id)}
              className={`${activity.color} border-none text-white rounded-xl p-5 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all duration-200 shadow-md`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{activity.emoji}</div>
                <div className="text-xl font-bold mb-1">{activity.title}</div>
                <div className="text-white/80 text-sm">
                  {activity.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rest;
