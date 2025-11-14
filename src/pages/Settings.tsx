import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [textSize, setTextSize] = useState([100]);
  const [volume, setVolume] = useState([80]);
  const [haptics, setHaptics] = useState(true);
  const [animations, setAnimations] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTextSize = localStorage.getItem("textSize");
    const savedVolume = localStorage.getItem("volume");
    const savedHaptics = localStorage.getItem("haptics");
    const savedAnimations = localStorage.getItem("animations");

    if (savedTextSize) setTextSize([parseInt(savedTextSize)]);
    if (savedVolume) setVolume([parseInt(savedVolume)]);
    if (savedHaptics !== null) setHaptics(savedHaptics === "true");
    if (savedAnimations !== null) setAnimations(savedAnimations === "true");
  }, []);

  // Apply text size to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${textSize[0]}%`;
    localStorage.setItem("textSize", textSize[0].toString());
  }, [textSize]);

  // Save volume setting
  useEffect(() => {
    localStorage.setItem("volume", volume[0].toString());
    // Apply volume to speech synthesis if available
    if ('speechSynthesis' in window) {
      // Note: SpeechSynthesis volume is not directly controllable via API
      // This would need to be applied when creating utterances
    }
  }, [volume]);

  // Save haptics setting
  useEffect(() => {
    localStorage.setItem("haptics", haptics.toString());
  }, [haptics]);

  // Save animations setting
  useEffect(() => {
    localStorage.setItem("animations", animations.toString());
    const root = document.documentElement;
    if (!animations) {
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
    }
  }, [animations]);

  const handleTextSizeChange = (value: number[]) => {
    setTextSize(value);
    toast.success(`Text size set to ${value[0]}%`);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    toast.success(`Volume set to ${value[0]}%`);
  };

  const handleHapticsChange = (checked: boolean) => {
    setHaptics(checked);
    if (checked && 'vibrate' in navigator) {
      navigator.vibrate(50); // Test vibration
    }
    toast.success(`Haptic feedback ${checked ? "enabled" : "disabled"}`);
  };

  const handleAnimationsChange = (checked: boolean) => {
    setAnimations(checked);
    toast.success(`Animations ${checked ? "enabled" : "disabled"}`);
  };

  const resetSettings = () => {
    setTextSize([100]);
    setVolume([80]);
    setHaptics(true);
    setAnimations(true);
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4 -ml-2">
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Settings
          </h1>
        </header>

        {/* User Profile */}
        <Card className="p-6 mb-4 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-3 text-foreground">User Profile</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">Emma</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Age:</span>
              <span className="text-sm font-medium">7 years old</span>
            </div>
          </div>
        </Card>

        {/* Interface Settings */}
        <Card className="p-6 mb-4 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Interface</h2>
          
          <div className="space-y-6">
            {/* Text Size */}
            <div>
              <Label htmlFor="text-size" className="text-sm font-medium mb-2 block">
                Text Size: {textSize[0]}%
              </Label>
              <Slider
                id="text-size"
                min={100}
                max={250}
                step={10}
                value={textSize}
                onValueChange={handleTextSizeChange}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Volume */}
            <div>
              <Label htmlFor="volume" className="text-sm font-medium mb-2 block">
                Audio Volume: {volume[0]}%
              </Label>
              <Slider
                id="volume"
                min={0}
                max={100}
                step={5}
                value={volume}
                onValueChange={handleVolumeChange}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Mute</span>
                <span>Loud</span>
              </div>
            </div>

            {/* Haptic Feedback */}
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="haptics" className="text-sm font-medium">
                Haptic Feedback
              </Label>
              <Switch
                id="haptics"
                checked={haptics}
                onCheckedChange={handleHapticsChange}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Animations */}
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="animations" className="text-sm font-medium">
                Animations
              </Label>
              <Switch
                id="animations"
                checked={animations}
                onCheckedChange={handleAnimationsChange}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </Card>

        {/* Input Methods */}
        <Card className="p-6 mb-4 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Input Methods</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <div className="text-sm font-medium">Touch Screen</div>
                <div className="text-xs text-muted-foreground">Direct touch input</div>
              </div>
              <span className="text-lg">✓</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <div className="text-sm font-medium">Voice Commands</div>
                <div className="text-xs text-muted-foreground">Speak to control</div>
              </div>
              <span className="text-lg text-muted-foreground">—</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">Eye Gaze</div>
                <div className="text-xs text-muted-foreground">Eye tracking</div>
              </div>
              <span className="text-lg text-muted-foreground">—</span>
            </div>
          </div>
        </Card>

        {/* Reset Button */}
        <Card className="p-6 rounded-xl border border-border">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2 text-foreground">Reset Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Reset all settings to defaults
            </p>
            <Button
              variant="outline"
              onClick={resetSettings}
              className="px-4"
            >
              Reset to Defaults
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
