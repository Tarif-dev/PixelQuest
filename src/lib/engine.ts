import { Player, World, Collectible, Enemy } from '../types/game';

interface GameRenderState {
  player: Player;
  world: World;
  collectibles: Collectible[];
  enemies: Enemy[];
  score: number;
  health: number;
}

// Sprite image references
const sprites = {
  player: {
    idle: {
      right: '/assets/sprites/player-idle-right.png',
      left: '/assets/sprites/player-idle-left.png'
    },
    running: {
      right: '/assets/sprites/player-run-right.png',
      left: '/assets/sprites/player-run-left.png'
    },
    jumping: {
      right: '/assets/sprites/player-jump-right.png',
      left: '/assets/sprites/player-jump-left.png'
    }
  },
  collectibles: {
    gem: '/assets/sprites/gem.png',
    special: '/assets/sprites/special-item.png'
  },
  enemies: {
    moving: {
      right: '/assets/sprites/enemy-right.png',
      left: '/assets/sprites/enemy-left.png'
    }
  },
  background: '/assets/backgrounds/game-bg.png',
  platforms: '/assets/sprites/platform.png'
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
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
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
  
  // Setup camera
  const cameraX = setupCamera(ctx, player, canvasWidth, canvasHeight, world.width);
  
  // Load and render background
  try {
    const bgImage = await loadImage(sprites.background);
    
    // Parallax background (3 layers with different scroll speeds)
    const bgWidth = bgImage.width;
    const bgHeight = bgImage.height;
    
    // Far background (0.2x scroll speed)
    const farBgOffset = cameraX * 0.2;
    for (let x = Math.floor(farBgOffset / bgWidth) * bgWidth - farBgOffset; 
         x < canvasWidth + cameraX; 
         x += bgWidth) {
      ctx.drawImage(bgImage, x, 0, bgWidth, bgHeight);
    }
  } catch (error) {
    console.error('Failed to load background image:', error);
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, world.width, canvasHeight);
  }
  
  // Render platforms
  try {
    const platformImage = await loadImage(sprites.platforms);
    
    world.platforms.forEach(platform => {
      ctx.drawImage(
        platformImage, 
        platform.x, 
        platform.y, 
        platform.width, 
        platform.height
      );
    });
  } catch (error) {
    console.error('Failed to load platform image:', error);
    ctx.fillStyle = '#7d4e24';
    
    world.platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  }
  
  // Render collectibles
  collectibles.forEach(async collectible => {
    if (collectible.collected) return;
    
    try {
      const collectibleImage = await loadImage(
        sprites.collectibles[collectible.type as keyof typeof sprites.collectibles]
      );
      
      ctx.drawImage(
        collectibleImage,
        collectible.x,
        collectible.y,
        collectible.width,
        collectible.height
      );
    } catch (error) {
      console.error(`Failed to load ${collectible.type} image:`, error);
      ctx.fillStyle = collectible.type === 'gem' ? '#ffcc00' : '#ff44ff';
      ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
    }
  });
  
  // Render enemies
  enemies.forEach(async enemy => {
    try {
      const enemyImage = await loadImage(
        sprites.enemies.moving[enemy.direction as keyof typeof sprites.enemies.moving]
      );
      
      ctx.drawImage(
        enemyImage,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
      );
    } catch (error) {
      console.error('Failed to load enemy image:', error);
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
  
  // Render player
  try {
    const playerImage = await loadImage(
      sprites.player[player.state as keyof typeof sprites.player]
        [player.direction as keyof typeof sprites.player.idle]
    );
    
    ctx.drawImage(
      playerImage,
      player.x,
      player.y,
      player.width,
      player.height
    );
  } catch (error) {
    console.error('Failed to load player image:', error);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
  
  // Restore context
  ctx.restore();
};