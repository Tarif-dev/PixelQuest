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
  setPlayer: (player: Player) => void;
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
  initGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  levelComplete: () => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

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

  const initGame = useCallback(() => {
    setLoading(true);

    // Reset game state
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

    // Create some sample platforms
    setWorld({
      gravity: 0.5,
      friction: 0.8,
      platforms: [
        { x: 0, y: 500, width: 800, height: 20 },
        { x: 850, y: 450, width: 200, height: 20 },
        { x: 1100, y: 400, width: 200, height: 20 },
        { x: 1350, y: 350, width: 200, height: 20 },
        { x: 1600, y: 500, width: 400, height: 20 },
      ],
      width: 2000,
      height: 720,
    });

    // Create some collectibles
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
        x: 900,
        y: 400,
        width: 20,
        height: 20,
        type: "gem",
        collected: false,
      },
      {
        id: 4,
        x: 1150,
        y: 350,
        width: 20,
        height: 20,
        type: "gem",
        collected: false,
      },
      {
        id: 5,
        x: 1400,
        y: 300,
        width: 20,
        height: 20,
        type: "gem",
        collected: false,
      },
      {
        id: 6,
        x: 1700,
        y: 450,
        width: 20,
        height: 20,
        type: "special",
        collected: false,
      },
    ]);

    // Create some enemies
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
        x: 1200,
        y: 368,
        width: 32,
        height: 32,
        velocityX: 1,
        direction: "right",
        state: "moving",
      },
      {
        id: 3,
        x: 1650,
        y: 468,
        width: 32,
        height: 32,
        velocityX: 1,
        direction: "right",
        state: "moving",
      },
    ]);

    setScore(0);
    setHealth(100);
    setLevel(1);
    setLoading(false);
  }, []);

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
  }, []);

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
        initGame,
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
