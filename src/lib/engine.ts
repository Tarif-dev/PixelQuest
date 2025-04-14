import { Player, World, Collectible, Enemy } from "../types/game";

interface GameRenderState {
  player: Player;
  world: World;
  collectibles: Collectible[];
  enemies: Enemy[];
  score: number;
  health: number;
}

// Debug flag - set to true to see colored rectangles instead of images
const DEBUG_RENDERING = false;

// Sprite image references
const sprites = {
  player: {
    idle: {
      right: "/assets/sprites/player-idle-right.svg",
      left: "/assets/sprites/player-idle-left.svg",
    },
    running: {
      right: "/assets/sprites/player-run-right.svg",
      left: "/assets/sprites/player-run-left.svg",
    },
    jumping: {
      right: "/assets/sprites/player-jump-right.svg",
      left: "/assets/sprites/player-jump-left.svg",
    },
  },
  collectibles: {
    gem: "/assets/sprites/gem.svg",
    special: "/assets/sprites/special-item.svg",
  },
  enemies: {
    moving: {
      right: "/assets/sprites/enemy-right.svg",
      left: "/assets/sprites/enemy-left.svg",
    },
  },
  background: "/assets/backgrounds/game-bg.svg",
  platforms: "/assets/sprites/platform_regular.svg",
};

// Cache loaded images for better performance
const imageCache: Record<string, HTMLImageElement> = {};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src]);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      console.log(`Image loaded successfully: ${src}`);
      resolve(img);
    };
    img.onerror = (e) => {
      console.error(`Failed to load image: ${src}`, e);
      reject(new Error(`Failed to load image: ${src}`));
    };
    img.src = src;
    // Set crossOrigin to ensure image can be used in canvas
    img.crossOrigin = "anonymous";
  });
};

// Preload all images at startup to avoid async issues during gameplay
export const preloadGameAssets = async () => {
  try {
    console.log("Preloading game assets...");
    // Preload player sprites
    for (const state in sprites.player) {
      for (const direction in sprites.player[
        state as keyof typeof sprites.player
      ]) {
        const path =
          sprites.player[state as keyof typeof sprites.player][
            direction as keyof typeof sprites.player.idle
          ];
        await loadImage(path);
      }
    }

    // Preload collectible sprites
    for (const type in sprites.collectibles) {
      await loadImage(
        sprites.collectibles[type as keyof typeof sprites.collectibles]
      );
    }

    // Preload enemy sprites
    for (const direction in sprites.enemies.moving) {
      await loadImage(
        sprites.enemies.moving[direction as keyof typeof sprites.enemies.moving]
      );
    }

    // Preload background and platforms
    await loadImage(sprites.background);
    await loadImage(sprites.platforms);

    console.log("All game assets preloaded successfully!");
    return true;
  } catch (error) {
    console.error("Failed to preload game assets:", error);
    return false;
  }
};

// Handle camera based on player position
const setupCamera = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  canvasWidth: number,
  canvasHeight: number,
  worldWidth: number
) => {
  let cameraX = player.x - canvasWidth / 2;

  // Keep camera within world bounds
  cameraX = Math.max(0, Math.min(cameraX, worldWidth - canvasWidth));

  ctx.save();
  ctx.translate(-cameraX, 0);

  return cameraX;
};

