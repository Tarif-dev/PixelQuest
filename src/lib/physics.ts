import { Player, World } from "../types/game";

export const updatePlayer = (
  player: Player,
  world: World,
  deltaTime: number
): Player => {
  // Apply gravity
  let newVelocityY = player.velocityY + world.gravity;

  // Determine if player is in the air
  const inAir = player.isJumping;

  // Apply horizontal friction (reduced in mid-air)
  let newVelocityX = player.velocityX;
  const airFrictionFactor = 0.2; // Air has much less friction

  const appliedFriction = inAir
    ? world.friction * airFrictionFactor
    : world.friction;

  if (player.velocityX > 0) {
    newVelocityX = Math.max(0, player.velocityX - appliedFriction);
  } else if (player.velocityX < 0) {
    newVelocityX = Math.min(0, player.velocityX + appliedFriction);
  }

  // Calculate new position
  let newX = player.x + newVelocityX;
  let newY = player.y + newVelocityY;

  // Check world boundaries
  if (newX < 0) {
    newX = 0;
    newVelocityX = 0;
  } else if (newX + player.width > world.width) {
    newX = world.width - player.width;
    newVelocityX = 0;
  }

  // Bottom world boundary (game over condition)
  if (newY > world.height) {
    // Don't adjust position - let the game loop detect this and trigger game over
    // Just set this flag so we can detect it in the game loop
    const playerOutOfBounds = true;
    return {
      ...player,
      x: newX,
      y: newY, // Keep the actual position beyond boundary
      velocityX: newVelocityX,
      velocityY: newVelocityY,
      isJumping: true,
      state: "jumping",
      outOfBounds: playerOutOfBounds, // Add this flag to detect in game loop
    };
  }

  // Check platform collisions
  let isOnGround = false;

  for (const platform of world.platforms) {
    // Check if player is landing on top of platform
    if (
      player.y + player.height <= platform.y &&
      newY + player.height >= platform.y &&
      newX + player.width > platform.x &&
      newX < platform.x + platform.width
    ) {
      newY = platform.y - player.height;
      newVelocityY = 0;
      isOnGround = true;
    }

    // Check if player hits platform from below
    else if (
      player.y >= platform.y + platform.height &&
      newY <= platform.y + platform.height &&
      newX + player.width > platform.x &&
      newX < platform.x + platform.width
    ) {
      newY = platform.y + platform.height;
      newVelocityY = 0;
    }

    // Check if player hits platform from the side
    else if (
      newY + player.height > platform.y &&
      newY < platform.y + platform.height
    ) {
      // Hitting from left
      if (
        player.x + player.width <= platform.x &&
        newX + player.width >= platform.x
      ) {
        newX = platform.x - player.width;
        newVelocityX = 0;
      }
      // Hitting from right
      else if (
        player.x >= platform.x + platform.width &&
        newX <= platform.x + platform.width
      ) {
        newX = platform.x + platform.width;
        newVelocityX = 0;
      }
    }
  }

  // Update player state based on movement
  let newState = player.state;
  if (!isOnGround) {
    newState = "jumping";
  } else if (Math.abs(newVelocityX) > 0.1) {
    newState = "running";
  } else {
    newState = "idle";
  }

  return {
    ...player,
    x: newX,
    y: newY,
    velocityX: newVelocityX,
    velocityY: newVelocityY,
    isJumping: !isOnGround,
    state: newState,
  };
};
