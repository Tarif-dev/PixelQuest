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

  // Set fixed dimensions immediately on mount
  useEffect(() => {
    if (canvasRef.current) {
      // Set a default size to ensure the canvas is never 0x0
      const defaultWidth = 800;
      const defaultHeight = 600;

      canvasRef.current.width = defaultWidth;
      canvasRef.current.height = defaultHeight;
      setCanvasDimensions({ width: defaultWidth, height: defaultHeight });

      console.log(
        `Set default canvas size to ${defaultWidth}x${defaultHeight}`
      );
    }
  }, []);

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
          // Get the container dimensions
          const width = container.clientWidth || 800;
          const height = container.clientHeight || 600;

          console.log(`Container dimensions: ${width}x${height}`);

          // Only update if dimensions have changed and are not zero
          if (
            (width !== canvasRef.current.width ||
              height !== canvasRef.current.height) &&
            width > 0 &&
            height > 0
          ) {
            console.log(`Canvas resized to ${width}x${height}`);

            // Set canvas dimensions
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            // Store dimensions in state for reference
            setCanvasDimensions({ width, height });
          } else if (width === 0 || height === 0) {
            console.error(
              "Container has zero width or height! Using fallback dimensions."
            );

            // Use fallback dimensions
            const fallbackWidth = 800;
            const fallbackHeight = 600;
            canvasRef.current.width = fallbackWidth;
            canvasRef.current.height = fallbackHeight;
            setCanvasDimensions({
              width: fallbackWidth,
              height: fallbackHeight,
            });
          }
        } else {
          console.error(
            "Canvas parent element not found, using default dimensions"
          );
          const defaultWidth = 800;
          const defaultHeight = 600;

          canvasRef.current.width = defaultWidth;
          canvasRef.current.height = defaultHeight;
          setCanvasDimensions({ width: defaultWidth, height: defaultHeight });
        }
      }
    };

    // Initial size setup
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Also set a timeout to handle any delayed layout calculations
    const resizeTimer = setTimeout(handleResize, 500);

    // Set another timeout for a final check after everything has loaded
    const finalCheckTimer = setTimeout(() => {
      handleResize();
      console.log("Final canvas size check completed");
    }, 2000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      clearTimeout(finalCheckTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-black z-0"
      style={{
        display: "block",
        minWidth: "800px",
        minHeight: "600px",
      }}
      data-testid="game-canvas"
      aria-label="Game canvas"
      width={800}
      height={600}
    />
  );
};

export default Canvas;
