// Enemy.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';

interface EnemyProps {
  type: 'patrol' | 'chaser' | 'shooter';
  initialX: number;
  initialY: number;
  patrolPoints?: Array<{x: number, y: number}>;
}

const Enemy: React.FC<EnemyProps> = ({ 
  type, 
  initialX, 
  initialY, 
  patrolPoints = [] 
}) => {
  const enemyRef = useRef<HTMLDivElement>(null);
  const { gameState, dispatch } = useGameContext();
  
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [animation, setAnimation] = useState<'idle' | 'walk' | 'attack'>('idle');
  const [health, setHealth] = useState(100);
  const [currentPatrolIndex, setCurrentPatrolIndex] = useState(0);
  
  // Enemy AI and movement logic
  useEffect(() => {
    if (!gameState.isRunning) return;
    
    const updateEnemy = () => {
      // Different behavior based on enemy type
      switch (type) {
        case 'patrol':
          // Patrol between defined points
          if (patrolPoints.length > 1) {
            const targetPoint = patrolPoints[currentPatrolIndex];
            const dx = targetPoint.x - position.x;
            
            // Set direction based on movement
            setDirection(dx > 0 ? 'right' : 'left');
            
            // Move towards target
            const moveSpeed = 2;
            const newVelocityX = Math.abs(dx) < moveSpeed ? dx : Math.sign(dx) * moveSpeed;
            
            // Update patrol point if reached destination
            if (Math.abs(dx) < 5) {
              setCurrentPatrolIndex((currentPatrolIndex + 1) % patrolPoints.length);
            }
            
            setVelocity({ x: newVelocityX, y: velocity.y });
            setAnimation(Math.abs(newVelocityX) > 0.1 ? 'walk' : 'idle');
          }
          break;
          
        case 'chaser':
          // Chase player if within detection range
          const playerPos = gameState.playerState.position;
          const distanceToPlayer = Math.sqrt(
            Math.pow(playerPos.x - position.x, 2) + 
            Math.pow(playerPos.y - position.y, 2)
          );
          
          if (distanceToPlayer < 200) { // Detection radius
            const dx = playerPos.x - position.x;
            setDirection(dx > 0 ? 'right' : 'left');
            
            // Chase behavior
            const chaseSpeed = 3;
            const newVelocityX = Math.sign(dx) * chaseSpeed;
            
            // Attack if very close
            if (distanceToPlayer < 50) {
              setAnimation('attack');
            } else {
              setAnimation('walk');
            }
            
            setVelocity({ x: newVelocityX, y: velocity.y });
          } else {
            // Return to idle when player out of range
            setAnimation('idle');
            setVelocity({ x: 0, y: velocity.y });
          }
          break;
          
        case 'shooter':
          // Similar to chaser but maintains distance and "shoots"
          const shooterPlayerPos = gameState.playerState.position;
          const shooterDistance = Math.sqrt(
            Math.pow(shooterPlayerPos.x - position.x, 2) + 
            Math.pow(shooterPlayerPos.y - position.y, 2)
          );
          
          if (shooterDistance < 300) { // Detection radius
            const dx = shooterPlayerPos.x - position.x;
            setDirection(dx > 0 ? 'right' : 'left');
            
            // Maintain optimal distance
            const optimalDistance = 150;
            let newVelocityX = 0;
            
            if (shooterDistance < optimalDistance - 20) {
              // Too close, back away
              newVelocityX = -Math.sign(dx) * 2;
              setAnimation('walk');
            } else if (shooterDistance > optimalDistance + 20) {
              // Too far, move closer
              newVelocityX = Math.sign(dx) * 2;
              setAnimation('walk');
            } else {
              // At good range, attack
              newVelocityX = 0;
              setAnimation('attack');
              
              // "Shoot" logic - could dispatch projectile creation here
              if (gameState.frameCount % 60 === 0) { // Shoot every 60 frames (1 second at 60fps)
                // Create projectile
                dispatch({
                  type: 'CREATE_PROJECTILE',
                  payload: {
                    x: position.x + (direction === 'right' ? 20 : -20),
                    y: position.y + 20,
                    velocityX: direction === 'right' ? 8 : -8,
                    velocityY: 0,
                    source: 'enemy',
                    damage: 10
                  }
                });
              }
            }
            
            setVelocity({ x: newVelocityX, y: velocity.y });
          } else {
            // Return to idle when player out of range
            setAnimation('idle');
            setVelocity({ x: 0, y: velocity.y });
          }
          break;
      }
      
      // Apply gravity
      const newVelocityY = Math.min(12, velocity.y + 0.7);
      
      // Update position
      setPosition({ 
        x: position.x + velocity.x, 
        y: position.y + newVelocityY 
      });
      
      setVelocity({ x: velocity.x, y: newVelocityY });
      
      // Update collision bounds in the game state
      dispatch({
        type: 'UPDATE_ENEMY',
        payload: {
          id: enemyRef.current?.id || 'enemy',
          bounds: {
            x: position.x,
            y: position.y,
            width: 32,
            height: 48
          },
          type,
          health
        }
      });
    };
    
    const animationId = requestAnimationFrame(updateEnemy);
    return () => cancelAnimationFrame(animationId);
  }, [
    gameState.isRunning,
    gameState.playerState.position,
    gameState.frameCount,
    position,
    velocity,
    type,
    patrolPoints,
    currentPatrolIndex,
    direction,
    health,
    dispatch
  ]);
  
  return (
    <div 
      ref={enemyRef}
      id={`enemy-${initialX}-${initialY}`}
      className={`enemy ${type} ${animation} ${direction}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: '32px',
        height: '48px',
        position: 'absolute',
        backgroundImage: `url('/assets/sprites/enemy_${type}_${animation}.png')`,
        backgroundPosition: '0 0',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.05s linear',
        imageRendering: 'pixelated',
        zIndex: 5
      }}
    >
      {/* Health bar */}
      <div className="enemy-health" style={{
        position: 'absolute',
        top: '-10px',
        left: '0',
        width: '100%',
        height: '3px',
        backgroundColor: '#333',
        borderRadius: '1px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${health}%`,
          height: '100%',
          backgroundColor: '#ff4444',
          transition: 'width 0.2s'
        }} />
      </div>
    </div>
  );
};

export default Enemy;