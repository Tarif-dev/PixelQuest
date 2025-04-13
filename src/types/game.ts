export type GameStatus =
  | "menu"
  | "playing"
  | "paused"
  | "gameOver"
  | "levelComplete";

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  direction: "left" | "right";
  state: "idle" | "running" | "jumping";
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface World {
  gravity: number;
  friction: number;
  platforms: Platform[];
  width: number;
  height: number;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  collected: boolean;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  direction: "left" | "right";
  state: "idle" | "moving" | "attacking";
}

export interface CollisionResult {
  updatedPlayer?: Player;
  updatedCollectibles?: Collectible[];
  collectedItem?: Collectible;
  playerDamaged?: boolean;
}

// Animation types
export interface Sprite {
  x: number;
  y: number;
  width: number;
  height: number;
  spriteSheetUrl: string;
}

export interface SpriteAnimation {
  frames: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  frameRate: number;
  spriteSheetUrl: string;
  currentFrame: number;
  lastFrameTime: number;
  isPlaying: boolean;
  isLooping: boolean;
}

export interface ParticleEffect {
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  gravity: number;
  lifespan: number;
  creationTime: number;
  fadeOut: boolean;
  opacity?: number;
}

export interface ParticleSystem {
  particles: ParticleEffect[];
  isActive: boolean;
  creationTime: number;
}

export interface TextPopup {
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  creationTime: number;
  duration: number;
  floatSpeed: number;
  fadeOut: boolean;
  opacity: number;
  isActive?: boolean;
}
