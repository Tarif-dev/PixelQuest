import { useRef, useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useGameLoop } from '../../hooks/useGameLoop';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameStatus, player, world, collectibles, enemies } = useGameState();
  const { startGameLoop, stopGameLoop } = useGameLoop(canvasRef);
  
  // Start/stop game loop based on game status
  useEffect(() => {
    if (gameStatus === 'playing') {
      startGameLoop();
    } else {
      stopGameLoop();
    }
    
    return () => stopGameLoop();
  }, [gameStatus, startGameLoop, stopGameLoop]);
  
  // Adjust canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          canvasRef.current.width = container.clientWidth;
          canvasRef.current.height = container.clientHeight;
        }
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-black"
    />
  );
};

export default Canvas;