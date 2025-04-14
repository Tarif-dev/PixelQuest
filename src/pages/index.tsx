import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Dynamic scene elements
  const [floatingGems, setFloatingGems] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      type: string;
      scale: number;
      delay: number;
    }>
  >([]);

  // Load assets and initialize elements
  useEffect(() => {
    // Create floating gem elements with strategic positioning
    const gems = [
      { x: 15, y: 20, type: "gem-blue", scale: 0.8, delay: 0 },
      { x: 85, y: 25, type: "gem-red", scale: 0.7, delay: 1.2 },
      { x: 80, y: 75, type: "gem-green", scale: 0.9, delay: 0.5 },
      { x: 20, y: 70, type: "gem-blue", scale: 0.6, delay: 0.8 },
      { x: 50, y: 10, type: "powerup-star", scale: 1, delay: 0.3 },
      { x: 90, y: 50, type: "powerup-shield", scale: 0.7, delay: 1.5 },
      { x: 10, y: 45, type: "powerup-speed", scale: 0.8, delay: 1 },
    ].map((gem, i) => ({ ...gem, id: i }));

    setFloatingGems(gems);

    // Preload assets
    const preloadImages = [
      "/assets/sprites/retroquest-logo.svg",
      "/assets/sprites/player-idle-left.svg",
      "/assets/sprites/player-idle-right.svg",
      "/assets/sprites/player-run-right.svg",
      "/assets/sprites/player-jump-right.svg",
      "/assets/sprites/platform_regular.svg",
      "/assets/sprites/gem-blue.svg",
      "/assets/sprites/gem-green.svg",
      "/assets/sprites/gem-red.svg",
      "/assets/sprites/powerup-star.svg",
      "/assets/icons/jump.svg",
      "/assets/icons/controller.svg",
    ];

    let loaded = 0;
    preloadImages.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        setLoadingProgress(Math.floor((loaded / preloadImages.length) * 100));
        if (loaded === preloadImages.length) {
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setIsReady(true), 500);
          }, 800);
        }
      };
      img.src = src;
    });
  }, []);

  return (
    <>
      <Head>
        <title>RetroQuest: Pixel Adventure</title>
        <meta
          name="description"
          content="An award-winning retro-style platform game with stunning pixel art and modern web techniques"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main background with dramatic gradient */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at center, #5d3fe8 0%, #2a1b69 30%, #161033 70%, #0c0920 100%)",
          overflow: "hidden",
        }}
      >
        {/* Floating gems in background */}
        {floatingGems.map((gem) => (
          <motion.div
            key={gem.id}
            className="absolute"
            style={{
              left: `${gem.x}%`,
              top: `${gem.y}%`,
              width: `${gem.scale * 40}px`,
              height: `${gem.scale * 40}px`,
              backgroundImage: `url(/assets/sprites/${gem.type}.svg)`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
              filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [gem.scale, gem.scale * 1.2, gem.scale],
              rotate: [0, 360],
              y: [`${gem.y}%`, `${gem.y - 5}%`, `${gem.y}%`],
            }}
            transition={{
              opacity: { duration: 4, repeat: Infinity, delay: gem.delay },
              scale: { duration: 8, repeat: Infinity, delay: gem.delay },
              rotate: {
                duration: 12,
                repeat: Infinity,
                ease: "linear",
                delay: gem.delay,
              },
              y: {
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: gem.delay,
              },
            }}
          />
        ))}

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')",
          }}
        ></div>

        {/* Grid lines for depth */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ y: [0, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(#5d3fe8 0.5px, transparent 0.5px), linear-gradient(90deg, #5d3fe8 0.5px, transparent 0.5px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Scan line effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)",
            backgroundSize: "100% 4px",
          }}
        ></div>
      </div>

      <main className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen progress={loadingProgress} key="loading" />
          ) : (
            <GameIntro isReady={isReady} key="intro" />
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

// Reimagined loading screen with pixel art animation
const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated pixel character jumping on loading bar */}
      <div className="relative w-64 mb-16">
        <motion.div
          className="absolute w-10 h-14"
          style={{
            backgroundImage: "url('/assets/sprites/player-jump-right.svg')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            left: `${progress}%`,
            bottom: "20px",
            filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))",
          }}
          animate={{
            y: [-20, -40, -20],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-md border border-white/20 relative">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #ff8a2b, #5d3fe8)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />

          {/* Loading bar shine effect */}
          <motion.div
            className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ left: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
          />
        </div>

        {/* Loading percentage */}
        <motion.p
          className="absolute -bottom-8 font-pixel text-sm text-white/70 left-1/2 transform -translate-x-1/2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {progress}%
        </motion.p>
      </div>

      {/* Animated logo */}
      <motion.div
        className="w-64 h-52 mb-6"
        style={{
          backgroundImage: "url('/assets/sprites/retroquest-logo.svg')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          filter: [
            "drop-shadow(0 0 8px rgba(93,63,232,0.5))",
            "drop-shadow(0 0 20px rgba(93,63,232,0.8))",
            "drop-shadow(0 0 8px rgba(93,63,232,0.5))",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.p
        className="font-pixel text-lg text-primary tracking-wider"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading Adventure...
      </motion.p>
    </motion.div>
  );
};

// Completely reimagined game intro screen
const GameIntro = ({ isReady }: { isReady: boolean }) => {
  const [activeSection, setActiveSection] = useState(0);
  const sections = ["home", "characters", "worlds"];

  return (
    <div className="w-full h-full max-w-7xl mx-auto relative flex flex-col items-center justify-center">
      {/* Perspective container for 3D effect */}
      <motion.div
        className="w-full h-full relative"
        style={{ perspective: "1000px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated game logo */}
        <motion.div
          className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="w-60 h-60 mx-auto"
            style={{
              backgroundImage: "url('/assets/sprites/retroquest-logo.svg')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 25px rgba(93,63,232,0.7))",
            }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 1, 0, -1, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.h2
            className="text-2xl font-pixel text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            PIXEL ADVENTURE
          </motion.h2>
        </motion.div>

        {/* Main content area with 3D card */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            className="w-[90%] max-w-4xl h-[60vh] relative"
            style={{
              transformStyle: "preserve-3d",
              transform: "rotateX(5deg)",
            }}
            animate={{
              rotateX: [5, 8, 5],
              rotateY: [-2, 2, -2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* 3D Card - Main face */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a2896]/90 to-[#190e47]/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary/30">
              {/* Interactive navigation tabs */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
                {sections.map((section, index) => (
                  <motion.button
                    key={section}
                    className={`px-6 py-2 rounded-full font-pixel text-sm uppercase ${
                      activeSection === index
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-black/30 text-white/60 border border-white/10"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveSection(index)}
                  >
                    {section}
                  </motion.button>
                ))}
              </div>

              {/* Dynamic content based on active section */}
              <AnimatePresence mode="wait">
                {activeSection === 0 && <HomeSection key="home" />}
                {activeSection === 1 && <CharactersSection key="characters" />}
                {activeSection === 2 && <WorldsSection key="worlds" />}
              </AnimatePresence>
            </div>

            {/* 3D Card - Bottom edge with light effect */}
            <div className="absolute left-0 right-0 h-4 bottom-0 transform -translate-y-full translate-z-[-10px] rotateX(90deg) bg-primary/30 blur-sm"></div>

            {/* 3D Card - Top highlight */}
            <div className="absolute left-0 right-0 h-[2px] top-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

            {/* Floating gem decorations around card */}
            <motion.div
              className="absolute -top-10 -right-10 w-16 h-16"
              style={{
                backgroundImage: "url('/assets/sprites/gem-blue.svg')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              animate={{
                y: [-5, 5, -5],
                rotate: [0, 360],
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              }}
            />

            <motion.div
              className="absolute -bottom-8 -left-8 w-14 h-14"
              style={{
                backgroundImage: "url('/assets/sprites/gem-red.svg')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              animate={{
                y: [0, 8, 0],
                rotate: [0, -360],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, repeatType: "reverse" },
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
              }}
            />
          </motion.div>
        </motion.div>

        {/* Start game button (always visible) */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: isReady ? 1 : 0,
            y: isReady ? 0 : 50,
          }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Link href="/game">
            <StartButton />
          </Link>
        </motion.div>

        {/* Game controls display */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center space-x-6 bg-black/30 backdrop-blur-md py-2 px-6 rounded-full border border-white/10">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6"
                style={{
                  backgroundImage: "url('/assets/icons/arrow-keys.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <span className="text-white/70 text-xs font-pixel">MOVE</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6"
                style={{
                  backgroundImage: "url('/assets/icons/jump.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <span className="text-white/70 text-xs font-pixel">JUMP</span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div
                className="w-6 h-6"
                style={{
                  backgroundImage: "url('/assets/icons/controller.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <span className="text-white/70 text-xs font-pixel">INTERACT</span>
            </div>
          </div>
        </motion.div>

        {/* Game version */}
        <div className="absolute bottom-2 right-4 font-pixel text-xs text-white/40">
          v1.5.0
        </div>

        {/* Copyright */}
        <div className="absolute bottom-2 left-4 font-pixel text-xs text-white/40">
          © 2025 RetroQuest Studios
        </div>
      </motion.div>
    </div>
  );
};

// Home section content
const HomeSection = () => {
  return (
    <motion.div
      className="absolute inset-0 pt-16 px-8 pb-8 flex md:flex-row flex-col items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Featured character with platform */}
      <div className="relative w-72 h-72 flex-shrink-0">
        {/* Platform with shadow */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-20"
          style={{
            backgroundImage: "url('/assets/sprites/platform_regular.svg')",
            backgroundSize: "contain",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.2))",
          }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Character with animation */}
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-48"
          style={{
            backgroundImage: "url('/assets/sprites/player-idle-right.svg')",
            backgroundSize: "contain",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.3))",
          }}
          animate={{
            y: [-4, 4, -4],
            scale: [1, 1.03, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating powerups */}
        <motion.div
          className="absolute top-10 right-10 w-12 h-12"
          style={{
            backgroundImage: "url('/assets/sprites/powerup-star.svg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          animate={{
            y: [-5, 5, -5],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity },
            rotate: { duration: 6, repeat: Infinity },
          }}
        />
      </div>

      {/* Game information */}
      <div className="flex-1 max-w-md">
        <motion.h3
          className="font-pixel text-xl text-secondary mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Epic Pixel Adventure
        </motion.h3>

        <motion.p
          className="text-white/90 mb-6 leading-relaxed"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Embark on a breathtaking journey through pixelated worlds filled with
          challenges, mysteries, and treasures. Jump, run, and discover the
          magic of RetroQuest!
        </motion.p>

        {/* Feature highlights */}
        <div className="space-y-3">
          {[
            {
              icon: "gem-blue",
              text: "Collect rare gems across 8 unique worlds",
            },
            {
              icon: "powerup-shield",
              text: "Discover magical powerups and abilities",
            },
            {
              icon: "powerup-star",
              text: "Battle epic bosses in stunning pixel art battles",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 bg-black/20 py-2 px-3 rounded-lg border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            >
              <div
                className="w-8 h-8 flex-shrink-0"
                style={{
                  backgroundImage: `url('/assets/sprites/${feature.icon}.svg')`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <span className="text-white/80 text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Awards section */}
        <motion.div
          className="mt-6 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
            <div
              className="w-5 h-5"
              style={{
                backgroundImage: "url('/assets/sprites/powerup-star.svg')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span className="text-white/80 text-xs font-pixel">
              AWARD WINNING
            </span>
          </div>

          <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <span className="text-white/80 text-xs font-pixel">
              4.9/5 RATING
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Characters section content
// Completing the Characters section (was cut off)
const CharactersSection = () => {
  const characters = [
    { name: "HERO", sprite: "player-idle-right" },
    { name: "WIZARD", sprite: "player-jump-right" },
    { name: "NINJA", sprite: "player-run-right" },
  ];

  const [selected, setSelected] = useState(0);

  return (
    <motion.div
      className="absolute inset-0 pt-16 px-8 pb-8 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex flex-col md:flex-row items-center gap-8">
        {/* Character display */}
        <motion.div
          className="relative w-72 h-72 flex-shrink-0"
          layoutId="characterDisplay"
        >
          {/* Character spotlight */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(93,63,232,0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Character sprite */}
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48"
            style={{
              backgroundImage: `url('/assets/sprites/${characters[selected].sprite}.svg')`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))",
            }}
            key={characters[selected].name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [-5, 5, -5],
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              scale: { duration: 0.3 },
              opacity: { duration: 0.3 },
              y: { duration: 3, repeat: Infinity },
            }}
          />
        </motion.div>

        {/* Character selection */}
        <div className="flex-1">
          <motion.h3
            className="font-pixel text-xl text-secondary mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Choose Your Hero
          </motion.h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {characters.map((character, index) => (
              <motion.button
                key={character.name}
                className={`py-3 px-2 rounded-lg font-pixel text-sm transition-all ${
                  selected === index
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-black/30 text-white/60 border border-white/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelected(index)}
              >
                {character.name}
              </motion.button>
            ))}
          </div>

          {/* Character details */}
          <motion.div
            className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10"
            key={`details-${selected}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-pixel text-lg text-primary mb-2">
              {characters[selected].name}
            </h4>

            {/* Stats bars */}
            <div className="space-y-2">
              {[
                {
                  name: "SPEED",
                  value: selected === 0 ? 75 : selected === 1 ? 60 : 90,
                },
                {
                  name: "POWER",
                  value: selected === 0 ? 80 : selected === 1 ? 90 : 65,
                },
                {
                  name: "MAGIC",
                  value: selected === 0 ? 50 : selected === 1 ? 95 : 40,
                },
              ].map((stat, i) => (
                <div key={stat.name} className="flex items-center">
                  <span className="w-20 text-white/80 text-xs font-pixel">
                    {stat.name}
                  </span>
                  <div className="flex-1 h-3 bg-black/30 rounded-full overflow-hidden ml-2">
                    <motion.div
                      className="h-full"
                      style={{
                        background:
                          i === 0
                            ? "linear-gradient(90deg, #3fe8c7, #5d3fe8)"
                            : i === 1
                            ? "linear-gradient(90deg, #ff8a2b, #e83f3f)"
                            : "linear-gradient(90deg, #5d3fe8, #ad3fe8)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="ml-2 text-white/80 text-xs font-pixel">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Character special ability */}
            <div className="mt-4 p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6"
                  style={{
                    backgroundImage:
                      selected === 0
                        ? "url('/assets/sprites/powerup-shield.svg')"
                        : selected === 1
                        ? "url('/assets/sprites/powerup-star.svg')"
                        : "url('/assets/sprites/powerup-speed.svg')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <h5 className="text-secondary text-sm font-pixel">
                  SPECIAL ABILITY
                </h5>
              </div>
              <p className="text-white/70 text-xs mt-1 font-pixel">
                {selected === 0
                  ? "Shield Bash - Creates a protective barrier and damages enemies"
                  : selected === 1
                  ? "Star Power - Unleashes magical energy with area effects"
                  : "Ninja Dash - Increased movement speed and evasion"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Worlds section content
const WorldsSection = () => {
  const worlds = [
    { name: "Crystal Caves", color: "#3fe8c7", icon: "gem-blue" },
    { name: "Lava Kingdom", color: "#e83f3f", icon: "gem-red" },
    { name: "Sky Islands", color: "#5d3fe8", icon: "gem-green" },
    { name: "Dark Forest", color: "#45a321", icon: "powerup-shield" },
  ];

  const [selectedWorld, setSelectedWorld] = useState(0);

  return (
    <motion.div
      className="absolute inset-0 pt-16 px-8 pb-8 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex flex-col">
        <motion.h3
          className="font-pixel text-xl text-secondary mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Explore Magical Worlds
        </motion.h3>

        {/* World selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {worlds.map((world, index) => (
            <motion.button
              key={world.name}
              className={`p-3 rounded-lg border transition-all ${
                selectedWorld === index
                  ? "border-2 border-white"
                  : "border border-white/10"
              }`}
              style={{
                backgroundColor: `${world.color}40`,
                boxShadow:
                  selectedWorld === index ? `0 0 20px ${world.color}` : "none",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedWorld(index)}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 mb-2"
                  style={{
                    backgroundImage: `url('/assets/sprites/${world.icon}.svg')`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <span className="font-pixel text-sm text-white">
                  {world.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Selected world showcase */}
        <motion.div
          className="flex-1 flex flex-col md:flex-row gap-6 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10"
          key={`world-${selectedWorld}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* World preview */}
          <div className="w-full md:w-1/2 h-60 relative rounded-lg overflow-hidden">
            <motion.div
              className="absolute inset-0"
              animate={{ backgroundPositionX: ["0%", "100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                background:
                  selectedWorld === 0
                    ? "radial-gradient(circle at 30% 50%, rgba(63, 232, 199, 0.3) 0%, transparent 70%)"
                    : selectedWorld === 1
                    ? "radial-gradient(circle at 70% 60%, rgba(232, 63, 63, 0.3) 0%, transparent 70%)"
                    : selectedWorld === 2
                    ? "radial-gradient(circle at 40% 30%, rgba(93, 63, 232, 0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle at 50% 70%, rgba(69, 163, 33, 0.3) 0%, transparent 70%)",
                backgroundSize: "200% 100%",
                backgroundPosition: "left bottom",
                opacity: 0.5,
              }}
            />

            {/* World elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    backgroundImage: `url('/assets/sprites/${worlds[selectedWorld].icon}.svg')`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.8,
                  }}
                  animate={{
                    y: [-(i % 5) * 10, (i % 5) * 10, -(i % 5) * 10],
                    rotate: [0, i % 2 === 0 ? 360 : -360],
                  }}
                  transition={{
                    y: { duration: 3 + i, repeat: Infinity },
                    rotate: {
                      duration: 8 + i,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                />
              ))}

              {/* Platforms */}
              <div
                className="absolute bottom-10 left-1/4 w-20 h-8"
                style={{
                  backgroundImage:
                    "url('/assets/sprites/platform_regular.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />

              <div
                className="absolute bottom-30 right-1/4 w-20 h-8"
                style={{
                  backgroundImage:
                    "url('/assets/sprites/platform_regular.svg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>

            {/* World name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 mr-2"
                  style={{
                    backgroundImage: `url('/assets/sprites/${worlds[selectedWorld].icon}.svg')`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <h4 className="font-pixel text-lg text-white">
                  {worlds[selectedWorld].name}
                </h4>
              </div>
            </div>
          </div>

          {/* World details */}
          <div className="w-full md:w-1/2">
            <h4 className="font-pixel text-lg text-white mb-4">
              World Features
            </h4>

            <div className="space-y-3">
              {[
                {
                  title: "Unique Challenges",
                  description:
                    selectedWorld === 0
                      ? "Navigate through slippery crystal surfaces"
                      : selectedWorld === 1
                      ? "Avoid rising lava and fire traps"
                      : selectedWorld === 2
                      ? "Master wind currents and floating platforms"
                      : "Find your way through a maze of vegetation",
                },
                {
                  title: "Special Enemies",
                  description:
                    selectedWorld === 0
                      ? "Crystal Golems and Shard Sprites"
                      : selectedWorld === 1
                      ? "Flame Imps and Lava Beasts"
                      : selectedWorld === 2
                      ? "Cloud Wizards and Storm Hawks"
                      : "Shadow Stalkers and Vine Monsters",
                },
                {
                  title: "Hidden Secrets",
                  description:
                    selectedWorld === 0
                      ? "Discover ancient crystal technology"
                      : selectedWorld === 1
                      ? "Unearth rare fire gems in volcanic cores"
                      : selectedWorld === 2
                      ? "Find celestial artifacts among the clouds"
                      : "Reveal forgotten forest shrines and ancient magic",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="bg-black/30 p-3 rounded-lg border border-white/10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                >
                  <h5 className="font-pixel text-sm text-secondary mb-1">
                    {feature.title}
                  </h5>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* World statistics */}
            <div className="flex justify-between mt-4 px-2">
              <div className="text-center">
                <div className="text-white/60 text-xs font-pixel">LEVELS</div>
                <div className="text-secondary text-lg font-pixel">
                  {selectedWorld === 0
                    ? "8"
                    : selectedWorld === 1
                    ? "6"
                    : selectedWorld === 2
                    ? "7"
                    : "9"}
                </div>
              </div>

              <div className="text-center">
                <div className="text-white/60 text-xs font-pixel">
                  DIFFICULTY
                </div>
                <div className="text-secondary text-lg font-pixel">
                  {selectedWorld === 0
                    ? "★★☆"
                    : selectedWorld === 1
                    ? "★★★"
                    : selectedWorld === 2
                    ? "★★☆"
                    : "★★★"}
                </div>
              </div>

              <div className="text-center">
                <div className="text-white/60 text-xs font-pixel">GEMS</div>
                <div className="text-secondary text-lg font-pixel">
                  {selectedWorld === 0
                    ? "32"
                    : selectedWorld === 1
                    ? "24"
                    : selectedWorld === 2
                    ? "28"
                    : "36"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Start Game Button component
const StartButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Button glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isHovered
            ? [
                "0 0 15px rgba(93,63,232,0.5), 0 0 30px rgba(255,138,43,0.5)",
                "0 0 20px rgba(93,63,232,0.7), 0 0 40px rgba(255,138,43,0.5)",
                "0 0 15px rgba(93,63,232,0.5), 0 0 30px rgba(255,138,43,0.5)",
              ]
            : "0 0 10px rgba(93,63,232,0.3), 0 0 20px rgba(255,138,43,0.3)",
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Primary button with gradient */}
      <div
        className="relative py-4 px-10 text-white font-pixel text-xl rounded-xl border-2 border-white/20 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #5d3fe8 0%, #ff8a2b 100%)",
        }}
      >
        {/* Button shine effect */}
        <motion.div
          className="absolute inset-0 bg-white opacity-0"
          animate={
            isHovered
              ? {
                  opacity: [0, 0.3, 0],
                  left: ["-100%", "100%"],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 1,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.5,
          }}
        />

        {/* Button content with icon */}
        <div className="flex items-center justify-center space-x-3">
          <span className="tracking-wider">START GAME</span>
          <motion.div
            className="w-6 h-6"
            style={{
              backgroundImage: "url('/assets/icons/controller.svg')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            animate={
              isHovered
                ? {
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  }
                : { rotate: 0, scale: 1 }
            }
            transition={{
              duration: 0.5,
              repeat: isHovered ? Infinity : 0,
            }}
          />
        </div>
      </div>

      {/* Button shadow */}
      <div
        className="absolute -bottom-2 left-2 right-2 h-2 rounded-b-xl"
        style={{
          background: "linear-gradient(90deg, #3a2896 0%, #b5591e 100%)",
          opacity: 0.7,
          filter: "blur(2px)",
        }}
      />
    </motion.button>
  );
};

export default Home;
