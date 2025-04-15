import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { GameStatus, Player, World, Collectible, Enemy } from "../types/game";
import { useAudio } from "../hooks/useAudio";

interface GameState {
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
  player: Player;
  setPlayer: (player: Player | ((prev: Player) => Player)) => void;
  world: World;
  setWorld: (world: World) => void;
  collectibles: Collectible[];
  setCollectibles: (collectibles: Collectible[]) => void;
  enemies: Enemy[];
  setEnemies: (enemies: Enemy[]) => void;
  score: number;
  setScore: (score: number) => void;
  level: number;
  setLevel: (level: number) => void;
  health: number;
  setHealth: (health: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasNextLevel: boolean;
  fps: number;
  setFps: (fps: number) => void;
  initGame: () => void;
  initLevel: (levelNumber: number) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  levelComplete: () => void;
  // Audio functionality
  playAudio: (
    type: "gameBackground" | "gameOver" | "gemCollect" | "mainTheme"
  ) => void;
  stopAudio: (
    type: "gameBackground" | "gameOver" | "gemCollect" | "mainTheme"
  ) => void;
  pauseAudio: (
    type: "gameBackground" | "gameOver" | "gemCollect" | "mainTheme"
  ) => void;
  stopAllAudio: () => void;
  musicVolume: number;
  sfxVolume: number;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
}

export const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>("menu");
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 200,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    direction: "right",
    state: "idle",
  });

  const [world, setWorld] = useState<World>({
    gravity: 0.5,
    friction: 0.8,
    platforms: [],
    width: 2000,
    height: 720,
  });

  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(100);
  const [loading, setLoading] = useState(true);
  const [fps, setFps] = useState(60);

  // Audio state
  const {
    playAudio,
    stopAudio,
    pauseAudio,
    stopAllAudio,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  } = useAudio();

  // Use useMemo to calculate hasNextLevel dynamically based on current level
  const hasNextLevel = useMemo(() => level < 5, [level]);

  const initLevel = useCallback(
    (levelNumber: number) => {
      setLoading(true);

      // Reset player position for all levels
      setPlayer({
        x: 100,
        y: 200,
        width: 32,
        height: 48,
        velocityX: 0,
        velocityY: 0,
        isJumping: false,
        direction: "right",
        state: "idle",
      });

      // Different level configurations
      if (levelNumber === 1) {
        // Level 1 - The existing level (beginner difficulty)
        setWorld({
          gravity: 0.5,
          friction: 0.8,
          platforms: [
            { x: 0, y: 500, width: 800, height: 20 },
            { x: 700, y: 450, width: 200, height: 20 },
            { x: 850, y: 400, width: 200, height: 20 },
            { x: 1000, y: 350, width: 200, height: 20 },
            { x: 1150, y: 300, width: 200, height: 20 },
            { x: 1300, y: 400, width: 200, height: 20 },
            { x: 1450, y: 500, width: 400, height: 20 },
          ],
          width: 2000,
          height: 720,
        });

        setCollectibles([
          {
            id: 1,
            x: 300,
            y: 450,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 2,
            x: 500,
            y: 450,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 3,
            x: 750,
            y: 400,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 4,
            x: 900,
            y: 350,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 5,
            x: 1100,
            y: 250,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 6,
            x: 1500,
            y: 450,
            width: 20,
            height: 20,
            type: "special",
            collected: false,
          },
        ]);

        setEnemies([
          {
            id: 1,
            x: 400,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 1,
            direction: "right",
            state: "moving",
          },
          {
            id: 2,
            x: 900,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 1,
            direction: "right",
            state: "moving",
          },
          {
            id: 3,
            x: 1350,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 1,
            direction: "right",
            state: "moving",
          },
        ]);
      } else if (levelNumber === 2) {
        // Level 2 - Intermediate difficulty
        // Slightly faster gravity, more spaced out platforms
        setWorld({
          gravity: 0.6, // Increased gravity
          friction: 0.75, // Less friction
          platforms: [
            { x: 0, y: 500, width: 500, height: 20 },
            { x: 550, y: 450, width: 150, height: 20 }, // Adjusted position from 600 to 550
            { x: 750, y: 400, width: 150, height: 20 }, // Adjusted position from 850 to 750
            { x: 950, y: 350, width: 150, height: 20 }, // Adjusted position from 1100 to 950
            { x: 1150, y: 300, width: 150, height: 20 }, // Adjusted position from 1300 to 1150
            { x: 1350, y: 250, width: 150, height: 20 }, // Adjusted position from 1550 to 1350
            { x: 1550, y: 350, width: 100, height: 20 }, // Adjusted position from 1700 to 1550
            { x: 1700, y: 500, width: 250, height: 20 }, // Adjusted position from 1850 to 1700
          ],
          width: 2200, // Longer level
          height: 720,
        });

        setCollectibles([
          {
            id: 1,
            x: 250,
            y: 450,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 2,
            x: 450,
            y: 450,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 3,
            x: 650,
            y: 400,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 4,
            x: 900,
            y: 350,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 5,
            x: 1150,
            y: 300,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 6,
            x: 1350,
            y: 250,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 7,
            x: 1600,
            y: 200,
            width: 20,
            height: 20,
            type: "gem",
            collected: false,
          },
          {
            id: 8,
            x: 1900,
            y: 450,
            width: 20,
            height: 20,
            type: "special",
            collected: false,
          },
        ]);

        setEnemies([
          {
            id: 1,
            x: 300,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 1.5, // Faster enemies
            direction: "right",
            state: "moving",
          },
          {
            id: 2,
            x: 700,
            y: 418,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 3,
            x: 1000,
            y: 318,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 4,
            x: 1600,
            y: 218,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },
        ]);
      } else if (levelNumber === 3) {
        // Level 3 - Hard difficulty
        // Higher gravity, more spaced out and irregular platforms
        setWorld({
          gravity: 0.7, // Even higher gravity
          friction: 0.7, // Even less friction
          platforms: [
            { x: 0, y: 500, width: 300, height: 20 },
            { x: 350, y: 450, width: 100, height: 20 }, // Adjusted position from 400 to 350
            { x: 520, y: 400, width: 80, height: 20 }, // Adjusted position from 600 to 520
            { x: 670, y: 350, width: 100, height: 20 }, // Adjusted position from 780 to 670
            { x: 840, y: 300, width: 100, height: 20 }, // Adjusted position from 980 to 840
            { x: 1010, y: 350, width: 100, height: 20 }, // Adjusted position from 1180 to 1010
            { x: 1180, y: 400, width: 100, height: 20 }, // Adjusted position from 1380 to 1180
            { x: 1350, y: 300, width: 80, height: 20 }, // Adjusted position from 1580 to 1350
            { x: 1500, y: 250, width: 80, height: 20 }, // Adjusted position from 1750 to 1500
            { x: 1650, y: 200, width: 80, height: 20 }, // Adjusted position from 1930 to 1650
            { x: 1800, y: 300, width: 100, height: 20 }, // Adjusted position from 2100 to 1800
            { x: 1950, y: 500, width: 300, height: 20 }, // Adjusted position from 2300 to 1950
          ],
          width: 2300, // Adjusted from 2600 to match new platform positions
          height: 720,
        });

        setCollectibles([
          {
            id: 1,
            x: 200,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red", // Using red gem
            collected: false,
          },
          {
            id: 2,
            x: 450,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-blue", // Using blue gem
            collected: false,
          },
          {
            id: 3,
            x: 640,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-green", // Using green gem
            collected: false,
          },
          {
            id: 4,
            x: 830,
            y: 300,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 5,
            x: 1030,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 6,
            x: 1230,
            y: 300,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 7,
            x: 1430,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 8,
            x: 1620,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 9,
            x: 1790,
            y: 200,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 10,
            x: 1970,
            y: 150,
            width: 20,
            height: 20,
            type: "powerup-star", // Adding powerup
            collected: false,
          },
          {
            id: 11,
            x: 2400,
            y: 450,
            width: 20,
            height: 20,
            type: "special",
            collected: false,
          },
        ]);

        setEnemies([
          {
            id: 1,
            x: 150,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2, // Even faster enemies
            direction: "right",
            state: "moving",
          },
          {
            id: 2,
            x: 500,
            y: 418,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
          {
            id: 3,
            x: 830,
            y: 318,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
          {
            id: 4,
            x: 1230,
            y: 318,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
          {
            id: 5,
            x: 1620,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
          {
            id: 6,
            x: 2350,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
        ]);
      } else if (levelNumber === 4) {
        // Level 4 - Expert difficulty - Cave system with mixed platform types
        setWorld({
          gravity: 0.75,
          friction: 0.65,
          platforms: [
            { x: 0, y: 500, width: 400, height: 20 },
            { x: 470, y: 450, width: 120, height: 20 }, // Adjusted from 500 to 470
            // Moving platforms section with reduced gaps
            {
              x: 650,
              y: 450,
              width: 100,
              height: 20, // Adjusted from 700 to 650
              type: "moving",
              movementRange: 150,
              speed: 1,
            },
            {
              x: 850,
              y: 400,
              width: 100,
              height: 20, // Adjusted from 950 to 850
              type: "moving",
              movementRange: 150,
              speed: 1.5,
            },
            {
              x: 1050,
              y: 350,
              width: 100,
              height: 20, // Adjusted from 1200 to 1050
              type: "moving",
              movementRange: 150,
              speed: 2,
            },
            // Bouncy platforms section with reduced gaps
            { x: 1300, y: 500, width: 100, height: 20, type: "bouncy" }, // Adjusted from 1450 to 1300
            { x: 1450, y: 400, width: 100, height: 20, type: "bouncy" }, // Adjusted from 1650 to 1450
            { x: 1600, y: 300, width: 100, height: 20, type: "bouncy" }, // Adjusted from 1850 to 1600
            // Narrow ledges with reduced gaps
            { x: 1800, y: 200, width: 60, height: 20 }, // Adjusted from 2050 to 1800
            { x: 1920, y: 250, width: 60, height: 20 }, // Adjusted from 2200 to 1920
            { x: 2040, y: 300, width: 60, height: 20 }, // Adjusted from 2350 to 2040
            { x: 2160, y: 350, width: 60, height: 20 }, // Adjusted from 2500 to 2160
            // Final stretch with reduced gaps
            { x: 2280, y: 400, width: 80, height: 20 }, // Adjusted from 2650 to 2280
            { x: 2410, y: 450, width: 100, height: 20 }, // Adjusted from 2800 to 2410
            { x: 2550, y: 500, width: 300, height: 20 }, // Adjusted from 2950 to 2550
          ],
          width: 2850, // Adjusted from 3250 to match new platform positions
          height: 720,
        });

        setCollectibles([
          {
            id: 1,
            x: 200,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 2,
            x: 470,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 3,
            x: 650,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 4,
            x: 850,
            y: 350,
            width: 20,
            height: 20,
            type: "powerup-speed",
            collected: false,
          },
          {
            id: 5,
            x: 1050,
            y: 300,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 6,
            x: 1300,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 7,
            x: 1450,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 8,
            x: 1600,
            y: 250,
            width: 20,
            height: 20,
            type: "powerup-shield",
            collected: false,
          },
          {
            id: 9,
            x: 1800,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 10,
            x: 2040,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 11,
            x: 2280,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 12,
            x: 2600,
            y: 450,
            width: 20,
            height: 20,
            type: "special",
            collected: false,
          },
        ]);

        setEnemies([
          {
            id: 1,
            x: 200,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 2,
            x: 500,
            y: 418,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 3,
            x: 700,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 4,
            x: 1350,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 5,
            x: 1850,
            y: 168,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 6,
            x: 2200,
            y: 318,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
        ]);
      } else if (levelNumber === 5) {
        // Level 5 - Master difficulty - Epic finale with varied terrain and challenges
        setWorld({
          gravity: 0.8,
          friction: 0.6,
          platforms: [
            // Starting area - moderate difficulty
            { x: 0, y: 500, width: 300, height: 20 },
            { x: 350, y: 450, width: 80, height: 20 }, // Unchanged, first gap is fine
            { x: 480, y: 400, width: 80, height: 20 }, // Unchanged, second gap is fine

            // First challenge - vertical climbing section with reduced gaps
            { x: 600, y: 500, width: 100, height: 20 }, // Unchanged - ground platform
            { x: 650, y: 400, width: 80, height: 20 }, // Unchanged
            { x: 700, y: 300, width: 80, height: 20 }, // Unchanged
            { x: 650, y: 200, width: 80, height: 20 }, // Unchanged
            { x: 600, y: 100, width: 80, height: 20 }, // Unchanged

            // Bridge across a gap - falling platforms with shorter gaps
            {
              x: 720,
              y: 100,
              width: 60,
              height: 20, // Adjusted from 750 to 720
              type: "falling",
              fallDelay: 500,
            },
            {
              x: 820,
              y: 100,
              width: 60,
              height: 20, // Adjusted from 850 to 820
              type: "falling",
              fallDelay: 500,
            },
            {
              x: 920,
              y: 100,
              width: 60,
              height: 20, // Adjusted from 950 to 920
              type: "falling",
              fallDelay: 500,
            },
            {
              x: 1020,
              y: 100,
              width: 60,
              height: 20, // Adjusted from 1050 to 1020
              type: "falling",
              fallDelay: 500,
            },

            // Descent with moving platforms - reduced gaps
            { x: 1120, y: 150, width: 80, height: 20 }, // Adjusted from 1150 to 1120
            {
              x: 1240,
              y: 200,
              width: 80,
              height: 20, // Adjusted from 1300 to 1240
              type: "moving",
              movementRange: 100,
              speed: 2,
            },
            {
              x: 1370,
              y: 250,
              width: 80,
              height: 20, // Adjusted from 1450 to 1370
              type: "moving",
              movementRange: 100,
              speed: 2.5,
            },
            {
              x: 1500,
              y: 300,
              width: 80,
              height: 20, // Adjusted from 1600 to 1500
              type: "moving",
              movementRange: 100,
              speed: 3,
            },

            // Bouncy section with reduced gaps
            { x: 1630, y: 500, width: 100, height: 20 }, // Adjusted from 1750 to 1630
            { x: 1760, y: 400, width: 80, height: 20, type: "bouncy" }, // Adjusted from 1900 to 1760
            { x: 1880, y: 300, width: 80, height: 20, type: "bouncy" }, // Adjusted from 2050 to 1880
            { x: 2000, y: 200, width: 80, height: 20, type: "bouncy" }, // Adjusted from 2200 to 2000

            // Final approach - challenging but achievable
            { x: 2120, y: 200, width: 60, height: 20 }, // Adjusted from 2350 to 2120
            {
              x: 2220,
              y: 250,
              width: 50,
              height: 20, // Adjusted from 2450 to 2220
              type: "moving",
              movementRange: 50,
              speed: 3,
            },
            {
              x: 2310,
              y: 300,
              width: 50,
              height: 20, // Adjusted from 2550 to 2310
              type: "moving",
              movementRange: 50,
              speed: 3.5,
            },
            {
              x: 2400,
              y: 350,
              width: 50,
              height: 20, // Adjusted from 2650 to 2400
              type: "moving",
              movementRange: 50,
              speed: 4,
            },
            { x: 2490, y: 400, width: 40, height: 20, type: "bouncy" }, // Adjusted from 2750 to 2490
            { x: 2570, y: 300, width: 40, height: 20, type: "bouncy" }, // Adjusted from 2850 to 2570

            // Victory platform
            { x: 2650, y: 200, width: 200, height: 20 }, // Adjusted from 3000 to 2650
            { x: 2850, y: 500, width: 300, height: 20 }, // Adjusted from 3250 to 2850 - Safety net
          ],
          width: 3150, // Adjusted from 3500 to match new platform positions
          height: 720,
        });

        setCollectibles([
          // Starting area collectibles
          {
            id: 1,
            x: 150,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 2,
            x: 350,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 3,
            x: 480,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },

          // Vertical climbing section collectibles
          {
            id: 4,
            x: 650,
            y: 350,
            width: 20,
            height: 20,
            type: "powerup-speed",
            collected: false,
          },
          {
            id: 5,
            x: 700,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 6,
            x: 650,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },

          // Bridge collectibles
          {
            id: 7,
            x: 770,
            y: 50,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 8,
            x: 870,
            y: 50,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 9,
            x: 970,
            y: 50,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },

          // Descent collectibles
          {
            id: 10,
            x: 1120,
            y: 100,
            width: 20,
            height: 20,
            type: "powerup-shield",
            collected: false,
          },
          {
            id: 11,
            x: 1240,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 12,
            x: 1370,
            y: 200,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 13,
            x: 1500,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },

          // Bouncy section collectibles
          {
            id: 14,
            x: 1630,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 15,
            x: 1760,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 16,
            x: 1880,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 17,
            x: 2000,
            y: 150,
            width: 20,
            height: 20,
            type: "powerup-star",
            collected: false,
          },

          // Final approach collectibles
          {
            id: 18,
            x: 2120,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 19,
            x: 2220,
            y: 200,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 20,
            x: 2310,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },

          // Final platform collectible (special)
          {
            id: 21,
            x: 2750,
            y: 150,
            width: 20,
            height: 20,
            type: "special",
            collected: false,
          },
        ]);

        setEnemies([
          // Starting area enemies
          {
            id: 1,
            x: 150,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
          {
            id: 2,
            x: 400,
            y: 418,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Vertical section enemies
          {
            id: 3,
            x: 650,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Bridge area (no enemies to make it less frustrating)

          // Descent enemies
          {
            id: 4,
            x: 1240,
            y: 168,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
          {
            id: 5,
            x: 1500,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Bouncy section enemies
          {
            id: 6,
            x: 1630,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
          {
            id: 7,
            x: 1880,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Final approach enemies
          {
            id: 8,
            x: 2220,
            y: 218,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
          {
            id: 9,
            x: 2400,
            y: 318,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Final platform guards
          {
            id: 10,
            x: 2700,
            y: 168,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
        ]);
      }

      setLoading(false);
    },
    [setLoading, setPlayer, setWorld, setCollectibles, setEnemies]
  );

  const initGame = useCallback(() => {
    setScore(0);
    setHealth(100);
    setLevel(1);
    initLevel(1);
  }, [initLevel]);

  const startGame = useCallback(() => {
    setGameStatus("playing");
  }, []);

  const pauseGame = useCallback(() => {
    setGameStatus("paused");
  }, []);

  const resumeGame = useCallback(() => {
    setGameStatus("playing");
  }, []);

  const gameOver = useCallback(() => {
    setGameStatus("gameOver");
  }, []);

  const levelComplete = useCallback(() => {
    setGameStatus("levelComplete");

    // Prepare for next level if there is one
    if (level < 5) {
      // Updated to support 5 levels
      const nextLevel = level + 1;
      setLevel(nextLevel);
      // Next level will be initialized when the player chooses to continue
    }
  }, [level]);

  return (
    <GameContext.Provider
      value={{
        gameStatus,
        setGameStatus,
        player,
        setPlayer,
        world,
        setWorld,
        collectibles,
        setCollectibles,
        enemies,
        setEnemies,
        score,
        setScore,
        level,
        setLevel,
        health,
        setHealth,
        loading,
        setLoading,
        hasNextLevel,
        fps,
        setFps,
        initGame,
        initLevel,
        startGame,
        pauseGame,
        resumeGame,
        gameOver,
        levelComplete,
        playAudio,
        stopAudio,
        pauseAudio,
        stopAllAudio,
        musicVolume,
        sfxVolume,
        setMusicVolume,
        setSfxVolume,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
};
