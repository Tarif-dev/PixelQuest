// GameOver.tsx
import React, { useEffect, useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

const GameOver: React.FC = () => {
  const gameState = useGameState();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [statEffect, setStatEffect] = useState({
    gems: 0,
    enemies: 0,
    time: 0,
  });

  // Handle game over state changes
  useEffect(() => {
    if (gameState.gameStatus === "gameOver") {
      setVisible(true);
      setFinalScore(gameState.score);
      setAnimationComplete(false);
      setAnimationPhase(0);

      // Play game over music
      gameState.playAudio("gameOver");

      // Check for high score
      const storedHighScore = localStorage.getItem("retroquest_highscore")
        ? parseInt(localStorage.getItem("retroquest_highscore") || "0")
        : 0;

      setHighScore(storedHighScore);

      if (gameState.score > storedHighScore) {
        localStorage.setItem(
          "retroquest_highscore",
          gameState.score.toString()
        );
        setHighScore(gameState.score);
        setIsNewHighScore(true);
      }

      // Animate score counting up
      let currentScore = 0;
      const interval = setInterval(() => {
        if (currentScore >= gameState.score) {
          clearInterval(interval);
          setAnimationComplete(true);

          // Start the additional animations
          setTimeout(() => setAnimationPhase(1), 400);
          setTimeout(() => setAnimationPhase(2), 800);
          setTimeout(() => setAnimationPhase(3), 1200);

          return;
        }

        const increment = Math.max(1, Math.floor(gameState.score / 30));
        currentScore = Math.min(gameState.score, currentScore + increment);
        setScoreAnimation(currentScore);
      }, 50);

      // Set some mock stats for the game session
      setStatEffect({
        gems: Math.floor(gameState.score / 50), // Rough estimate of gems collected
        enemies: Math.floor(gameState.score / 120), // Rough estimate of enemies defeated
        time: Math.floor(60 + gameState.score / 20), // Rough estimate of time played in seconds
      });

      return () => clearInterval(interval);
    } else {
      setVisible(false);
      setAnimationPhase(0);
    }
  }, [gameState.gameStatus, gameState.score, gameState.playAudio]);

  if (!visible) return null;

  const handleRestart = () => {
    // Play button sound
    gameState.playAudio("gemCollect");

    // Reset game state and restart
    gameState.initGame();
    gameState.startGame();
  };

  const handleMainMenu = () => {
    // Play button sound
    gameState.playAudio("gemCollect");

    // Reset game state
    gameState.setGameStatus("menu");
    // Navigate to main menu
    router.push("/");
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <motion.div
      className="game-over-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        backgroundColor: "rgba(10, 10, 25, 0.8)",
        perspective: "1000px",
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated falling pixels */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              backgroundColor: i % 2 === 0 ? "#FF4444" : "#880000",
              opacity: 0.7,
            }}
            animate={{
              y: ["0vh", "100vh"],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear",
            }}
          />
        ))}

        {/* Radial glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,0,0,0.2) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Grid lines effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(#FF4444 0.5px, transparent 0.5px), linear-gradient(90deg, #FF4444 0.5px, transparent 0.5px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main content card */}
      <motion.div
        className="game-over-content relative"
        initial={{ rotateX: 90, scale: 0.8 }}
        animate={{ rotateX: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
        style={{
          backgroundColor: "rgba(20, 20, 40, 0.9)",
          padding: "2.5rem",
          borderRadius: "8px",
          border: "4px solid #FF4444",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          maxWidth: "450px",
          width: "90%",
          boxShadow:
            "0 0 30px rgba(255, 0, 0, 0.5), 0 0 60px rgba(255, 0, 0, 0.3)",
          overflow: "hidden",
          transform: "perspective(1000px)",
        }}
      >
        {/* 3D Card - Top highlight */}
        <div className="absolute left-0 right-0 h-[2px] top-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

        {/* Game Over Title with glowing effect */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="game-over-title relative z-10 text-center"
          style={{
            fontSize: "3rem",
            color: "#FF4444",
            textShadow:
              "3px 3px 0 #000, 0 0 10px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.4)",
            margin: 0,
            letterSpacing: "4px",
            position: "relative",
          }}
        >
          GAME OVER
          {/* Animated glitch effect */}
          <motion.div
            className="absolute inset-0 text-center"
            style={{
              color: "#ff99a8",
              clipPath: "inset(0 0 0 0)",
              filter: "blur(1px)",
            }}
            animate={{
              x: ["-2px", "2px", "-2px"],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            GAME OVER
          </motion.div>
        </motion.h1>

        {/* Score Section with enhanced visuals */}
        <motion.div
          className="score-container relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: "0.5rem",
            width: "100%",
            padding: "1rem",
            backgroundColor: "rgba(15, 15, 30, 0.7)",
            borderRadius: "8px",
            border: "2px solid rgba(255, 68, 68, 0.5)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            animate={{
              opacity: [0, 0.1, 0],
              left: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />

          <div className="score-label text-white text-sm opacity-80 mb-2 uppercase tracking-wider">
            Your Score
          </div>

          <motion.div
            className="score-value"
            style={{
              fontSize: "2.5rem",
              color: "#FFDD00",
              textShadow: "2px 2px 0 #000, 0 0 10px rgba(255, 221, 0, 0.6)",
              marginBottom: "0.5rem",
              fontWeight: "bold",
            }}
            animate={
              animationComplete
                ? {
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "2px 2px 0 #000, 0 0 10px rgba(255, 221, 0, 0.6)",
                      "2px 2px 0 #000, 0 0 20px rgba(255, 221, 0, 0.9)",
                      "2px 2px 0 #000, 0 0 10px rgba(255, 221, 0, 0.6)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {scoreAnimation}
          </motion.div>

          <AnimatePresence>
            {isNewHighScore && animationComplete && (
              <motion.div
                className="new-highscore"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
                style={{
                  color: "#00FFAA",
                  fontSize: "1.1rem",
                  marginTop: "0.5rem",
                  textShadow: "2px 2px 0 #000, 0 0 10px rgba(0, 255, 170, 0.7)",
                  letterSpacing: "1px",
                  position: "relative",
                }}
              >
                NEW HIGH SCORE!
                {/* Sparkle effects around new high score */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${25 * i}%`,
                      top: i % 2 === 0 ? "-15px" : "30px",
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isNewHighScore && (
            <motion.div
              className="highscore text-white/60 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              HIGH SCORE: {highScore}
            </motion.div>
          )}
        </motion.div>

        {/* Game Stats Section - appears after score animation */}
        <motion.div
          className="stats-container w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationPhase >= 1 ? 1 : 0,
            y: animationPhase >= 1 ? 0 : 20,
          }}
          transition={{ duration: 0.4 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {/* Level */}
          <motion.div
            className="stat-card"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              padding: "1rem",
              backgroundColor: "rgba(15, 15, 30, 0.6)",
              borderRadius: "6px",
              border: "2px solid rgba(102, 72, 255, 0.4)",
              textAlign: "center",
              boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="stat-label text-white/60 text-xs mb-1">LEVEL</div>
            <div className="stat-value text-[#6648FF] text-xl">
              {gameState.level}
            </div>
          </motion.div>

          {/* Gems Collected */}
          <motion.div
            className="stat-card"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              padding: "1rem",
              backgroundColor: "rgba(15, 15, 30, 0.6)",
              borderRadius: "6px",
              border: "2px solid rgba(0, 221, 255, 0.4)",
              textAlign: "center",
              boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="stat-label text-white/60 text-xs mb-1">GEMS</div>
            <div className="stat-value text-[#00DDFF] text-xl">
              {statEffect.gems}
            </div>
          </motion.div>

          {/* Time Played */}
          <motion.div
            className="stat-card"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.0 }}
            style={{
              padding: "1rem",
              backgroundColor: "rgba(15, 15, 30, 0.6)",
              borderRadius: "6px",
              border: "2px solid rgba(255, 138, 43, 0.4)",
              textAlign: "center",
              boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="stat-label text-white/60 text-xs mb-1">TIME</div>
            <div className="stat-value text-[#FF8A2B] text-xl">
              {formatTime(statEffect.time)}
            </div>
          </motion.div>

          {/* Enemies Defeated */}
          <motion.div
            className="stat-card"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.1 }}
            style={{
              padding: "1rem",
              backgroundColor: "rgba(15, 15, 30, 0.6)",
              borderRadius: "6px",
              border: "2px solid rgba(0, 255, 170, 0.4)",
              textAlign: "center",
              boxShadow: "0 4px 0 rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="stat-label text-white/60 text-xs mb-1">ENEMIES</div>
            <div className="stat-value text-[#00FFAA] text-xl">
              {statEffect.enemies}
            </div>
          </motion.div>
        </motion.div>

        {/* Buttons Container with enhanced styling */}
        <motion.div
          className="buttons-container w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationPhase >= 2 ? 1 : 0,
            y: animationPhase >= 2 ? 0 : 20,
          }}
          transition={{ duration: 0.4 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          <motion.button
            onClick={handleRestart}
            className="game-button"
            whileHover={{
              y: -2,
              boxShadow: "0 6px 0 #4428DD",
              filter: "brightness(1.1)",
            }}
            whileTap={{
              y: 4,
              boxShadow: "0 0 0 #4428DD",
              filter: "brightness(0.9)",
            }}
            style={{
              padding: "1rem",
              fontSize: "1rem",
              backgroundColor: "#6648FF",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: '"Press Start 2P", monospace',
              boxShadow: "0 4px 0 #4428DD",
              transition: "all 0.1s",
              position: "relative",
              overflow: "hidden",
              textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
            }}
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0"
              animate={{
                opacity: [0, 0.3, 0],
                left: ["-100%", "100%"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />

            <div className="flex items-center justify-center gap-2">
              <span className="relative z-10">TRY AGAIN</span>
              <motion.div
                animate={{ rotate: [0, -10, 0, 10, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="w-5 h-5 relative z-10"
                style={{
                  backgroundImage: "url('/assets/icons/controller.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </motion.button>

          <motion.button
            onClick={handleMainMenu}
            className="game-button"
            whileHover={{
              y: -2,
              boxShadow: "0 6px 0 #222",
              filter: "brightness(1.1)",
            }}
            whileTap={{
              y: 4,
              boxShadow: "0 0 0 #222",
              filter: "brightness(0.9)",
            }}
            style={{
              padding: "1rem",
              fontSize: "1rem",
              backgroundColor: "#444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: '"Press Start 2P", monospace',
              boxShadow: "0 4px 0 #222",
              transition: "all 0.1s",
              position: "relative",
              overflow: "hidden",
              textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="relative z-10">MAIN MENU</span>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
                className="w-5 h-5 relative z-10"
                style={{
                  backgroundImage: "url('/assets/icons/selector.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </motion.button>
        </motion.div>

        {/* Optional Tip / Hint */}
        <motion.div
          className="game-tip text-center mt-2 text-white/50 text-xs"
          initial={{ opacity: 0 }}
          animate={{
            opacity: animationPhase >= 3 ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          style={{
            maxWidth: "90%",
            lineHeight: "1.4",
          }}
        >
          TIP: Try collecting more gems and defeating enemies to increase your
          score!
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameOver;
