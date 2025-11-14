import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const Settings = () => {
  const [textSize, setTextSize] = useState([100]);
  const [volume, setVolume] = useState([80]);
  const [haptics, setHaptics] = useState(true);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <Link to="/">
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full h-16 px-8 text-xl font-semibold border-2 mb-6"
            >
              <ArrowLeft className="mr-3 h-6 w-6" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Settings ⚙️
          </h1>
        </header>

        {/* User Profile */}
        <Card className="p-8 mb-6 rounded-3xl shadow-lg border-2">
          <h2 className="text-2xl font-bold mb-4 text-foreground">User Profile</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xl text-muted-foreground">Name:</span>
              <span className="text-xl font-semibold">Emma</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl text-muted-foreground">Age:</span>
              <span className="text-xl font-semibold">7 years old</span>
            </div>
          </div>
        </Card>

        {/* Interface Settings */}
        <Card className="p-8 mb-6 rounded-3xl shadow-lg border-2">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Interface</h2>
          
          <div className="space-y-8">
            {/* Text Size */}
            <div>
              <Label htmlFor="text-size" className="text-xl font-semibold mb-4 block">
                Text Size: {textSize[0]}%
              </Label>
              <Slider
                id="text-size"
                min={100}
                max={250}
                step={10}
                value={textSize}
                onValueChange={setTextSize}
                className="mt-2"
              />
            </div>

            {/* Volume */}
            <div>
              <Label htmlFor="volume" className="text-xl font-semibold mb-4 block">
                Audio Volume: {volume[0]}%
              </Label>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={5}
                value={volume}
                onValueChange={setVolume}
                className="mt-2"
              />
            </div>

            {/* Haptic Feedback */}
            <div className="flex items-center justify-between py-4">
              <Label htmlFor="haptics" className="text-xl font-semibold">
                Haptic Feedback
              </Label>
              <Switch
                id="haptics"
                checked={haptics}
                onCheckedChange={setHaptics}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between py-4">
              <Label htmlFor="animations" className="text-xl font-semibold">
                Animations
              </Label>
              <Switch
                id="animations"
                checked={animations}
                onCheckedChange={setAnimations}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </Card>

        {/* Input Methods */}
        <Card className="p-8 rounded-3xl shadow-lg border-2">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Input Methods</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <div className="text-xl font-semibold">Touch Screen</div>
                <div className="text-muted-foreground">Direct touch input</div>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div>
                <div className="text-xl font-semibold">Voice Commands</div>
                <div className="text-muted-foreground">Speak to control</div>
              </div>
              <span className="text-2xl">⏸️</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-xl font-semibold">Eye Gaze</div>
                <div className="text-muted-foreground">Eye tracking control</div>
              </div>
              <span className="text-2xl">⏸️</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
