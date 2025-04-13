import { useEffect } from "react";
import { useGameState } from "./useGameState";
import { GameStatus, Player } from "../types/game";

interface KeyState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export const usePlayerControls = (): void => {
  const { gameStatus, player, setPlayer } = useGameState();

  useEffect(() => {
    const keys: KeyState = {
      left: false,
      right: false,
      jump: false,
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (gameStatus !== "playing") return;

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keys.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keys.right = true;
      }
      if (
        e.key === "ArrowUp" ||
        e.key === "w" ||
        e.key === "W" ||
        e.key === " "
      ) {
        keys.jump = true;
      }

      updatePlayerVelocity();
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keys.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keys.right = false;
      }
      if (
        e.key === "ArrowUp" ||
        e.key === "w" ||
        e.key === "W" ||
        e.key === " "
      ) {
        keys.jump = false;
      }

      updatePlayerVelocity();
    };

    const updatePlayerVelocity = (): void => {
      // Only update if we're playing
      if (gameStatus !== "playing") return;

      const moveSpeed = 5;
      const jumpForce = -12;

      let newVelocityX = 0;
      if (keys.left) newVelocityX -= moveSpeed;
      if (keys.right) newVelocityX += moveSpeed;

      let newState: Player["state"] = "idle";
      let newDirection: Player["direction"] = player.direction;

      if (newVelocityX < 0) {
        newState = "running";
        newDirection = "left";
      } else if (newVelocityX > 0) {
        newState = "running";
        newDirection = "right";
      }

      if (player.isJumping) {
        newState = "jumping";
      }

      setPlayer((prev: Player) => ({
        ...prev,
        velocityX: newVelocityX,
        velocityY: keys.jump && !prev.isJumping ? jumpForce : prev.velocityY,
        isJumping: keys.jump ? true : prev.isJumping,
        state: newState,
        direction: newDirection,
      }));
    };

    // Add touch controls for mobile
    const handleTouchStart = (e: TouchEvent): void => {
      const touch = e.touches[0];
      const screenWidth = window.innerWidth;

      // Simple implementation - left third of screen is left, right third is right, middle is jump
      if (touch.clientX < screenWidth / 3) {
        keys.left = true;
      } else if (touch.clientX > (screenWidth * 2) / 3) {
        keys.right = true;
      } else {
        keys.jump = true;
      }

      updatePlayerVelocity();
    };

    const handleTouchEnd = (): void => {
      keys.left = false;
      keys.right = false;
      keys.jump = false;

      updatePlayerVelocity();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameStatus, player, setPlayer]);
};
