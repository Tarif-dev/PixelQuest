// collision.ts
import {
  GameObject,
  PlayerState,
  Bounds,
  PlatformType,
  Player,
  Platform,
  Collectible,
  Enemy,
  CollisionResult,
} from "../types/game";

// Check collision between two rectangular bounds
export const checkCollision = (a: Bounds, b: Bounds): boolean => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};

// Direction of collision
export enum CollisionDirection {
  NONE,
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

// Get the direction of collision between two objects
export const getCollisionDirection = (
  movingObject: Bounds,
  staticObject: Bounds,
  velocity: { x: number; y: number }
): CollisionDirection => {
  // Calculate the overlap on each axis
  const overlapX = Math.min(
    movingObject.x + movingObject.width - staticObject.x,
    staticObject.x + staticObject.width - movingObject.x
  );

  const overlapY = Math.min(
    movingObject.y + movingObject.height - staticObject.y,
    staticObject.y + staticObject.height - movingObject.y
  );

  // If there's more overlap on the X axis, the collision is happening on the Y axis
  // and vice versa
  if (overlapX < overlapY) {
    return velocity.x > 0 ? CollisionDirection.RIGHT : CollisionDirection.LEFT;
  } else {
    return velocity.y > 0 ? CollisionDirection.BOTTOM : CollisionDirection.TOP;
  }
};

// Check if player is standing on a platform
export const isPlayerOnPlatform = (
  player: PlayerState,
  platform: GameObject & { type: PlatformType }
): boolean => {
  const playerBottom = player.bounds.y + player.bounds.height;
  const platformTop = platform.bounds.y;

  // Player is within 5 pixels of the platform top
  const verticalMatch = Math.abs(playerBottom - platformTop) < 5;

  // Horizontal overlap check
  const horizontalOverlap =
    player.bounds.x + player.bounds.width > platform.bounds.x &&
    player.bounds.x < platform.bounds.x + platform.bounds.width;

  // Player is moving downward (falling or standing)
  const isMovingDown = player.velocity.y >= 0;

  return verticalMatch && horizontalOverlap && isMovingDown;
};

// Handle collision response between player and platforms
export const handlePlatformCollision = (
  playerState: PlayerState,
  platforms: Array<GameObject & { type: PlatformType; properties?: any }>,
  deltaTime: number
): PlayerState => {
  let updatedPlayer = { ...playerState };
  let onPlatform = false;

  platforms.forEach((platform) => {
    // Skip non-active platforms (e.g. broken platforms)
    if (platform.properties?.state === "broken") return;

    if (checkCollision(updatedPlayer.bounds, platform.bounds)) {
      const direction = getCollisionDirection(
        updatedPlayer.bounds,
        platform.bounds,
        updatedPlayer.velocity
      );

      switch (direction) {
        case CollisionDirection.TOP:
          // Player landed on top of platform
          updatedPlayer.bounds.y =
            platform.bounds.y - updatedPlayer.bounds.height;
          updatedPlayer.velocity.y = 0;
          onPlatform = true;

          // Handle special platform types
          if (platform.properties?.isBouncy) {
            // Bouncy platform - bounce the player up
            updatedPlayer.velocity.y = -20; // Higher bounce
            onPlatform = false;
          }
          break;

        case CollisionDirection.BOTTOM:
          // Player hit platform from below
          updatedPlayer.bounds.y = platform.bounds.y + platform.bounds.height;
          updatedPlayer.velocity.y = 0.1; // Small downward velocity
          break;

        case CollisionDirection.LEFT:
          // Player hit right side of platform
          updatedPlayer.bounds.x = platform.bounds.x + platform.bounds.width;
          updatedPlayer.velocity.x = 0;
          break;

        case CollisionDirection.RIGHT:
          // Player hit left side of platform
          updatedPlayer.bounds.x =
            platform.bounds.x - updatedPlayer.bounds.width;
          updatedPlayer.velocity.x = 0;
          break;
      }
    }

    // Check if player is on a moving platform
    if (
      platform.properties?.isMoving &&
      isPlayerOnPlatform(updatedPlayer, platform)
    ) {
      // Apply platform movement to player
      if (platform.velocity) {
        updatedPlayer.bounds.x += platform.velocity.x * deltaTime;
      }
    }
  });

  // Update grounded state
  updatedPlayer.isGrounded = onPlatform;

  return updatedPlayer;
};

// Handle collision with enemies
export const handleEnemyCollision = (
  playerState: PlayerState,
  enemies: Array<GameObject & { type: string }>,
  timeInvulnerable: number
): {
  updatedPlayer: PlayerState;
  damageDealt: number;
  defeatedEnemies: Array<string>;
} => {
  let updatedPlayer = { ...playerState };
  let damageDealt = 0;
  const defeatedEnemies: Array<string> = [];

  // Skip if player is currently invulnerable
  if (updatedPlayer.invulnerableUntil > Date.now()) {
    return { updatedPlayer, damageDealt, defeatedEnemies };
  }

  enemies.forEach((enemy) => {
    if (checkCollision(updatedPlayer.bounds, enemy.bounds)) {
      const direction = getCollisionDirection(
        updatedPlayer.bounds,
        enemy.bounds,
        updatedPlayer.velocity
      );

      // Player is jumping on top of enemy
      if (
        direction === CollisionDirection.BOTTOM &&
        updatedPlayer.velocity.y > 0
      ) {
        // Bounce off enemy
        updatedPlayer.velocity.y = -12;

        // Defeat enemy
        defeatedEnemies.push(enemy.id);
        damageDealt = 0; // No damage to player
      } else {
        // Player collided with enemy from other direction - take damage
        damageDealt = 10; // Default damage amount
        updatedPlayer.health -= damageDealt;

        // Apply knockback
        const knockbackDirection =
          direction === CollisionDirection.LEFT ? -1 : 1;
        updatedPlayer.velocity.x = knockbackDirection * 10;
        updatedPlayer.velocity.y = -5;

        // Set invulnerability period
        updatedPlayer.invulnerableUntil = Date.now() + timeInvulnerable;
      }
    }
  });

  return { updatedPlayer, damageDealt, defeatedEnemies };
};

// Handle collision with collectibles
export const handleCollectibleCollision = (
  playerState: PlayerState,
  collectibles: Array<
    GameObject & { type: string; value: number; effect?: string }
  >
): {
  updatedPlayer: PlayerState;
  collectedItems: Array<{
    id: string;
    type: string;
    value: number;
    effect?: string;
  }>;
} => {
  let updatedPlayer = { ...playerState };
  const collectedItems: Array<{
    id: string;
    type: string;
    value: number;
    effect?: string;
  }> = [];

  collectibles.forEach((item) => {
    if (checkCollision(updatedPlayer.bounds, item.bounds)) {
      // Apply immediate effects
      if (item.type === "health") {
        updatedPlayer.health = Math.min(100, updatedPlayer.health + item.value);
      }

      // Add to collected items
      collectedItems.push({
        id: item.id,
        type: item.type,
        value: item.value,
        effect: item.effect,
      });
    }
  });

  return { updatedPlayer, collectedItems };
};

// Handle world boundaries
export const enforceWorldBoundaries = (
  playerState: PlayerState,
  worldBounds: { width: number; height: number }
): PlayerState => {
  let updatedPlayer = { ...playerState };

  // Left boundary
  if (updatedPlayer.bounds.x < 0) {
    updatedPlayer.bounds.x = 0;
    updatedPlayer.velocity.x = 0;
  }

  // Right boundary
  if (updatedPlayer.bounds.x + updatedPlayer.bounds.width > worldBounds.width) {
    updatedPlayer.bounds.x = worldBounds.width - updatedPlayer.bounds.width;
    updatedPlayer.velocity.x = 0;
  }

  // Top boundary (optional, can allow jumping out of bounds)
  if (updatedPlayer.bounds.y < 0) {
    updatedPlayer.bounds.y = 0;
    updatedPlayer.velocity.y = 0;
  }

  // Bottom boundary (death pit)
  if (updatedPlayer.bounds.y > worldBounds.height) {
    // Player fell out of the world
    updatedPlayer.health = 0; // Instant death
  }

  return updatedPlayer;
};

// Add missing checkCollisions function that useGameLoop.ts is trying to import
export const checkCollisions = (
  player: Player,
  platforms: Platform[],
  collectibles: Collectible[],
  enemies: Enemy[]
): CollisionResult => {
  const result: CollisionResult = {};

  // Check platform collisions
  platforms.forEach((platform) => {
    const playerBounds: Bounds = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
    };

    const platformBounds: Bounds = {
      x: platform.x,
      y: platform.y,
      width: platform.width,
      height: platform.height,
    };

    if (checkCollision(playerBounds, platformBounds)) {
      // Handle platform collision
      if (
        player.velocityY > 0 && // Player is falling
        player.y + player.height - player.velocityY <= platform.y // Was above the platform in the previous frame
      ) {
        // Player landed on top of the platform
        result.updatedPlayer = {
          ...player,
          y: platform.y - player.height,
          velocityY: 0,
          isJumping: false,
        };
      } else if (
        player.velocityY < 0 && // Player is jumping
        player.y >= platform.y + platform.height // Was below the platform in the previous frame
      ) {
        // Player hit the platform from below
        result.updatedPlayer = {
          ...player,
          y: platform.y + platform.height,
          velocityY: 0,
        };
      } else if (player.velocityX > 0) {
        // Player hit the platform from the left
        result.updatedPlayer = {
          ...player,
          x: platform.x - player.width,
          velocityX: 0,
        };
      } else if (player.velocityX < 0) {
        // Player hit the platform from the right
        result.updatedPlayer = {
          ...player,
          x: platform.x + platform.width,
          velocityX: 0,
        };
      }
    }
  });

