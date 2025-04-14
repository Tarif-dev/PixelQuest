import { useRef, useCallback, useEffect } from "react";
import { useGameState } from "./useGameState";
import { updatePlayer } from "../lib/physics";
import { checkCollisions } from "../lib/collision";
import { renderGame } from "../lib/engine";

export const useGameLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const renderPendingRef = useRef<boolean>(false);
  const frameTimesRef = useRef<number[]>([]);

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
    gameOver,
    fps,
    setFps,
  } = useGameState();

  // Keep track of FPS
  useEffect(() => {
    const fpsInterval = setInterval(() => {
      if (frameTimesRef.current.length > 0) {
        const sum = frameTimesRef.current.reduce((a, b) => a + b, 0);
        const avgFrameTime = sum / frameTimesRef.current.length;
        const currentFps = Math.round(1000 / avgFrameTime);
        setFps(currentFps);
        frameTimesRef.current = [];
      }
    }, 1000);

    return () => clearInterval(fpsInterval);
  }, [setFps]);

  const gameLoop = useCallback(
    (time: number) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      if (!ctx) return;

      // Calculate delta time and track for FPS calculation
      const now = performance.now();
      const deltaTime = lastTimeRef.current
        ? (now - lastTimeRef.current) / 1000
        : 1 / 60;
      lastTimeRef.current = now;

      // Add frame time to our tracking array for FPS calculation
      frameTimesRef.current.push(now - time);

      // Clear canvas with a solid color to ensure it's visible
      ctx.fillStyle = "#000022";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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
          setScore(
            score + (collisionResult.collectedItem.type === "gem" ? 100 : 500)
          );
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
      const updatedEnemies = enemies.map((enemy) => {
        // Simple back-and-forth movement
        let newX = enemy.x + enemy.velocityX;
        let newDirection = enemy.direction;
        let newVelocityX = enemy.velocityX;

        // Check for platform edges to make enemies turn around
        const platform = world.platforms.find(
          (p) =>
            newX >= p.x &&
            newX + enemy.width <= p.x + p.width &&
            enemy.y + enemy.height <= p.y
        );

        if (
          !platform ||
          newX <= platform.x ||
          newX + enemy.width >= platform.x + platform.width
        ) {
          newDirection = enemy.direction === "left" ? "right" : "left";
          newVelocityX = -enemy.velocityX;
          newX = enemy.x + newVelocityX;
        }

        return {
          ...enemy,
          x: newX,
          direction: newDirection,
          velocityX: newVelocityX,
        };
      });

      setEnemies(updatedEnemies);

      // Render the game only if we're not already in the middle of rendering
      if (!renderPendingRef.current) {
        renderPendingRef.current = true;

        renderGame(ctx, {
          player: updatedPlayer,
          world,
          collectibles,
          enemies: updatedEnemies,
          score,
          health,
        })
          .then(() => {
            renderPendingRef.current = false;
          })
          .catch((error) => {
            console.error("Error rendering game:", error);
            renderPendingRef.current = false;

            // Fallback rendering if the main rendering fails
            ctx.fillStyle = "#330000"; // Red tint to indicate error
            ctx.fillRect(
              0,
              0,
              canvasRef.current!.width,
              canvasRef.current!.height
            );

            // Render placeholder for player
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Render placeholder for platforms
            ctx.fillStyle = "#7d4e24";
            world.platforms.forEach((platform) => {
              ctx.fillRect(
                platform.x,
                platform.y,
                platform.width,
                platform.height
              );
            });
          });
      }

      // Continue the game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [
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
      gameOver,
    ]
  );

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current === null) {
      console.log("Starting game loop");
      lastTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      console.log("Stopping game loop");
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  return { startGameLoop, stopGameLoop, fps };
};
