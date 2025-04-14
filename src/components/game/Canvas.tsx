import { useRef, useEffect, useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { useGameLoop } from "../../hooks/useGameLoop";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameStatus, player, world, collectibles, enemies } = useGameState();
  const { startGameLoop, stopGameLoop } = useGameLoop(canvasRef);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Debug logging for first render
  useEffect(() => {
    console.log("Canvas component mounted");
    console.log("Initial game status:", gameStatus);
    console.log("World dimensions:", world.width, "x", world.height);
    console.log("Player initial position:", player.x, player.y);
    console.log("Number of platforms:", world.platforms.length);
    console.log("Number of collectibles:", collectibles.length);
    console.log("Number of enemies:", enemies.length);
  }, [gameStatus, world, player, collectibles, enemies]);

  // Start/stop game loop based on game status
  useEffect(() => {
    console.log("Game status changed to:", gameStatus);

    if (gameStatus === "playing") {
      console.log("Starting game loop");
      startGameLoop();
    } else {
      console.log("Stopping game loop");
      stopGameLoop();
    }

    return () => {
      console.log("Cleaning up game loop");
      stopGameLoop();
    };
  }, [gameStatus, startGameLoop, stopGameLoop]);

  // Adjust canvas size on resize and initial render
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = container.clientHeight;

          // Only update if dimensions have changed
          if (
            width !== canvasRef.current.width ||
            height !== canvasRef.current.height
          ) {
            console.log(`Canvas resized to ${width}x${height}`);
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            setCanvasDimensions({ width, height });
          }
        }
      }
    };

    // Initial size setup
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Also set a timeout to handle any delayed layout calculations
    const resizeTimer = setTimeout(handleResize, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-black"
      data-testid="game-canvas"
      aria-label="Game canvas"
    />
  );
};

export default Canvas;
