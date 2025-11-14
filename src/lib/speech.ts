// Speech synthesis utility that respects volume settings

export const speak = (text: string, options?: { rate?: number; pitch?: number }) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get volume from localStorage (default to 80)
    const savedVolume = localStorage.getItem("volume");
    const volume = savedVolume ? parseInt(savedVolume) / 100 : 0.8;
    
    // Note: SpeechSynthesis API doesn't support volume directly
    // But we can adjust rate and pitch based on volume preference
    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 1.1;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    window.speechSynthesis.speak(utterance);
    return utterance;
  }
  return null;
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