  // Check collectible collisions
  const updatedCollectibles = [...collectibles];
  let collectedItem = null;

  collectibles.forEach((collectible, index) => {
    if (collectible.collected) return;

    const playerBounds: Bounds = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
    };

    const collectibleBounds: Bounds = {
      x: collectible.x,
      y: collectible.y,
      width: collectible.width,
      height: collectible.height,
    };

    if (checkCollision(playerBounds, collectibleBounds)) {
      updatedCollectibles[index] = {
        ...collectible,
        collected: true,
      };
      collectedItem = collectible;
    }
  });

  if (collectedItem) {
    result.updatedCollectibles = updatedCollectibles;
    result.collectedItem = collectedItem;
  }

  // Check enemy collisions
  enemies.forEach((enemy) => {
    const playerBounds: Bounds = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
    };

    const enemyBounds: Bounds = {
      x: enemy.x,
      y: enemy.y,
      width: enemy.width,
      height: enemy.height,
    };

    if (checkCollision(playerBounds, enemyBounds)) {
      if (
        player.velocityY > 0 && // Player is falling
        player.y + player.height - player.velocityY <= enemy.y // Was above the enemy in the previous frame
      ) {
        // Player landed on top of the enemy - defeat enemy
        // This would normally update the enemy state, but for simplicity we'll just handle player bounce
        if (!result.updatedPlayer) {
          result.updatedPlayer = { ...player };
        }
        result.updatedPlayer.velocityY = -10; // Bounce up after defeating enemy
      } else {
        // Player collided with enemy from side or below - take damage
        result.playerDamaged = true;
      }
    }
  });

  return result;
};
