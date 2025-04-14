// Platform.tsx
import React, { useEffect, useState, useRef } from "react";

interface PlatformProps {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: string;
  movementRange?: number;
  speed?: number;
  fallDelay?: number;
}

const Platform: React.FC<PlatformProps> = ({
  x,
  y,
  width,
  height,
  type = "normal",
  movementRange = 100,
  speed = 1,
  fallDelay = 500,
}) => {
  const [position, setPosition] = useState({ x, y });
  const [direction, setDirection] = useState(1); // 1 for right/down, -1 for left/up
  const [isFalling, setIsFalling] = useState(false);
  const moveTimer = useRef<number | null>(null);
  const startingPosition = useRef({ x, y });

  // Handle moving platforms
  useEffect(() => {
    if (type !== "moving") return;

    const moveInterval = setInterval(() => {
      setPosition((prev) => {
        // Calculate new position
        const newX = prev.x + speed * direction;

        // Check if we need to change direction
        if (Math.abs(newX - startingPosition.current.x) >= movementRange) {
          setDirection((d) => -d);
          return { ...prev, x: prev.x - speed * direction };
        }

        return { ...prev, x: newX };
      });
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [type, direction, movementRange, speed]);

  // Handle falling platforms
  useEffect(() => {
    if (type !== "falling") return;

    const handleFall = () => {
      setIsFalling(true);

      // Animate the fall
      const fallInterval = setInterval(() => {
        setPosition((prev) => ({
          ...prev,
          y: prev.y + 5, // Fall speed
        }));
      }, 16);

      setTimeout(() => {
        clearInterval(fallInterval);
      }, 2000); // Stop after 2 seconds (out of view)
    };

    // In a real game, we would trigger this when the player lands on the platform
    // For now, we'll just use a timer since this is a simplified example
    if (moveTimer.current) {
      clearTimeout(moveTimer.current);
    }

    // This would actually be triggered by collision detection
    const simulatePlayerLanding = () => {
      moveTimer.current = window.setTimeout(handleFall, fallDelay);
    };

    // This is just for demo purposes; in a real game this would be triggered by collision
    simulatePlayerLanding();

    return () => {
      if (moveTimer.current) {
        clearTimeout(moveTimer.current);
      }
    };
  }, [type, fallDelay]);

  // Choose the right image based on platform type
  const getImagePath = () => {
    switch (type) {
      case "moving":
        return "/assets/sprites/platform_moving.svg";
      case "bouncy":
        return "/assets/sprites/platform_bouncy.svg";
      case "falling":
        return "/assets/sprites/platform_regular.svg"; // Use regular platform for falling
      default:
        return "/assets/sprites/platform_regular.svg";
    }
  };

  // Don't render if the platform has fallen far out of view
  if (isFalling && position.y > 1000) return null;

  return (
    <div
      className={`platform ${type}`}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${getImagePath()})`,
        backgroundSize: "contain",
        backgroundRepeat: "repeat-x",
        imageRendering: "pixelated",
        zIndex: 4,
        transition: isFalling ? "none" : "left 0.1s linear",
      }}
      data-type={type}
    />
  );
};

export default Platform;
