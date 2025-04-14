import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { GameStatus, Player, World, Collectible, Enemy } from "../types/game";

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
  initLevel: (levelNumber: number) => void; // Add this to expose the initLevel function
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  levelComplete: () => void;
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
            { x: 600, y: 450, width: 150, height: 20 },
            { x: 850, y: 400, width: 150, height: 20 },
            { x: 1100, y: 350, width: 150, height: 20 },
            { x: 1300, y: 300, width: 150, height: 20 },
            { x: 1550, y: 250, width: 100, height: 20 }, // Higher platform
            { x: 1700, y: 350, width: 100, height: 20 },
            { x: 1850, y: 500, width: 250, height: 20 },
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
            { x: 400, y: 450, width: 100, height: 20 }, // Small platform
            { x: 600, y: 400, width: 80, height: 20 }, // Even smaller platform
            { x: 780, y: 350, width: 100, height: 20 },
            { x: 980, y: 300, width: 100, height: 20 },
            { x: 1180, y: 350, width: 100, height: 20 },
            { x: 1380, y: 400, width: 100, height: 20 },
            { x: 1580, y: 300, width: 80, height: 20 }, // Small platform at a higher position
            { x: 1750, y: 250, width: 80, height: 20 }, // Even higher platform
            { x: 1930, y: 200, width: 80, height: 20 }, // Highest platform
            { x: 2100, y: 300, width: 100, height: 20 },
            { x: 2300, y: 500, width: 300, height: 20 }, // Final platform
          ],
          width: 2600, // Even longer level
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
            { x: 500, y: 450, width: 120, height: 20 },
            // Moving platforms section
            {
              x: 700,
              y: 450,
              width: 100,
              height: 20,
              type: "moving",
              movementRange: 150,
              speed: 1,
            },
            {
              x: 950,
              y: 400,
              width: 100,
              height: 20,
              type: "moving",
              movementRange: 150,
              speed: 1.5,
            },
            {
              x: 1200,
              y: 350,
              width: 100,
              height: 20,
              type: "moving",
              movementRange: 150,
              speed: 2,
            },
            // Bouncy platforms section
            { x: 1450, y: 500, width: 100, height: 20, type: "bouncy" },
            { x: 1650, y: 400, width: 100, height: 20, type: "bouncy" },
            { x: 1850, y: 300, width: 100, height: 20, type: "bouncy" },
            // Narrow ledges
            { x: 2050, y: 200, width: 60, height: 20 },
            { x: 2200, y: 250, width: 60, height: 20 },
            { x: 2350, y: 300, width: 60, height: 20 },
            { x: 2500, y: 350, width: 60, height: 20 },
            // Final stretch
            { x: 2650, y: 400, width: 80, height: 20 },
            { x: 2800, y: 450, width: 100, height: 20 },
            { x: 2950, y: 500, width: 300, height: 20 },
          ],
          width: 3250, // Very long level
          height: 720,
        });

        setCollectibles([
          // Regular gem pattern at the start
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
            x: 250,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 3,
            x: 350,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },

          // Some collectibles on small platforms
          {
            id: 4,
            x: 550,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },

          // Collectibles on moving platforms (challenging)
          {
            id: 5,
            x: 750,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 6,
            x: 1000,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 7,
            x: 1250,
            y: 300,
            width: 20,
            height: 20,
            type: "powerup-speed",
            collected: false,
          },

          // Collectibles near bouncy platforms
          {
            id: 8,
            x: 1500,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 9,
            x: 1700,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 10,
            x: 1900,
            y: 250,
            width: 20,
            height: 20,
            type: "powerup-shield",
            collected: false,
          },

          // Hard to reach collectibles on narrow ledges
          {
            id: 11,
            x: 2080,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 12,
            x: 2230,
            y: 200,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 13,
            x: 2380,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 14,
            x: 2530,
            y: 300,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },

          // Final stretch rewards
          {
            id: 15,
            x: 2680,
            y: 350,
            width: 20,
            height: 20,
            type: "powerup-star",
            collected: false,
          },
          {
            id: 16,
            x: 2830,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 17,
            x: 3100,
            y: 450,
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
            x: 200,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },

          // Enemies near moving platforms
          {
            id: 2,
            x: 600,
            y: 418,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 3,
            x: 800,
            y: 418,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },

          // Enemies near bouncy platforms
          {
            id: 4,
            x: 1500,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 5,
            x: 1700,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 6,
            x: 1900,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },

          // Enemies on narrow ledges
          {
            id: 7,
            x: 2080,
            y: 168,
            width: 32,
            height: 32,
            velocityX: 1,
            direction: "right",
            state: "moving",
          },
          {
            id: 8,
            x: 2380,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 1,
            direction: "right",
            state: "moving",
          },

          // Final stretch enemies
          {
            id: 9,
            x: 2700,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
          {
            id: 10,
            x: 3000,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },
          {
            id: 11,
            x: 3150,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 3,
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
            { x: 350, y: 450, width: 80, height: 20 },
            { x: 480, y: 400, width: 80, height: 20 },

            // First challenge - vertical climbing section
            { x: 600, y: 500, width: 100, height: 20 },
            { x: 650, y: 400, width: 80, height: 20 },
            { x: 700, y: 300, width: 80, height: 20 },
            { x: 650, y: 200, width: 80, height: 20 },
            { x: 600, y: 100, width: 80, height: 20 },

            // Bridge across a gap - falling platforms
            {
              x: 750,
              y: 100,
              width: 60,
              height: 20,
              type: "falling",
              fallDelay: 500,
            },
            {
              x: 850,
              y: 100,
              width: 60,
              height: 20,
              type: "falling",
              fallDelay: 500,
            },
            {
              x: 950,
              y: 100,
              width: 60,
              height: 20,
              type: "falling",
              fallDelay: 500,
            },
            {
              x: 1050,
              y: 100,
              width: 60,
              height: 20,
              type: "falling",
              fallDelay: 500,
            },

            // Descent with moving platforms
            { x: 1150, y: 150, width: 80, height: 20 },
            {
              x: 1300,
              y: 200,
              width: 80,
              height: 20,
              type: "moving",
              movementRange: 100,
              speed: 2,
            },
            {
              x: 1450,
              y: 250,
              width: 80,
              height: 20,
              type: "moving",
              movementRange: 100,
              speed: 2.5,
            },
            {
              x: 1600,
              y: 300,
              width: 80,
              height: 20,
              type: "moving",
              movementRange: 100,
              speed: 3,
            },

            // Bouncy section
            { x: 1750, y: 500, width: 100, height: 20 },
            { x: 1900, y: 400, width: 80, height: 20, type: "bouncy" },
            { x: 2050, y: 300, width: 80, height: 20, type: "bouncy" },
            { x: 2200, y: 200, width: 80, height: 20, type: "bouncy" },

            // Final approach - very challenging
            { x: 2350, y: 200, width: 60, height: 20 },
            {
              x: 2450,
              y: 250,
              width: 50,
              height: 20,
              type: "moving",
              movementRange: 50,
              speed: 3,
            },
            {
              x: 2550,
              y: 300,
              width: 50,
              height: 20,
              type: "moving",
              movementRange: 50,
              speed: 3.5,
            },
            {
              x: 2650,
              y: 350,
              width: 50,
              height: 20,
              type: "moving",
              movementRange: 50,
              speed: 4,
            },
            { x: 2750, y: 400, width: 40, height: 20, type: "bouncy" },
            { x: 2850, y: 300, width: 40, height: 20, type: "bouncy" },

            // Victory platform
            { x: 3000, y: 200, width: 200, height: 20 },
            { x: 3250, y: 500, width: 300, height: 20 }, // Safety net
          ],
          width: 3500, // Extremely long level
          height: 720,
        });

        setCollectibles([
          // Starting area gems
          {
            id: 1,
            x: 100,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 2,
            x: 200,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 3,
            x: 400,
            y: 400,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },

          // Vertical climbing section rewards
          {
            id: 4,
            x: 680,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 5,
            x: 730,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 6,
            x: 680,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 7,
            x: 630,
            y: 150,
            width: 20,
            height: 20,
            type: "powerup-speed",
            collected: false,
          },

          // Falling platform bridge - high risk, high reward
          {
            id: 8,
            x: 750,
            y: 50,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 9,
            x: 850,
            y: 50,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 10,
            x: 950,
            y: 50,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 11,
            x: 1050,
            y: 50,
            width: 20,
            height: 20,
            type: "powerup-shield",
            collected: false,
          },

          // Moving platform descent
          {
            id: 12,
            x: 1180,
            y: 100,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 13,
            x: 1330,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 14,
            x: 1480,
            y: 200,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 15,
            x: 1630,
            y: 250,
            width: 20,
            height: 20,
            type: "powerup-star",
            collected: false,
          },

          // Bouncy section gems
          {
            id: 16,
            x: 1800,
            y: 450,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 17,
            x: 1950,
            y: 350,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 18,
            x: 2100,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },

          // Final approach - extremely valuable collectibles
          {
            id: 19,
            x: 2380,
            y: 150,
            width: 20,
            height: 20,
            type: "gem-red",
            collected: false,
          },
          {
            id: 20,
            x: 2480,
            y: 200,
            width: 20,
            height: 20,
            type: "gem-blue",
            collected: false,
          },
          {
            id: 21,
            x: 2580,
            y: 250,
            width: 20,
            height: 20,
            type: "gem-green",
            collected: false,
          },
          {
            id: 22,
            x: 2680,
            y: 300,
            width: 20,
            height: 20,
            type: "powerup-star",
            collected: false,
          },
          {
            id: 23,
            x: 2780,
            y: 350,
            width: 20,
            height: 20,
            type: "powerup-speed",
            collected: false,
          },
          {
            id: 24,
            x: 2880,
            y: 250,
            width: 20,
            height: 20,
            type: "powerup-shield",
            collected: false,
          },

          // Victory reward
          {
            id: 25,
            x: 3100,
            y: 150,
            width: 20,
            height: 20,
            type: "special",
            collected: false,
          },
        ]);

        setEnemies([
          // Starting area
          {
            id: 1,
            x: 150,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },

          // Vertical climbing section
          {
            id: 2,
            x: 650,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 3,
            x: 700,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 4,
            x: 650,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 5,
            x: 600,
            y: 168,
            width: 32,
            height: 32,
            velocityX: 1.5,
            direction: "right",
            state: "moving",
          },

          // After bridge
          {
            id: 6,
            x: 1180,
            y: 118,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },

          // Moving platform descent
          {
            id: 7,
            x: 1330,
            y: 168,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
          {
            id: 8,
            x: 1480,
            y: 218,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 9,
            x: 1630,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Bouncy section
          {
            id: 10,
            x: 1800,
            y: 468,
            width: 32,
            height: 32,
            velocityX: 2,
            direction: "right",
            state: "moving",
          },
          {
            id: 11,
            x: 1950,
            y: 368,
            width: 32,
            height: 32,
            velocityX: 2.5,
            direction: "right",
            state: "moving",
          },
          {
            id: 12,
            x: 2100,
            y: 268,
            width: 32,
            height: 32,
            velocityX: 3,
            direction: "right",
            state: "moving",
          },

          // Final approach - boss-like enemies
          {
            id: 13,
            x: 2380,
            y: 168,
            width: 40,
            height: 40,
            velocityX: 2,
            direction: "right",
            state: "attacking",
          },
          {
            id: 14,
            x: 2580,
            y: 268,
            width: 40,
            height: 40,
            velocityX: 3,
            direction: "right",
            state: "attacking",
          },
          {
            id: 15,
            x: 2780,
            y: 368,
            width: 40,
            height: 40,
            velocityX: 3.5,
            direction: "right",
            state: "attacking",
          },

          // Final boss
          {
            id: 16,
            x: 3050,
            y: 168,
            width: 48,
            height: 48,
            velocityX: 4,
            direction: "right",
            state: "attacking",
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
