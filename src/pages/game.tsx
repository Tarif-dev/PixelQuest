import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useGameState } from '../hooks/useGameState';
import LoadingScreen from '../components/ui/LoadingScreen';

// Dynamically import game components to prevent SSR issues with canvas
const GameContainer = dynamic(
  () => import('../components/layout/GameContainer'),
  { ssr: false }
);

const Game: NextPage = () => {
  const { initGame, loading } = useGameState();
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    // Initialize game state and preload assets
    initGame();
    
    // Simulate loading time for demonstration purposes
    // In a real app, you'd check when all assets are loaded
    const timer = setTimeout(() => {
      setGameReady(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [initGame]);

  return (
    <>
      <Head>
        <title>RetroQuest: Game</title>
        <meta name="description" content="Play RetroQuest - a retro-style platform game with stunning pixel art" />
      </Head>

      {loading || !gameReady ? (
        <LoadingScreen progress={gameReady ? 100 : 60} />
      ) : (
        <GameContainer />
      )}
    </>
  );
};

export default Game;