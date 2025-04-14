import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
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
  // Initialize hasNextLevel - assuming we have 3 levels in the game
  const hasNextLevel = level < 3; // We now have 3 levels total

  const initLevel = useCallback((levelNumber: number) => {
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
          type: "gem",
          collected: false,
        },
        {
          id: 2,
          x: 450,
          y: 400,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 3,
          x: 640,
          y: 350,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 4,
          x: 830,
          y: 300,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 5,
          x: 1030,
          y: 250,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 6,
          x: 1230,
          y: 300,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 7,
          x: 1430,
          y: 350,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 8,
          x: 1620,
          y: 250,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 9,
          x: 1790,
          y: 200,
          width: 20,
          height: 20,
          type: "gem",
          collected: false,
        },
        {
          id: 10,
          x: 1970,
          y: 150,
          width: 20,
          height: 20,
          type: "gem",
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
    }

    setLoading(false);
  }, []);

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
    if (level < 3) {
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
