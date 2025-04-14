// Collectible.tsx
import React, { useState, useEffect } from "react";

interface CollectibleProps {
  id: number;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
}

const Collectible: React.FC<CollectibleProps> = ({
  id,
  type,
  x,
  y,
  width,
  height,
  collected,
}) => {
  const [hoverOffset, setHoverOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Handle hover animation
  useEffect(() => {
    if (collected) {
      setIsVisible(false);
      return;
    }

    const hoverInterval = setInterval(() => {
      setHoverOffset((prev) => {
        const newValue = prev + 0.1;
        return newValue > Math.PI * 2 ? 0 : newValue;
      });
    }, 16);

    return () => {
      clearInterval(hoverInterval);
    };
  }, [collected]);

  // Don't render if collected or not visible
  if (!isVisible) return null;

  // Determine vertical offset for hover animation
  const hoverY = Math.sin(hoverOffset) * 3;

  // Get the appropriate image path based on the collectible type
  const getImagePath = () => {
    switch (type) {
      case "gem-red":
        return "/assets/sprites/gem-red.svg";
      case "gem-blue":
        return "/assets/sprites/gem-blue.svg";
      case "gem-green":
        return "/assets/sprites/gem-green.svg";
      case "powerup-star":
        return "/assets/sprites/powerup-star.svg";
      case "powerup-shield":
        return "/assets/sprites/powerup-shield.svg";
      case "powerup-speed":
        return "/assets/sprites/powerup-speed.svg";
      case "special":
        return "/assets/sprites/special-item.svg";
      case "gem":
      default:
        return "/assets/sprites/gem.svg";
    }
  };

  return (
    <div
      className={`collectible ${type}`}
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y + hoverY}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: `url(${getImagePath()})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        zIndex: 8,
      }}
      data-id={id}
      data-type={type}
    />
  );
};

export default Collectible;
