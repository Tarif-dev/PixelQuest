import { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useGameState } from "../hooks/useGameState";
import LoadingScreen from "../components/ui/LoadingScreen";
import { preloadGameAssets } from "../lib/engine";

// Dynamically import game components to prevent SSR issues with canvas
const GameContainer = dynamic(
  () => import("../components/layout/GameContainer"),
  { ssr: false }
);

const Game: NextPage = () => {
  const { initGame, loading } = useGameState();
  const [gameReady, setGameReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Initialize game state and preload assets
    const prepareGame = async () => {
      initGame();

      // Start progress at 30% after game state initialization
      setLoadingProgress(30);

      // Preload all game assets
      try {
        const assetsLoaded = await preloadGameAssets();
        if (assetsLoaded) {
          setLoadingProgress(100);
          setGameReady(true);
        } else {
          console.error("Failed to load game assets");
          // Even if preloading fails, we'll attempt to show the game
          // The engine will fall back to colored rectangles
          setLoadingProgress(90);
          setGameReady(true);
        }
      } catch (error) {
        console.error("Error during game preparation:", error);
        setLoadingProgress(90);
        setGameReady(true);
      }
    };

    prepareGame();
  }, [initGame]);

  return (
    <>
      <Head>
        <title>RetroQuest: Game</title>
        <meta
          name="description"
          content="Play RetroQuest - a retro-style platform game with stunning pixel art"
        />
      </Head>

      {loading || !gameReady ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <GameContainer />
      )}
    </>
  );
};

export default Game;
