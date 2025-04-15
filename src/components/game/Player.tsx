// Player.tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useGameState } from "../../context/GameContext";
import { Platform, Enemy } from "../../types/game"; // Import the proper types

interface PlayerProps {
  width?: number;
  height?: number;
}

const Player: React.FC<PlayerProps> = ({ width = 32, height = 48 }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const {
    player,
    setPlayer,
    world,
    gameStatus,
    collectibles,
    setCollectibles,
    score,
    setScore,
    health,
    setHealth,
    enemies,
    setEnemies,
    levelComplete,
  } = useGameState();

  const [jumpPressed, setJumpPressed] = useState(false);
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [invulnerable, setInvulnerable] = useState(false);

  // Keyboard input handling - set up regardless of game status
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === " " || e.key === "w") {
        setJumpPressed(true);
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        setLeftPressed(true);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setRightPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === " " || e.key === "w") {
        setJumpPressed(false);
      }
      if (e.key === "ArrowLeft" || e.key === "a") {
        setLeftPressed(false);
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setRightPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Make player invulnerable temporarily after taking damage
  const makeInvulnerable = useCallback(() => {
    setInvulnerable(true);
    setTimeout(() => {
      setInvulnerable(false);
    }, 1000); // 1 second invulnerability
  }, []);

  // Player physics and movement
  useEffect(() => {
    if (gameStatus !== "playing") return;

    const updatePlayer = () => {
      // Get current player state
      const { x, y, velocityX, velocityY, isJumping, direction, state } =
        player;

      // Movement constants
      const moveSpeed = 5;
      const jumpForce = 12;
      const gravity = world.gravity;
      const friction = world.friction;

      // Calculate horizontal movement
      let newVelocityX = velocityX * friction;
      let newDirection = direction;
      let newState: "idle" | "running" | "jumping" = "idle";

      if (leftPressed) {
        newVelocityX = -moveSpeed;
        newDirection = "left";
        newState = "running";
      } else if (rightPressed) {
        newVelocityX = moveSpeed;
        newDirection = "right";
        newState = "running";
      }

      // Calculate vertical movement
      let newVelocityY = velocityY + gravity;
      let newIsJumping = isJumping;

      // Check for jumping
      if (jumpPressed && !isJumping) {
        newVelocityY = -jumpForce;
        newIsJumping = true;
        newState = "jumping";
      }

      // Calculate new position
      let newX = x + newVelocityX;
      let newY = y + newVelocityY;

      // Check for platform collisions
      const onPlatform = checkPlatformCollisions(
        newX,
        newY,
        width,
        height,
        newVelocityY
      );

      if (onPlatform) {
        newY = onPlatform.y - height;
        newVelocityY = 0;
        newIsJumping = false;

        // Handle moving platforms - move player with the platform
        if (onPlatform.type === "moving" && onPlatform.speed) {
          // Calculate the platform's movement instead of accessing velocityX directly
          // For simplicity, we can use the platform's speed as a substitute
          newX += onPlatform.speed * (onPlatform.movementRange ? 1 : 0);
        }

        // Handle bouncy platforms
        if (onPlatform.type === "bouncy") {
          newVelocityY = -jumpForce * 1.5;
          newIsJumping = true;
        }

        // Handle falling platforms - logic would be handled by platform component
      }

      // Check for collectible collisions
      checkCollectibleCollisions(newX, newY, width, height);

      // Check for enemy collisions if not invulnerable
      if (!invulnerable) {
        checkEnemyCollisions(newX, newY, width, height);
      }

      // Check for special item (level complete)
      checkLevelComplete(newX, newY, width, height);

      // Check world boundaries
      if (newX < 0) newX = 0;
      if (newX > world.width - width) newX = world.width - width;

      // If player falls below world, reduce health and reset
      if (newY > world.height) {
        setHealth(Math.max(0, health - 20)); // Reduce health on fall, ensure it doesn't go below 0
        makeInvulnerable();

        // Reset position
        newX = 100;
        newY = 200;
        newVelocityX = 0;
        newVelocityY = 0;
      }

      // Update player state
      if (newIsJumping) {
        newState = "jumping";
      }

      setPlayer({
        x: newX,
        y: newY,
        velocityX: newVelocityX,
        velocityY: newVelocityY,
        isJumping: newIsJumping,
        direction: newDirection,
        state: newState,
        width,
        height,
      });
    };

    // Check for platform collisions
    const checkPlatformCollisions = (
      x: number,
      y: number,
      width: number,
      height: number,
      velocityY: number
    ): Platform | null => {
      // Only check for collisions when moving down
      if (velocityY < 0) return null;

      const playerFeet = y + height;
      const playerLeft = x;
      const playerRight = x + width;

      // Check each platform
      for (const platform of world.platforms) {
        const platformTop = platform.y;
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;

        // Check if player's feet are within platform y-range for collision
        const withinYRange =
          playerFeet >= platformTop && playerFeet <= platformTop + 10;

        // Check if player is horizontally within platform
        const withinXRange =
          playerRight > platformLeft && playerLeft < platformRight;

        if (withinYRange && withinXRange) {
          return platform;
        }
      }

      return null;
    };

    // Check for collectible collisions
    const checkCollectibleCollisions = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      let hasChanges = false;
      const updatedCollectibles = collectibles.map((collectible) => {
        if (collectible.collected) return collectible;

        const collision = isColliding(
          { x, y, width, height },
          {
            x: collectible.x,
            y: collectible.y,
            width: collectible.width,
            height: collectible.height,
          }
        );

        if (collision) {
          hasChanges = true;

          // Apply collectible effects
          if (collectible.type.includes("gem")) {
            setScore(score + 10);
          } else if (collectible.type === "powerup-speed") {
            // Speed powerup logic would go here
            // Could set a temporary speed boost flag
          } else if (collectible.type === "powerup-shield") {
            // Shield powerup logic
            makeInvulnerable();
            setScore(score + 25);
          } else if (collectible.type === "powerup-star") {
            setScore(score + 50);
          }

          return { ...collectible, collected: true };
        }

        return collectible;
      });

      if (hasChanges) {
        setCollectibles(updatedCollectibles);
      }
    };

    // Check for enemy collisions
    const checkEnemyCollisions = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      let defeatedEnemy = false;
      const updatedEnemies = enemies.map((enemy) => {
        const collision = isColliding(
          { x, y, width, height },
          {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height,
          }
        );

        if (collision) {
          // Check if player is above enemy (jumping on them)
          const playerBottom = y + height;
          const enemyTop = enemy.y;

          if (playerBottom < enemyTop + 10 && player.velocityY > 0) {
            // Player jumped on enemy - mark enemy as defeated
            defeatedEnemy = true;
            setScore(score + 25);

            // Return updated enemy object - use "idle" state as it's one of the valid enemy states
            return {
              ...enemy,
              state: "idle" as const,
            };
          } else {
            // Player collided with enemy - take damage
            setHealth(Math.max(0, health - 10)); // Ensure health doesn't go below 0
            makeInvulnerable();

            // Knock player back
            const knockbackDirection = player.direction === "right" ? -5 : 5;
            setPlayer({
              ...player,
              velocityX: knockbackDirection,
              velocityY: -5,
            });
          }
        }

        return enemy;
      });

      if (defeatedEnemy) {
        // Apply the bounce from defeating an enemy
        setPlayer({
          ...player,
          velocityY: -8, // Stronger bounce when defeating an enemy
          isJumping: true,
        });

        // Update enemies list to reflect defeat
        setEnemies(updatedEnemies);
      }
    };

    // Check for level complete (special item)
    const checkLevelComplete = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const specialItem = collectibles.find((item) => item.type === "special");

      if (specialItem && !specialItem.collected) {
        const collision = isColliding(
          { x, y, width, height },
          {
            x: specialItem.x,
            y: specialItem.y,
            width: specialItem.width,
            height: specialItem.height,
          }
        );

        if (collision) {
          // Player collected the special item - level complete!
          const updatedCollectibles = collectibles.map((item) =>
            item.id === specialItem.id ? { ...item, collected: true } : item
          );

          setCollectibles(updatedCollectibles);
          setScore(score + 100);

          // Trigger level complete after a short delay
          setTimeout(() => {
            levelComplete();
          }, 500);
        }
      }
    };

    // Helper function to check collision between two rectangular objects
    const isColliding = (rect1: any, rect2: any) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    const animationId = requestAnimationFrame(updatePlayer);
    return () => cancelAnimationFrame(animationId);
  }, [
    player,
    setPlayer,
    world,
    gameStatus,
    jumpPressed,
    leftPressed,
    rightPressed,
    collectibles,
    setCollectibles,
    score,
    setScore,
    health,
    setHealth,
    enemies,
    setEnemies,
    levelComplete,
    invulnerable,
    makeInvulnerable,
  ]);

  // Determine the correct sprite image based on player state and direction
  const getPlayerSprite = () => {
    const { state, direction } = player;

    switch (state) {
      case "running":
        return `/assets/sprites/player-run-${direction}.svg`;
      case "jumping":
        return `/assets/sprites/player-jump-${direction}.svg`;
      case "idle":
      default:
        return `/assets/sprites/player-idle-${direction}.svg`;
    }
  };

  return (
    <div
      ref={playerRef}
      className={`player ${player.state} ${player.direction} ${
        invulnerable ? "invulnerable" : ""
      }`}
      style={{
        position: "absolute",
        transform: `translate(${player.x}px, ${player.y}px)`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${getPlayerSprite()})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 10,
        imageRendering: "pixelated",
        transition: "transform 0.05s linear",
        opacity: invulnerable
          ? Math.floor(Date.now() / 100) % 2 === 0
            ? 0.7
            : 1
          : 1, // Flashing effect when invulnerable
      }}
    >
      {/* Health bar */}
      <div
        className="player-health"
        style={{
          position: "absolute",
          top: "-10px",
          left: "0",
          width: "100%",
          height: "4px",
          backgroundColor: "#333",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${health}%`,
            height: "100%",
            backgroundColor:
              health > 50 ? "#44ff44" : health > 25 ? "#ffff00" : "#ff4444",
            transition: "width 0.3s, background-color 0.3s",
          }}
        />
      </div>
    </div>
  );
};

export default Player;
