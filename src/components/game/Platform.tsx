// Platform.tsx
import React, { useEffect, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';

interface PlatformProps {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'regular' | 'breakable' | 'moving' | 'bouncy';
  movementPath?: Array<{x: number, y: number}>;
  movementSpeed?: number;
}

const Platform: React.FC<PlatformProps> = ({
  x,
  y,
  width,
  height,
  type = 'regular',
  movementPath = [],
  movementSpeed = 2
}) => {
  const platformRef = useRef<HTMLDivElement>(null);
  const { gameState, dispatch } = useGameContext();
  const [position, setPosition] = React.useState({ x, y });
  const [currentPathIndex, setCurrentPathIndex] = React.useState(0);
  const [platformState, setPlatformState] = React.useState<'normal' | 'breaking' | 'broken'>('normal');
  
  useEffect(() => {
    // Register platform with game context
    dispatch({
      type: 'REGISTER_PLATFORM',
      payload: {
        id: platformRef.current?.id || `platform-${x}-${y}`,
        bounds: {
          x: position.x,
          y: position.y,
          width,
          height
        },
        type,
        properties: {
          isBouncy: type === 'bouncy',
          isBreakable: type === 'breakable',
          isMoving: type === 'moving',
          state: platformState
        }
      }
    });
    
    return () => {
      // Cleanup on unmount
      dispatch({
        type: 'REMOVE_PLATFORM',
        payload: platformRef.current?.id || `platform-${x}-${y}`
      });
    };
  }, [dispatch, position, width, height, type, platformState]);
  
  // Handle moving platforms
  useEffect(() => {
    if (!gameState.isRunning || type !== 'moving' || movementPath.length < 2) return;
    
    const updateMovingPlatform = () => {
      const targetPoint = movementPath[currentPathIndex];
      const dx = targetPoint.x - position.x;
      const dy = targetPoint.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < movementSpeed) {
        // Reached the target point, move to next
        setCurrentPathIndex((currentPathIndex + 1) % movementPath.length);
      } else {
        // Move towards target
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        setPosition({
          x: position.x + dirX * movementSpeed,
          y: position.y + dirY * movementSpeed
        });
      }
    };
    
    const intervalId = setInterval(updateMovingPlatform, 16);
    return () => clearInterval(intervalId);
  }, [gameState.isRunning, type, movementPath, currentPathIndex, position, movementSpeed]);
  
  // Handle breakable platforms
  useEffect(() => {
    if (type !== 'breakable' || platformState === 'broken') return;
    
    // Check for player collision with this platform
    const checkForBreaking = () => {
      const playerBounds = gameState.playerState.bounds;
      const platformBounds = {
        x: position.x,
        y: position.y,
        width,
        height
      };
      
      // If player is standing on this platform and moving down
      if (
        gameState.playerState.velocity.y > 0 &&
        playerBounds.y + playerBounds.height <= platformBounds.y + 5 &&
        playerBounds.y + playerBounds.height >= platformBounds.y - 5 &&
        playerBounds.x + playerBounds.width > platformBounds.x &&
        playerBounds.x < platformBounds.x + platformBounds.width
      ) {
        // Start breaking animation
        setPlatformState('breaking');
        
        // After animation, set to broken
        setTimeout(() => {
          setPlatformState('broken');
        }, 500);
      }
    };
    
    const intervalId = setInterval(checkForBreaking, 100);
    return () => clearInterval(intervalId);
  }, [gameState.playerState.bounds, gameState.playerState.velocity, position, width, height, type, platformState]);
  
  // Choose the right sprite based on platform type and state
  const getBackgroundImage = () => {
    switch (type) {
      case 'regular':
        return "url('/assets/sprites/platform_regular.png')";
      case 'breakable':
        if (platformState === 'normal') return "url('/assets/sprites/platform_breakable.png')";
        if (platformState === 'breaking') return "url('/assets/sprites/platform_breaking.png')";
        return ""; // broken - invisible
      case 'moving':
        return "url('/assets/sprites/platform_moving.png')";
      case 'bouncy':
        return "url('/assets/sprites/platform_bouncy.png')";
      default:
        return "url('/assets/sprites/platform_regular.png')";
    }
  };
  
  // Don't render if platform is broken
  if (type === 'breakable' && platformState === 'broken') return null;
  
  return (
    <div
      ref={platformRef}
      id={`platform-${x}-${y}`}
      className={`platform ${type} ${platformState}`}
      style={{
        position: 'absolute',
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: getBackgroundImage(),
        backgroundSize: type === 'regular' ? '32px 32px' : 'contain',
        backgroundRepeat: type === 'regular' ? 'repeat-x' : 'no-repeat',
        imageRendering: 'pixelated',
        transition: type === 'moving' ? 'transform 0.05s linear' : 'none',
        zIndex: 4
      }}
    />
  );
};

export default Platform;