export const renderGame = async (
  ctx: CanvasRenderingContext2D,
  gameState: GameRenderState
) => {
  const { player, world, collectibles, enemies } = gameState;

  // Canvas dimensions
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // Log canvas dimensions for debugging
  if (canvasWidth === 0 || canvasHeight === 0) {
    console.error("Canvas dimensions are invalid:", canvasWidth, canvasHeight);
    return;
  }

  // Clear the entire canvas first
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw a solid background color
  ctx.fillStyle = "#111122";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Setup camera
  const cameraX = setupCamera(
    ctx,
    player,
    canvasWidth,
    canvasHeight,
    world.width
  );

  // Draw a grid for debugging
  if (DEBUG_RENDERING) {
    ctx.strokeStyle = "#333355";
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = 0; x < world.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = 0; y < canvasHeight; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(world.width, y);
      ctx.stroke();
    }
  }

  // Render background
  try {
    if (DEBUG_RENDERING) {
      ctx.fillStyle = "#000033";
      ctx.fillRect(0, 0, world.width, canvasHeight);
    } else {
      const bgImage = await loadImage(sprites.background);

      // Fill the entire visible area with the background
      for (let x = 0; x < world.width; x += bgImage.width) {
        ctx.drawImage(bgImage, x, 0, bgImage.width, canvasHeight);
      }
    }
  } catch (error) {
    console.error("Failed to render background:", error);
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, world.width, canvasHeight);
  }

  // Render platforms
  try {
    if (DEBUG_RENDERING) {
      ctx.fillStyle = "#7d4e24";
      world.platforms.forEach((platform) => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });
    } else {
      const platformImage = await loadImage(sprites.platforms);

      world.platforms.forEach((platform) => {
        // Draw platform with proper scaling
        ctx.drawImage(
          platformImage,
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );

        // Draw a border around the platform for visibility
        if (DEBUG_RENDERING) {
          ctx.strokeStyle = "#aa7733";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
          );
        }
      });
    }
  } catch (error) {
    console.error("Failed to render platforms:", error);
    ctx.fillStyle = "#7d4e24";
    world.platforms.forEach((platform) => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  }

  // Render collectibles
  for (const collectible of collectibles) {
    if (collectible.collected) continue;

    try {
      if (DEBUG_RENDERING) {
        ctx.fillStyle = collectible.type === "gem" ? "#ffcc00" : "#ff44ff";
        ctx.fillRect(
          collectible.x,
          collectible.y,
          collectible.width,
          collectible.height
        );
      } else {
        const collectibleType =
          collectible.type as keyof typeof sprites.collectibles;
        const collectibleImage = await loadImage(
          sprites.collectibles[collectibleType]
        );

        ctx.drawImage(
          collectibleImage,
          collectible.x,
          collectible.y,
          collectible.width,
          collectible.height
        );
      }
    } catch (error) {
      console.error(`Failed to render ${collectible.type}:`, error);
      ctx.fillStyle = collectible.type === "gem" ? "#ffcc00" : "#ff44ff";
      ctx.fillRect(
        collectible.x,
        collectible.y,
        collectible.width,
        collectible.height
      );
    }
  }

  // Render enemies
  for (const enemy of enemies) {
    try {
      if (DEBUG_RENDERING) {
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      } else {
        const direction =
          enemy.direction as keyof typeof sprites.enemies.moving;
        const enemyImage = await loadImage(sprites.enemies.moving[direction]);

        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
      }
    } catch (error) {
      console.error("Failed to render enemy:", error);
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  }

  // Render player
  try {
    if (DEBUG_RENDERING) {
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(player.x, player.y, player.width, player.height);
    } else {
      const playerState = player.state as keyof typeof sprites.player;
      const playerDirection =
        player.direction as keyof typeof sprites.player.idle;
      const playerImage = await loadImage(
        sprites.player[playerState][playerDirection]
      );

      ctx.drawImage(
        playerImage,
        player.x,
        player.y,
        player.width,
        player.height
      );

      // Draw a border around the player for visibility
      if (DEBUG_RENDERING) {
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
      }
    }
  } catch (error) {
    console.error("Failed to render player:", error);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  // Draw coordinates for debugging
  if (DEBUG_RENDERING) {
    ctx.font = "12px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      `Player: (${Math.round(player.x)}, ${Math.round(player.y)})`,
      player.x,
      player.y - 10
    );
    ctx.fillText(`Camera: ${Math.round(cameraX)}`, 10 + cameraX, 20);
    ctx.fillText(`Canvas: ${canvasWidth}x${canvasHeight}`, 10 + cameraX, 40);
  }

  // Restore context
  ctx.restore();
};
