// Enemy.tsx
import React, { useRef, useEffect, useState } from "react";
import { useGameState } from "../../context/GameContext";

interface EnemyProps {
  id: number;
  initialX: number;
  initialY: number;
  width?: number;
  height?: number;
  type?: "basic" | "patrol" | "chaser";
  patrolDistance?: number;
}

const Enemy: React.FC<EnemyProps> = ({
  id,
  initialX,
  initialY,
  width = 32,
  height = 32,
  type = "basic",
  patrolDistance = 100,
}) => {
  const enemyRef = useRef<HTMLDivElement>(null);
  const { gameStatus, player, world, enemies, setEnemies } = useGameState();

  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [velocity, setVelocity] = useState({ x: 1, y: 0 });
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [state, setState] = useState<"idle" | "moving" | "attacking">("idle");
  const [patrolOrigin] = useState({ x: initialX, y: initialY });

  // Enemy movement and state update
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const updateEnemy = () => {
      // Apply gravity
      let newVelocityY = velocity.y + world.gravity;
      let newVelocityX = velocity.x;

      // Update position based on enemy type
      switch (type) {
        case "basic":
          // Basic enemies just move left and right, turning at edges
          if (position.x <= 0 || position.x + width >= world.width) {
            newVelocityX = -velocity.x;
            setDirection(velocity.x < 0 ? "right" : "left");
          }
          setState("moving");
          break;

        case "patrol":
          // Patrol enemies move back and forth within a defined distance
          if (
            position.x >= patrolOrigin.x + patrolDistance ||
            position.x <= patrolOrigin.x - patrolDistance
          ) {
            newVelocityX = -velocity.x;
            setDirection(velocity.x < 0 ? "right" : "left");
          }
          setState("moving");
          break;

        case "chaser":
          // Chaser enemies move toward the player when in range
          const distanceToPlayer = Math.abs(player.x - position.x);

          if (distanceToPlayer < 200) {
            // Chase the player
            const directionToPlayer = player.x > position.x ? 1 : -1;
            newVelocityX = directionToPlayer * 2; // Faster speed when chasing
            setDirection(directionToPlayer > 0 ? "right" : "left");

            // Attack when very close
            if (distanceToPlayer < 50) {
              setState("attacking");
            } else {
              setState("moving");
            }
          } else {
            // Outside detection range, patrol normally
            if (
              position.x >= patrolOrigin.x + patrolDistance ||
              position.x <= patrolOrigin.x - patrolDistance
            ) {
              newVelocityX = -velocity.x;
              setDirection(velocity.x < 0 ? "right" : "left");
            }
            setState("moving");
          }
          break;
      }

      // Calculate new position
      const newX = position.x + newVelocityX;
      const newY = position.y + newVelocityY;

      // Check for platform collisions
      let isOnGround = false;
      let groundY = newY; // Default to current position if no collision

      for (const platform of world.platforms) {
        // Simple ground check
        const enemyBottom = newY + height;
        if (
          enemyBottom >= platform.y &&
          enemyBottom <= platform.y + 10 &&
          newX + width > platform.x &&
          newX < platform.x + platform.width
        ) {
          isOnGround = true;
          newVelocityY = 0;
          groundY = platform.y;
          break;
        }
      }

      // Update enemy state
      setPosition({ x: newX, y: isOnGround ? groundY - height : newY });
      setVelocity({ x: newVelocityX, y: newVelocityY });

      // Update enemy in game state
      const updatedEnemies = enemies.map((enemy) => {
        if (enemy.id === id) {
          return {
            ...enemy,
            x: newX,
            y: isOnGround ? groundY - height : newY,
            velocityX: newVelocityX,
            direction: direction,
            state: state,
          };
        }
        return enemy;
      });

      setEnemies(updatedEnemies);
    };

    const animationId = requestAnimationFrame(updateEnemy);
    return () => cancelAnimationFrame(animationId);
  }, [
    gameStatus,
    id,
    position,
    velocity,
    direction,
    state,
    type,
    patrolDistance,
    patrolOrigin,
    player,
    world,
    width,
    height,
    enemies,
    setEnemies,
  ]);

  // Determine sprite based on enemy state and direction
  const getEnemySprite = () => {
    // For now, we'll just use the same sprite for all states
    // In a more complete implementation, we would have different sprites
    // for attacking and idle states
    return `/assets/sprites/enemy-${direction}.svg`;
  };

  return (
    <div
      ref={enemyRef}
      className={`enemy ${type} ${state} ${direction}`}
      style={{
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${getEnemySprite()})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 5,
        imageRendering: "pixelated",
        transition: "transform 0.05s linear",
      }}
      data-id={id}
      data-type={type}
    />
  );
};

export default Enemy;
