import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import Canvas from '../game/Canvas';
import MainMenu from '../ui/MainMenu';
import GameUI from '../ui/GameUI';
import PauseMenu from '../ui/PauseMenu';
import GameOver from '../ui/GameOver';
import LevelComplete from '../ui/LevelComplete';

const GameContainer = () => {
  const { 
    gameStatus,
    setGameStatus,
    startGame,
    pauseGame,
    resumeGame 
  } = useGameState();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle keyboard input for game controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gameStatus === 'playing') {
        pauseGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, pauseGame]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <motion.div 
        ref={containerRef}
        className="retro-container scanline"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Game Canvas (always rendered but may be overlaid) */}
        <Canvas />
        
        {/* UI Layers */}
        <AnimatePresence mode="wait">
          {gameStatus === 'menu' && (
            <MainMenu onStartGame={startGame} />
          )}
          
          {gameStatus === 'playing' && (
            <GameUI onPause={pauseGame} />
          )}
          
          {gameStatus === 'paused' && (
            <PauseMenu onResume={resumeGame} onExit={() => setGameStatus('menu')} />
          )}
          
          {gameStatus === 'gameOver' && (
            <GameOver 
              onRestart={startGame} 
              onExit={() => setGameStatus('menu')} 
            />
          )}
          
          {gameStatus === 'levelComplete' && (
            <LevelComplete 
              onNextLevel={() => {
                // In a real game, would load next level here
                startGame();
              }} 
              onExit={() => setGameStatus('menu')} 
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GameContainer;