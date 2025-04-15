import { useEffect, useRef, useState } from "react";

type AudioType = "gameBackground" | "gameOver" | "gemCollect" | "mainTheme";

interface AudioMap {
  gameBackground: HTMLAudioElement;
  gameOver: HTMLAudioElement;
  gemCollect: HTMLAudioElement;
  mainTheme: HTMLAudioElement;
}

export const useAudio = () => {
  const [musicVolume, setMusicVolume] = useState<number>(75);
  const [sfxVolume, setSfxVolume] = useState<number>(50);
  const audioRefs = useRef<AudioMap | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio tracks
  useEffect(() => {
    // Only initialize once
    if (isInitialized) return;

    audioRefs.current = {
      gameBackground: new Audio("/assets/audio/game-bg.mp3"),
      gameOver: new Audio("/assets/audio/game-over.mp3"),
      gemCollect: new Audio("/assets/audio/gems.mp3"),
      mainTheme: new Audio("/assets/audio/main-theme.mp3"),
    };

    // Configure audio properties
    Object.values(audioRefs.current).forEach((audio) => {
      audio.preload = "auto";
    });

    // Set music tracks to loop
    audioRefs.current.mainTheme.loop = true;
    audioRefs.current.gameBackground.loop = true;

    // Load audio
    const loadPromises = Object.values(audioRefs.current).map((audio) => {
      return new Promise((resolve, reject) => {
        audio.addEventListener("canplaythrough", resolve, { once: true });
        audio.addEventListener("error", reject);
        audio.load();
      });
    });

    Promise.all(loadPromises)
      .then(() => setIsInitialized(true))
      .catch((err) => console.error("Error loading audio:", err));

    // Cleanup function
    return () => {
      if (audioRefs.current) {
        Object.values(audioRefs.current).forEach((audio) => {
          audio.pause();
          audio.currentTime = 0;
        });
      }
    };
  }, [isInitialized]);

  // Update volumes when they change
  useEffect(() => {
    if (!audioRefs.current) return;

    const musicTracks = [
      audioRefs.current.mainTheme,
      audioRefs.current.gameBackground,
    ];

    const sfxTracks = [
      audioRefs.current.gemCollect,
      audioRefs.current.gameOver,
    ];

    // Update music volume
    musicTracks.forEach((track) => {
      track.volume = musicVolume / 100;
    });

    // Update sfx volume
    sfxTracks.forEach((track) => {
      track.volume = sfxVolume / 100;
    });
  }, [musicVolume, sfxVolume]);

  // Play audio function
  const playAudio = (type: AudioType) => {
    if (!audioRefs.current) return;

    const audio = audioRefs.current[type];

    // For one-shot sound effects, reset to beginning before playing
    if (type === "gemCollect" || type === "gameOver") {
      audio.currentTime = 0;
    }

    // Stop other background music if playing a new background track
    if (type === "mainTheme") {
      audioRefs.current.gameBackground.pause();
    } else if (type === "gameBackground") {
      audioRefs.current.mainTheme.pause();
    }

    audio.play().catch((err) => console.error(`Error playing ${type}:`, err));
  };

  // Stop audio function
  const stopAudio = (type: AudioType) => {
    if (!audioRefs.current) return;
    audioRefs.current[type].pause();
    audioRefs.current[type].currentTime = 0;
  };

  // Pause audio without resetting
  const pauseAudio = (type: AudioType) => {
    if (!audioRefs.current) return;
    audioRefs.current[type].pause();
  };

  // Stop all audio
  const stopAllAudio = () => {
    if (!audioRefs.current) return;
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  return {
    playAudio,
    stopAudio,
    pauseAudio,
    stopAllAudio,
    isInitialized,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  };
};
