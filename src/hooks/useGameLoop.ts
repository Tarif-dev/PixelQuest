import { useRef, useCallback, useEffect, useContext } from "react";
import { useGameState } from "./useGameState";
import { updatePlayer } from "../lib/physics";
import { checkCollisions } from "../lib/collision";
import { renderGame } from "../lib/engine";
import { GameContext } from "../context/GameContext";

export const useGameLoop = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const renderPendingRef = useRef<boolean>(false);
  const frameTimesRef = useRef<number[]>([]);
  const frameCountRef = useRef<number>(0);

  // Access the full GameContext to get levelComplete function
  const gameContext = useContext(GameContext);

  if (!gameContext) {
    throw new Error("useGameLoop must be used within a GameProvider");
  }

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
    playAudio, // Add the playAudio function to play sound effects
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

        // Log debugging info every second
        console.log(
          `FPS: ${currentFps}, Frame count: ${frameCountRef.current}`
        );
        console.log(
          `Player position: (${player.x.toFixed(2)}, ${player.y.toFixed(2)})`
        );

        if (canvasRef.current) {
          console.log(
            `Canvas size: ${canvasRef.current.width}x${canvasRef.current.height}`
          );
        }

        frameCountRef.current = 0;
      }
    }, 1000);

    return () => clearInterval(fpsInterval);
  }, [setFps, player, canvasRef]);

  const gameLoop = useCallback(
    (time: number) => {
      // Increment frame counter for debugging
      frameCountRef.current++;

      // Check if canvas exists
      if (!canvasRef.current) {
        console.warn("Canvas ref is null, skipping frame");
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Get canvas context
      const ctx = canvasRef.current.getContext("2d", { alpha: false });
      if (!ctx) {
        console.warn("Could not get canvas context, skipping frame");
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Calculate delta time and track for FPS calculation
      const now = performance.now();
      const deltaTime = lastTimeRef.current
        ? (now - lastTimeRef.current) / 1000
        : 1 / 60;
      lastTimeRef.current = now;

      // Add frame time to our tracking array for FPS calculation
      if (time > 0) {
        // Avoid adding the first frame
        frameTimesRef.current.push(now - time);
      }

      // Clear canvas with a solid color to ensure it's visible
      ctx.fillStyle = "#000022";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw text to indicate the game is running
      ctx.fillStyle = "#ffffff";
      ctx.font = "16px Arial";
      ctx.fillText(
        `Game loop running - Frame ${frameCountRef.current}`,
        20,
        30
      );
      ctx.fillText(
        `Player: (${Math.round(player.x)}, ${Math.round(player.y)})`,
        20,
        50
      );

      // Update game state
      const updatedPlayer = updatePlayer(player, world, deltaTime);

      // Check if player has fallen out of bounds (into water)
      if (updatedPlayer.outOfBounds || updatedPlayer.y > world.height) {
        console.log("Player fell into water! Game over.");

        // Set health to 0 and trigger game over
        setHealth(0);
        gameOver();

        // Stop the game loop to prevent further updates
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
          gameLoopRef.current = null;
        }

        return; // Exit the game loop immediately
      }

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
          // Play gem collection sound effect
          playAudio("gemCollect");

          // Increase score
          const pointValue =
            collisionResult.collectedItem.type === "special" ? 500 : 100;
          const newScore = score + pointValue;
          setScore(newScore);

          // Check if this is a special collectible which triggers level completion
          if (collisionResult.collectedItem.type === "special") {
            // Trigger level completion
            console.log("Special collectible collected! Level complete!");
            gameContext.levelComplete();

            // Stop the game loop
            if (gameLoopRef.current) {
              cancelAnimationFrame(gameLoopRef.current);
              gameLoopRef.current = null;
            }

            return; // Exit the game loop immediately
          }

          // Alternative: Also trigger level completion if score reaches certain thresholds
          if (score < 1000 && newScore >= 1000) {
            console.log("Score reached 1000! Level complete!");
            gameContext.levelComplete();

            // Stop the game loop
            if (gameLoopRef.current) {
              cancelAnimationFrame(gameLoopRef.current);
              gameLoopRef.current = null;
            }

            return; // Exit the game loop immediately
          }
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

            // Draw error message
            ctx.fillStyle = "#ffffff";
            ctx.font = "20px Arial";
            ctx.fillText("Error rendering game", 20, 100);

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
      } else {
        // If rendering is pending, draw a message
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";
        ctx.fillText("Rendering in progress...", 20, 70);
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
      gameContext,
      playAudio,
    ]
  );

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current === null) {
      console.log("Starting game loop");
      lastTimeRef.current = 0;
      frameCountRef.current = 0;
      frameTimesRef.current = [];
      renderPendingRef.current = false;
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
