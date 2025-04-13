import { useRef, useCallback } from 'react';
import { useGameState } from './useGameState';
import { updatePlayer } from '../lib/physics';
import { checkCollisions } from '../lib/collision';
import { renderGame } from '../lib/engine';

export const useGameLoop = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const {
    gameStatus,
    player,
    setPlayer,
    world,
    collectibles,
    setCollectibles,
    enemies,
    setEnemies,
    health,
    setHealth,
    score,
    setScore,
    gameOver
  } = useGameState();
  
  const gameLoop = useCallback((time: number) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Calculate delta time for smooth animations
    const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 1/60;
    lastTimeRef.current = time;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Update game state
    const updatedPlayer = updatePlayer(player, world, deltaTime);
    setPlayer(updatedPlayer);
    
    // Check collisions
    const collisionResult = checkCollisions(
      updatedPlayer,
      world.platforms,
      collectibles,
      enemies
    );
    
    // Update game state based on collisions
    if (collisionResult.updatedPlayer) {
      setPlayer(collisionResult.updatedPlayer);
    }
    
    if (collisionResult.updatedCollectibles) {
      setCollectibles(collisionResult.updatedCollectibles);
      if (collisionResult.collectedItem) {
        // Increase score
        setScore(score + (collisionResult.collectedItem.type === 'gem' ? 100 : 500));
      }
    }
    
    // Check for enemy collisions that damage the player
    if (collisionResult.playerDamaged) {
      const newHealth = health - 10;
      setHealth(newHealth);
      
      // Check if player died
      if (newHealth <= 0) {
        gameOver();
      }
    }
    
    // Update enemies
    const updatedEnemies = enemies.map(enemy => {
      // Simple back-and-forth movement
      let newX = enemy.x + enemy.velocityX;
      let newDirection = enemy.direction;
      let newVelocityX = enemy.velocityX;
      
      // Check for platform edges to make enemies turn around
      const platform = world.platforms.find(p => 
        newX >= p.x && 
        newX + enemy.width <= p.x + p.width && 
        enemy.y + enemy.height <= p.y
      );
      
      if (!platform || newX <= platform.x || newX + enemy.width >= platform.x + platform.width) {
        newDirection = enemy.direction === 'left' ? 'right' : 'left';
        newVelocityX = -enemy.velocityX;
        newX = enemy.x + newVelocityX;
      }
      
      return {
        ...enemy,
        x: newX,
        direction: newDirection,
        velocityX: newVelocityX
      };
    });
    
    setEnemies(updatedEnemies);
    
    // Render the game
    renderGame(ctx, {
      player: updatedPlayer,
      world,
      collectibles,
      enemies: updatedEnemies,
      score,
      health
    });
    
    // Continue the game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [
    canvasRef,
    player,
    setPlayer,
    world,
    collectibles,
    setCollectibles,
    enemies,
    setEnemies,
    health,
    setHealth,
    score,
    setScore,
    gameOver
  ]);
  
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current === null) {
      lastTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);
  
  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);
  
  return { startGameLoop, stopGameLoop };
};