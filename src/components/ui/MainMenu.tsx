import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "../../hooks/useGameState";

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("start");
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(false);

  // Get audio functionality from GameContext
  const { playAudio, musicVolume, sfxVolume, setMusicVolume, setSfxVolume } =
    useGameState();

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Animations and effects
  const [stars, setStars] = useState<
    Array<{ id: number; x: number; y: number; size: number; speed: number }>
  >([]);
  const [clouds, setClouds] = useState<
    Array<{ id: number; x: number; y: number; scale: number; speed: number }>
  >([]);

  // Play main theme when component mounts
  useEffect(() => {
    playAudio("mainTheme");

    // No need for cleanup as the GameContext will handle stopping audio when needed
  }, [playAudio]);

  // Generate stars and clouds
  useEffect(() => {
    // Create stars
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
    }));
    setStars(newStars);

    // Create clouds
    const newClouds = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: Math.random() * 120 - 10,
      y: Math.random() * 30 + 5,
      scale: Math.random() * 0.5 + 0.7,
      speed: Math.random() * 0.2 + 0.05,
    }));
    setClouds(newClouds);
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Sound effect for buttons
  const playButtonSound = () => {
    // Since we don't have a dedicated button sound in our audio hook,
    // we'll use the gem collection sound as a temporary button click sound
    playAudio("gemCollect");
  };

  // Main container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-indigo-950"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white pixelated rounded-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, star.size > 2 ? 1.3 : 1, 1],
            }}
            transition={{
              duration: 1 + star.speed * 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: star.id * 0.02,
            }}
          />
        ))}
      </div>

      {/* Moving cloud layers */}
      <div className="absolute inset-0 z-0 opacity-30">
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            className="absolute"
            style={{
              top: `${cloud.y}%`,
              left: `${cloud.x}%`,
              width: "180px",
              height: "80px",
              opacity: 0.6,
              backgroundImage: "url('/assets/sprites/pixel-cloud.svg')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              transform: `scale(${cloud.scale})`,
            }}
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              duration: 120 / cloud.speed,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Distant parallax mountains */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 z-1"
        style={{
          backgroundImage: "url('/assets/backgrounds/distant-mountains.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "repeat-x",
          imageRendering: "pixelated",
        }}
      />

      {/* Foreground terrain */}
      <div
        className="absolute bottom-0 left-0
         right-0 h-1/4 z-2"
        style={{
          backgroundImage: "url('/assets/backgrounds/foreground-terrain.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "repeat-x",
          imageRendering: "pixelated",
        }}
      />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-scanlines opacity-10"></div>

      {/* CRT vignette effect */}
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-3xl"
        style={{
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.9)",
        }}
      ></div>

      {/* Logo Section */}
      <div className="absolute top-0 left-0 right-0 h-1/3 flex justify-center items-center z-10">
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {/* Logo glow effect */}
          <motion.div
            className="absolute -inset-14 rounded-full"
            animate={{
              background: [
                "radial-gradient(circle, rgba(126,87,255,0.4) 0%, rgba(255,175,64,0.1) 50%, transparent 80%)",
                "radial-gradient(circle, rgba(126,87,255,0.2) 0%, rgba(255,175,64,0.05) 50%, transparent 80%)",
                "radial-gradient(circle, rgba(126,87,255,0.4) 0%, rgba(255,175,64,0.1) 50%, transparent 80%)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Logo image */}
          <motion.img
            src="/assets/sprites/retroquest-logo.svg"
            alt="RetroQuest"
            className="w-[400px] pixelated relative z-10"
            animate={{
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Logo subtitle */}
          <motion.div
            className="absolute -bottom-12 left-0 right-0 text-center pixel-text text-retro-yellow text-lg tracking-widest"
            animate={{
              textShadow: [
                "0 0 5px rgba(255,217,87,0.7)",
                "0 0 12px rgba(255,217,87,0.9)",
                "0 0 5px rgba(255,217,87,0.7)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            THE FINAL QUEST
          </motion.div>
        </motion.div>
      </div>

      {/* Character & enemy display */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Hero character */}
        <motion.div
          className="absolute bottom-24 right-[15%] w-44 h-44 z-10"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {/* Character sprite with animation frames */}
          <div className="w-full h-full sprite-hero-idle pixelated"></div>

          {/* Hero shadow */}
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/40 rounded-full blur-[2px]"
            animate={{
              width: ["5rem", "5.5rem", "5rem"],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Enemy character */}
        <motion.div
          className="absolute bottom-20 left-[12%] w-32 h-32 z-10"
          animate={{
            y: [0, -5, 0],
            x: [0, 5, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {/* Enemy sprite with animation frames */}
          <div className="w-full h-full sprite-enemy-float pixelated"></div>

          {/* Enemy shadow */}
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-14 h-3 bg-black/40 rounded-full blur-[2px]"
            animate={{
              width: ["3.5rem", "4rem", "3.5rem"],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>

      {/* Floating gems and power-ups */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 70 + 10}%`,
              backgroundImage: `url('/assets/sprites/${
                ["gem-red", "gem-blue", "gem-green", "powerup-star"][i % 4]
              }.svg')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 360],
              opacity: i % 3 === 0 ? [0.4, 0.7, 0.4] : [0.2, 0.5, 0.2],
              filter: [
                "drop-shadow(0 0 0px rgba(255,255,255,0))",
                "drop-shadow(0 0 3px rgba(255,255,255,0.7))",
                "drop-shadow(0 0 0px rgba(255,255,255,0))",
              ],
            }}
            transition={{
              duration: 2 + (i % 5),
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Menu UI Panel */}
      <AnimatePresence mode="wait">
        {!showCredits && !showSettings && !showControls ? (
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            <div className="relative menu-container">
              {/* Decorative frame with pixel art borders */}
              <div className="absolute inset-0 pixel-frame animate-pulse-subtle"></div>

              {/* Menu content */}
              <div className="relative bg-menu-dark/80 backdrop-blur-sm border-menu px-12 py-8 rounded-lg w-80">
                <motion.div
                  className="absolute -top-10 left-0 right-0 text-center pixel-text text-retro-cyan text-xl tracking-wider"
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(102,252,241,0.7)",
                      "0 0 12px rgba(102,252,241,0.9)",
                      "0 0 5px rgba(102,252,241,0.7)",
                    ],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  MAIN MENU
                </motion.div>

                <div className="space-y-4 py-2">
                  <PixelButton
                    label="START QUEST"
                    icon="sword"
                    color="retro-green"
                    isSelected={selectedOption === "start"}
                    onClick={() => {
                      setSelectedOption("start");
                      playButtonSound();
                      onStartGame();
                    }}
                  />

                  <PixelButton
                    label="CONTROLS"
                    icon="controller"
                    color="retro-blue"
                    isSelected={selectedOption === "controls"}
                    onClick={() => {
                      setSelectedOption("controls");
                      playButtonSound();
                      setShowControls(true);
                    }}
                  />

                  <PixelButton
                    label="SETTINGS"
                    icon="gear"
                    color="retro-purple"
                    isSelected={selectedOption === "settings"}
                    onClick={() => {
                      setSelectedOption("settings");
                      playButtonSound();
                      setShowSettings(true);
                    }}
                  />

                  <PixelButton
                    label="CREDITS"
                    icon="scroll"
                    color="retro-pink"
                    isSelected={selectedOption === "credits"}
                    onClick={() => {
                      setSelectedOption("credits");
                      playButtonSound();
                      setShowCredits(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ) : showCredits ? (
          <CreditsScreen
            onBack={() => {
              playButtonSound();
              setShowCredits(false);
            }}
          />
        ) : showControls ? (
          <ControlsScreen
            onBack={() => {
              playButtonSound();
              setShowControls(false);
            }}
          />
        ) : (
          <SettingsScreen
            musicVolume={musicVolume}
            sfxVolume={sfxVolume}
            isFullscreen={isFullscreen}
            onMusicVolumeChange={setMusicVolume}
            onSfxVolumeChange={setSfxVolume}
            onFullscreenToggle={toggleFullscreen}
            onBack={() => {
              playButtonSound();
              setShowSettings(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer info */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-between items-center px-6">
        <div className="pixel-text text-xs text-retro-teal/90">
          © 2025 RETROQUEST STUDIOS
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-1 pixel-text text-xs text-retro-pink"
            animate={{
              textShadow: [
                "0 0 0px rgba(255,155,210,0)",
                "0 0 4px rgba(255,155,210,0.7)",
                "0 0 0px rgba(255,155,210,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="w-3 h-3 bg-retro-pink rounded-none pixelated"></div>
            PRESS SPACE TO START
          </motion.div>

          <div className="pixel-text text-xs text-retro-yellow/90">v1.5.0</div>
        </div>
      </div>
    </motion.div>
  );
};

// Pixel art styled button component
interface PixelButtonProps {
  label: string;
  icon: string;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

const PixelButton = ({
  label,
  icon,
  color,
  isSelected,
  onClick,
}: PixelButtonProps) => {
  return (
    <motion.button
      className={`relative w-full flex items-center overflow-hidden border-2 pixel-button ${
        isSelected
          ? `bg-${color} border-${color}-light active-${color}`
          : "bg-retro-dark border-gray-700 hover-effect"
      } px-4 py-3 rounded-none`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon background */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-${
          isSelected ? color : "retro-dark"
        }-accent`}
      >
        <div
          className="w-6 h-6 pixelated"
          style={{
            backgroundImage: `url('/assets/icons/${icon}.svg')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Button label */}
      <span className="ml-10 pixel-text text-lg tracking-wider">{label}</span>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute right-3 w-4 h-4 pixelated"
          style={{
            backgroundImage: "url('/assets/icons/selector.svg')",
            backgroundSize: "contain",
          }}
          animate={{ x: [-2, 2, -2] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}

      {/* Button press flash effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

// Credits screen component
interface CreditsScreenProps {
  onBack: () => void;
}

const CreditsScreen = ({ onBack }: CreditsScreenProps) => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="relative menu-container">
        <div className="absolute inset-0 pixel-frame credits-frame"></div>

        <div className="relative bg-menu-dark/80 backdrop-blur-sm border-menu px-10 py-8 rounded-lg w-[400px]">
          <motion.div
            className="absolute -top-10 left-0 right-0 text-center pixel-text text-retro-pink text-xl"
            animate={{
              textShadow: [
                "0 0 5px rgba(255,124,210,0.7)",
                "0 0 12px rgba(255,124,210,0.9)",
                "0 0 5px rgba(255,124,210,0.7)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            CREDITS
          </motion.div>

          <div className="space-y-6 py-2">
            <CreditsSection
              title="GAME DESIGN"
              color="retro-yellow"
              names={["RetroQuest Team", "Pixel Art Legends"]}
            />

            <CreditsSection
              title="DEVELOPMENT"
              color="retro-green"
              names={[
                "Lead: Sarah Johnson",
                "UI: Mike Chen",
                "Engine: Alex Rodriguez",
              ]}
            />

            <CreditsSection
              title="ARTWORK"
              color="retro-blue"
              names={[
                "Sprites: Pixel Art Studios",
                "Backgrounds: Digital Dreamscapes",
                "Animation: RetroMotion",
              ]}
            />

            <CreditsSection
              title="MUSIC & SFX"
              color="retro-purple"
              names={["Composer: 8-Bit Symphony", "Sound Design: Arcade Audio"]}
            />

            <CreditsSection
              title="SPECIAL THANKS"
              color="retro-teal"
              names={["All Our Amazing Fans!", "Pixel Art Community"]}
            />
          </div>

          <motion.button
            className="mt-6 mx-auto block bg-retro-pink hover:bg-retro-pink-light text-white pixel-text py-2 px-8 pixel-button border-2 border-retro-pink-light"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            BACK
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Credits section component
interface CreditsSectionProps {
  title: string;
  color: string;
  names: string[];
}

const CreditsSection = ({ title, color, names }: CreditsSectionProps) => {
  return (
    <div className="text-center">
      <h3 className={`text-${color} pixel-text text-lg mb-1`}>{title}</h3>
      <div className="border-b-2 border-dotted border-gray-600 mb-2"></div>
      {names.map((name: string, index: number) => (
        <p key={index} className="text-white pixel-text text-sm mb-1">
          {name}
        </p>
      ))}
    </div>
  );
};

// Controls screen component
interface ControlsScreenProps {
  onBack: () => void;
}

const ControlsScreen = ({ onBack }: ControlsScreenProps) => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="relative menu-container">
        <div className="absolute inset-0 pixel-frame controls-frame"></div>

        <div className="relative bg-menu-dark/80 backdrop-blur-sm border-menu px-10 py-8 rounded-lg w-[400px]">
          <motion.div
            className="absolute -top-10 left-0 right-0 text-center pixel-text text-retro-blue text-xl"
            animate={{
              textShadow: [
                "0 0 5px rgba(87,202,255,0.7)",
                "0 0 12px rgba(87,202,255,0.9)",
                "0 0 5px rgba(87,202,255,0.7)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            CONTROLS
          </motion.div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <ControlItem keyLabel="←→" action="Move" icon="arrow-keys" />
            <ControlItem keyLabel="SPACE" action="Jump" icon="jump" />
            <ControlItem keyLabel="Z" action="Attack" icon="sword" />
            <ControlItem keyLabel="X" action="Special" icon="magic" />
            <ControlItem keyLabel="E" action="Interact" icon="hand" />
            <ControlItem keyLabel="Q" action="Use Item" icon="potion" />
            <ControlItem keyLabel="TAB" action="Inventory" icon="backpack" />
            <ControlItem keyLabel="ESC" action="Pause" icon="pause" />
          </div>

          <div className="mt-2 px-4 py-3 bg-retro-black/50 border border-retro-blue/30 rounded">
            <p className="pixel-text text-xs text-center text-retro-blue-light">
              Customize controls in the OPTIONS menu during gameplay
            </p>
          </div>

          <motion.button
            className="mt-6 mx-auto block bg-retro-blue hover:bg-retro-blue-light text-white pixel-text py-2 px-8 pixel-button border-2 border-retro-blue-light"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            BACK
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Control item component
interface ControlItemProps {
  keyLabel: string;
  action: string;
  icon: string;
}

const ControlItem = ({ keyLabel, action, icon }: ControlItemProps) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 flex items-center justify-center bg-retro-black border border-retro-blue/50 pixel-borders">
        <span className="pixel-text text-xs text-white">{keyLabel}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div
          className="w-5 h-5 pixelated"
          style={{
            backgroundImage: `url('/assets/icons/${icon}.svg')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <span className="pixel-text text-sm text-white">{action}</span>
      </div>
    </div>
  );
};

// Settings screen component
interface SettingsScreenProps {
  musicVolume: number;
  sfxVolume: number;
  isFullscreen: boolean;
  onMusicVolumeChange: (value: number) => void;
  onSfxVolumeChange: (value: number) => void;
  onFullscreenToggle: () => void;
  onBack: () => void;
}

const SettingsScreen = ({
  musicVolume,
  sfxVolume,
  isFullscreen,
  onMusicVolumeChange,
  onSfxVolumeChange,
  onFullscreenToggle,
  onBack,
}: SettingsScreenProps) => {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="relative menu-container">
        <div className="absolute inset-0 pixel-frame settings-frame"></div>

        <div className="relative bg-menu-dark/80 backdrop-blur-sm border-menu px-10 py-8 rounded-lg w-[400px]">
          <motion.div
            className="absolute -top-10 left-0 right-0 text-center pixel-text text-retro-purple text-xl"
            animate={{
              textShadow: [
                "0 0 5px rgba(172,102,255,0.7)",
                "0 0 12px rgba(172,102,255,0.9)",
                "0 0 5px rgba(172,102,255,0.7)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            SETTINGS
          </motion.div>

          <div className="space-y-6 py-4">
            <SettingSlider
              label="MUSIC"
              value={musicVolume}
              icon="music-note"
              color="retro-purple"
              onChange={onMusicVolumeChange}
            />

            <SettingSlider
              label="SOUND FX"
              value={sfxVolume}
              icon="sound-waves"
              color="retro-purple"
              onChange={onSfxVolumeChange}
            />

            <div className="flex justify-between items-center px-1">
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 pixelated"
                  style={{
                    backgroundImage: "url('/assets/icons/fullscreen.svg')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <span className="pixel-text text-sm text-retro-yellow">
                  FULLSCREEN
                </span>
              </div>

              <div
                className={`w-12 h-6 ${
                  isFullscreen ? "bg-retro-purple" : "bg-retro-black"
                } border border-gray-600 rounded-none relative cursor-pointer`}
                onClick={onFullscreenToggle}
              >
                <motion.div
                  className="absolute w-5 h-5 top-[2px] bg-white rounded-none"
                  animate={{
                    x: isFullscreen ? [null, 5] : [null, 1],
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center px-1 mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 pixelated"
                    style={{
                      backgroundImage: "url('/assets/icons/screen-shake.svg')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <span className="pixel-text text-sm text-retro-yellow">
                    SCREEN SHAKE
                  </span>
                </div>

                <div className="flex space-x-1">
                  {["OFF", "LOW", "HIGH"].map((level, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 text-xs pixel-text cursor-pointer ${
                        i === 1
                          ? "bg-retro-purple text-white"
                          : "bg-retro-black/50 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center px-1">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 pixelated"
                    style={{
                      backgroundImage: "url('/assets/icons/difficulty.svg')",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <span className="pixel-text text-sm text-retro-yellow">
                    DIFFICULTY
                  </span>
                </div>

                <div className="flex space-x-1">
                  {["EASY", "NORMAL", "HARD"].map((level, i) => (
                    <div
                      key={i}
                      className={`px-2 py-1 text-xs pixel-text cursor-pointer ${
                        i === 1
                          ? "bg-retro-purple text-white"
                          : "bg-retro-black/50 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            className="mt-6 mx-auto block bg-retro-purple hover:bg-retro-purple-light text-white pixel-text py-2 px-8 pixel-button border-2 border-retro-purple-light"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            APPLY & BACK
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Setting slider component
interface SettingSliderProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  onChange: (value: number) => void;
}

const SettingSlider = ({
  label,
  value,
  icon,
  color,
  onChange,
}: SettingSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3 px-1">
        <div
          className="w-5 h-5 pixelated"
          style={{
            backgroundImage: `url('/assets/icons/${icon}.svg')`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        />
        <span className="pixel-text text-sm text-retro-yellow">{label}</span>
        <span className="pixel-text text-xs text-white ml-auto">{value}%</span>
      </div>

      <div className="relative h-5 bg-retro-black/70 border border-gray-700 rounded-none overflow-hidden">
        <motion.div
          className={`h-full bg-${color}`}
          style={{ width: `${value}%` }}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: "tween", duration: 0.3 }}
        />

        {/* Slider notches */}
        <div className="absolute inset-0 flex items-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-full w-[1px] bg-gray-800"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>

        {/* Slider handle */}
        <motion.div
          className="absolute top-0 bottom-0 w-2 bg-white border-r-2 border-l-2 border-gray-300 cursor-pointer"
          style={{ left: `calc(${value}% - 4px)` }}
          initial={false}
          animate={{ left: `calc(${value}% - 4px)` }}
          transition={{ type: "tween", duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(_, info: any) => {
            const parentWidth =
              info.target.parentElement.getBoundingClientRect().width;
            const newValue = Math.max(
              0,
              Math.min(100, (info.point.x / parentWidth) * 100)
            );
            onChange(Math.round(newValue));
          }}
        />
      </div>
    </div>
  );
};

export default MainMenu;
