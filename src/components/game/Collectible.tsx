// Collectible.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';

interface CollectibleProps {
  type: 'coin' | 'gem' | 'powerup' | 'health';
  x: number;
  y: number;
  value: number;
  effect?: string;
}

const Collectible: React.FC<CollectibleProps> = ({
  type,
  x,
  y,
  value,
  effect
}) => {
  const collectibleRef = useRef<HTMLDivElement>(null);
  const { gameState, dispatch } = useGameContext();
  const [position] = useState({ x, y });
  const [isCollected, setIsCollected] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [hoverOffset, setHoverOffset] = useState(0);
  
  // Register collectible with game context
  useEffect(() => {
    if (isCollected) return;
    
    dispatch({
      type: 'REGISTER_COLLECTIBLE',
      payload: {
        id: collectibleRef.current?.id || `collectible-${x}-${y}-${type}`,
        bounds: {
          x: position.x,
          y: position.y,
          width: 24,
          height: 24
        },
        type,
        value,
        effect
      }
    });
    
    return () => {
      dispatch({
        type: 'REMOVE_COLLECTIBLE',
        payload: collectibleRef.current?.id || `collectible-${x}-${y}-${type}`
      });
    };
  }, [dispatch, position, type, value, effect, isCollected]);
  
  // Animate the collectible
  useEffect(() => {
    if (!gameState.isRunning || isCollected) return;
    
    // Handle sprite animation
    const spriteInterval = setInterval(() => {
      setAnimationFrame((prevFrame) => (prevFrame + 1) % 8);
    }, 100);
    
    // Handle hover animation
    const hoverInterval = setInterval(() => {
      setHoverOffset((prev) => {
        const newValue = prev + 0.1;
        return newValue > Math.PI * 2 ? 0 : newValue;
      });
    }, 16);
    
    // Check for collision with player
    const collisionInterval = setInterval(() => {
      const playerBounds = gameState.playerState.bounds;
      const collectibleBounds = {
        x: position.x,
        y: position.y,
        width: 24,
        height: 24
      };
      
      // Check for overlap
      if (
        playerBounds.x < collectibleBounds.x + collectibleBounds.width &&
        playerBounds.x + playerBounds.width > collectibleBounds.x &&
        playerBounds.y < collectibleBounds.y + collectibleBounds.height &&
        playerBounds.y + playerBounds.height > collectibleBounds.y
      ) {
        // Trigger collection
        setIsCollected(true);
        
        // Dispatch collection event
        dispatch({
          type: 'COLLECT_ITEM',
          payload: {
            type,
            value,
            effect
          }
        });
        
        // Trigger collection effects
        if (type === 'health') {
          dispatch({
            type: 'UPDATE_PLAYER_HEALTH',
            payload: { change: value, isAbsolute: false }
          });
        } else if (type === 'powerup') {
          dispatch({
            type: 'APPLY_POWERUP',
            payload: { effect, duration: 10000 }
          });
        }
        
        // Show collection animation/particle effect
        dispatch({
          type: 'CREATE_PARTICLE_EFFECT',
          payload: {
            x: position.x + 12,
            y: position.y + 12,
            type: 'collection',
            color: getCollectibleColor(),
            duration: 500
          }
        });
      }
    }, 50);
    
    return () => {
      clearInterval(spriteInterval);
      clearInterval(hoverInterval);
      clearInterval(collisionInterval);
    };
  }, [gameState.isRunning, gameState.playerState.bounds, position, type, value, effect, isCollected, dispatch]);
  
  // Helper to get color for particle effects
  const getCollectibleColor = () => {
    switch (type) {
      case 'coin': return '#FFD700';
      case 'gem': return '#8A2BE2';
      case 'powerup': return '#00FF7F';
      case 'health': return '#FF0000';
      default: return '#FFFFFF';
    }
  };
  
  // Don't render if collected
  if (isCollected) return null;
  
  // Determine vertical offset for hover animation
  const hoverY = Math.sin(hoverOffset) * 5;
  
  return (
    <div
      ref={collectibleRef}
      id={`collectible-${x}-${y}-${type}`}
      className={`collectible ${type}`}
      style={{
        position: 'absolute',
        transform: `translate(${position.x}px, ${position.y + hoverY}px)`,
        width: '24px',
        height: '24px',
        backgroundImage: `url('/assets/sprites/${type}_${animationFrame}.png')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        zIndex: 8
      }}
    />
  );
};

export default Collectible;