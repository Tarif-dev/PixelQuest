import { Player, World } from '../types/game';

export const updatePlayer = (
  player: Player,
  world: World,
  deltaTime: number
): Player => {
  // Apply gravity
 let newVelocityY = player.velocityY + world.gravity;
  
  // Apply horizontal friction
  let newVelocityX = player.velocityX;
  if (player.velocityX > 0) {
    newVelocityX = Math.max(0, player.velocityX - world.friction);
  } else if (player.velocityX < 0) {
    newVelocityX = Math.min(0, player.velocityX + world.friction);
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
  
  // Bottom world boundary (could be a game over condition)
  if (newY > world.height) {
    newY = world.height;
    newVelocityY = 0;
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
    newState = 'jumping';
  } else if (Math.abs(newVelocityX) > 0.1) {
    newState = 'running';
  } else {
    newState = 'idle';
  }
  
  return {
    ...player,
    x: newX,
    y: newY,
    velocityX: newVelocityX,
    velocityY: newVelocityY,
    isJumping: !isOnGround,
    state: newState
  };
};