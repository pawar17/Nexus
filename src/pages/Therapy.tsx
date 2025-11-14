import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, CheckCircle2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const therapyActivities = [
  {
    id: "exercises",
    title: "Exercises",
    emoji: "💪",
    description: "Physical moves",
    color: "bg-gradient-to-br from-rose-500 to-orange-500",
  },
  {
    id: "stretching",
    title: "Stretching",
    emoji: "🤸",
    description: "Gentle stretches",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    id: "games",
    title: "Games",
    emoji: "🎯",
    description: "Fun activities",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
  {
    id: "progress",
    title: "Progress",
    emoji: "📊",
    description: "Track growth",
    color: "bg-gradient-to-br from-violet-500 to-purple-500",
  },
];

const exercises = [
  {
    name: "Arm Circles",
    emoji: "🔄",
    description: "Move your arms in big circles",
    duration: "10 seconds",
    instructions: "Lift your arms to the sides. Make big circles forward, then backward.",
  },
  {
    name: "Shoulder Rolls",
    emoji: "👋",
    description: "Roll your shoulders gently",
    duration: "5 times",
    instructions: "Lift your shoulders up, back, and down in a smooth circle.",
  },
  {
    name: "Hand Claps",
    emoji: "👏",
    description: "Clap your hands together",
    duration: "10 times",
    instructions: "Bring your hands together and clap. Try to make a sound!",
  },
  {
    name: "Reach High",
    emoji: "🙋",
    description: "Reach up to the sky",
    duration: "5 times",
    instructions: "Lift both arms up high above your head. Hold for 3 seconds.",
  },
  {
    name: "Hug Yourself",
    emoji: "🤗",
    description: "Give yourself a big hug",
    duration: "5 times",
    instructions: "Cross your arms and give yourself a gentle hug. Hold and release.",
  },
];

const stretches = [
  {
    name: "Neck Stretch",
    emoji: "👤",
    description: "Gentle neck movement",
    duration: "10 seconds each",
    instructions: "Slowly turn your head to the right, hold. Then turn to the left, hold.",
  },
  {
    name: "Shoulder Stretch",
    emoji: "🤲",
    description: "Stretch your shoulders",
    duration: "15 seconds",
    instructions: "Bring one arm across your chest. Use your other arm to gently pull it closer.",
  },
  {
    name: "Wrist Circles",
    emoji: "✋",
    description: "Move your wrists in circles",
    duration: "10 times each",
    instructions: "Hold your arm out. Rotate your wrist in circles, then reverse direction.",
  },
  {
    name: "Finger Stretch",
    emoji: "✌️",
    description: "Stretch your fingers",
    duration: "5 times",
    instructions: "Spread your fingers wide, then make a fist. Repeat slowly.",
  },
  {
    name: "Deep Breath",
    emoji: "💨",
    description: "Breathe deeply and relax",
    duration: "3 times",
    instructions: "Take a deep breath in through your nose. Breathe out slowly through your mouth.",
  },
];

const therapyGames = [
  {
    name: "Follow the Light",
    emoji: "💡",
    description: "Track moving lights with your eyes",
    instructions: "Watch the light move across the screen. Follow it with your eyes!",
  },
  {
    name: "Touch the Colors",
    emoji: "🎨",
    description: "Touch colors as they appear",
    instructions: "When you see a color, touch it as fast as you can!",
  },
  {
    name: "Pattern Match",
    emoji: "🔲",
    description: "Match the patterns",
    instructions: "Look at the pattern and try to match it by touching the right shapes!",
  },
  {
    name: "Sound Hunt",
    emoji: "🔊",
    description: "Find the sound",
    instructions: "Listen carefully and touch where you think the sound is coming from!",
  },
];

const Therapy = () => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentStretch, setCurrentStretch] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [completedStretches, setCompletedStretches] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleExerciseComplete = (index: number) => {
    setCompletedExercises((prev) => new Set(prev).add(index));
    speak("Great job! Exercise completed!");
    toast.success("Exercise completed! ⭐");
  };

  const handleStretchComplete = (index: number) => {
    setCompletedStretches((prev) => new Set(prev).add(index));
    speak("Excellent! Stretch completed!");
    toast.success("Stretch completed! ⭐");
  };

  const handleGameStart = (game: typeof therapyGames[0]) => {
    speak(game.instructions);
    toast.success(`Starting: ${game.name}`);
    // In a real app, this would launch the actual game
  };

  if (selectedActivity === "exercises") {
    const exercise = exercises[currentExercise];
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-950 dark:to-orange-950 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => { setIsPlaying(false); setSelectedActivity(null); }} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">💪 Exercises 💪</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{exercise.emoji}</div>
              <h2 className="text-3xl font-bold mb-2">{exercise.name}</h2>
              <p className="text-xl text-muted-foreground mb-4">{exercise.description}</p>
              <p className="text-lg font-semibold mb-2">Duration: {exercise.duration}</p>
            </div>
            
            <Card className="bg-muted p-6 mb-6 rounded-2xl">
              <p className="text-lg leading-relaxed">{exercise.instructions}</p>
            </Card>

            <div className="flex gap-4 justify-center mb-6">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentExercise((prev) => (prev - 1 + exercises.length) % exercises.length);
                }}
                className="h-12 px-6"
              >
                Previous
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  if (isPlaying) {
                    window.speechSynthesis.cancel();
                    setIsPlaying(false);
                  } else {
                    speak(exercise.instructions);
                    setIsPlaying(true);
                  }
                }}
                className="h-12 px-6"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    PAUSE
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    HEAR INSTRUCTIONS
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentExercise((prev) => (prev + 1) % exercises.length);
                }}
                className="h-12 px-6"
              >
                Next
              </Button>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => handleExerciseComplete(currentExercise)}
                className={`h-16 px-8 rounded-full text-xl ${
                  completedExercises.has(currentExercise) ? "bg-green-500" : ""
                }`}
              >
                {completedExercises.has(currentExercise) ? (
                  <>
                    <CheckCircle2 className="mr-3 h-6 w-6" />
                    COMPLETED!
                  </>
                ) : (
                  "MARK AS COMPLETE ✓"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-muted-foreground">
              Exercise {currentExercise + 1} of {exercises.length}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedActivity === "stretching") {
    const stretch = stretches[currentStretch];
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => { setIsPlaying(false); setSelectedActivity(null); }} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">🤸 Stretching 🤸</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{stretch.emoji}</div>
              <h2 className="text-3xl font-bold mb-2">{stretch.name}</h2>
              <p className="text-xl text-muted-foreground mb-4">{stretch.description}</p>
              <p className="text-lg font-semibold mb-2">Duration: {stretch.duration}</p>
            </div>
            
            <Card className="bg-muted p-6 mb-6 rounded-2xl">
              <p className="text-lg leading-relaxed">{stretch.instructions}</p>
            </Card>

            <div className="flex gap-4 justify-center mb-6">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStretch((prev) => (prev - 1 + stretches.length) % stretches.length);
                }}
                className="h-12 px-6"
              >
                Previous
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  if (isPlaying) {
                    window.speechSynthesis.cancel();
                    setIsPlaying(false);
                  } else {
                    speak(stretch.instructions);
                    setIsPlaying(true);
                  }
                }}
                className="h-12 px-6"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    PAUSE
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    HEAR INSTRUCTIONS
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStretch((prev) => (prev + 1) % stretches.length);
                }}
                className="h-12 px-6"
              >
                Next
              </Button>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => handleStretchComplete(currentStretch)}
                className={`h-16 px-8 rounded-full text-xl ${
                  completedStretches.has(currentStretch) ? "bg-green-500" : ""
                }`}
              >
                {completedStretches.has(currentStretch) ? (
                  <>
                    <CheckCircle2 className="mr-3 h-6 w-6" />
                    COMPLETED!
                  </>
                ) : (
                  "MARK AS COMPLETE ✓"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-muted-foreground">
              Stretch {currentStretch + 1} of {stretches.length}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedActivity === "games") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-950 dark:to-teal-950 p-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => setSelectedActivity(null)} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">🎯 Therapy Games 🎯</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {therapyGames.map((game, idx) => (
              <Card key={idx} className="p-6 bg-card rounded-3xl shadow-xl border-2">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{game.emoji}</div>
                  <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
                  <p className="text-muted-foreground mb-4">{game.description}</p>
                </div>
                <Card className="bg-muted p-4 mb-4 rounded-xl">
                  <p className="text-sm">{game.instructions}</p>
                </Card>
                <Button
                  size="lg"
                  onClick={() => handleGameStart(game)}
                  className="w-full h-14 rounded-full text-lg"
                >
                  PLAY GAME
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedActivity === "progress") {
    const totalExercises = exercises.length;
    const totalStretches = stretches.length;
    const exerciseProgress = (completedExercises.size / totalExercises) * 100;
    const stretchProgress = (completedStretches.size / totalStretches) * 100;
    const overallProgress = ((completedExercises.size + completedStretches.size) / (totalExercises + totalStretches)) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 p-4">
        <div className="max-w-4xl mx-auto">
          <header className="mb-4">
            <Button onClick={() => setSelectedActivity(null)} size="lg" variant="outline" className="gap-2 mb-6">
              <ChevronLeft className="h-6 w-6" />
              Back
            </Button>
          </header>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">📊 My Progress 📊</h1>
          
          <Card className="p-8 bg-card rounded-3xl shadow-xl border-2 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Overall Progress</h2>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-lg font-semibold">Overall</span>
                <span className="text-lg font-semibold">{Math.round(overallProgress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-8">
                <div
                  className="bg-primary h-8 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card rounded-3xl shadow-xl border-2">
              <h3 className="text-xl font-bold mb-4 text-center">💪 Exercises</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{completedExercises.size} / {totalExercises}</span>
                  <span>{Math.round(exerciseProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-6">
                  <div
                    className="bg-red-500 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${exerciseProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                {completedExercises.size === totalExercises ? "All exercises completed! 🎉" : "Keep going!"}
              </p>
            </Card>

            <Card className="p-6 bg-card rounded-3xl shadow-xl border-2">
              <h3 className="text-xl font-bold mb-4 text-center">🤸 Stretches</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>{completedStretches.size} / {totalStretches}</span>
                  <span>{Math.round(stretchProgress)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-6">
                  <div
                    className="bg-blue-500 h-6 rounded-full transition-all duration-500"
                    style={{ width: `${stretchProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                {completedStretches.size === totalStretches ? "All stretches completed! 🎉" : "You're doing great!"}
              </p>
            </Card>
          </div>

          <Card className="p-6 bg-accent/50 border-2 border-primary mt-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">Great Job!</h3>
              <p className="text-muted-foreground">
                You've completed {completedExercises.size + completedStretches.size} activities! Keep up the amazing work!
              </p>
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
          Therapy
        </h1>

        <div className="grid grid-cols-2 gap-3">
          {therapyActivities.map((activity) => (
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

export default Therapy;
