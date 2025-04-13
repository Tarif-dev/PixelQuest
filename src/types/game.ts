export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  direction: 'left' | 'right';
  state: 'idle' | 'running' | 'jumping';
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
  direction: 'left' | 'right';
  state: 'idle' | 'moving' | 'attacking';
}

export interface CollisionResult {
  updatedPlayer?: Player;
  updatedCollectibles?: Collectible[];
  collectedItem?: Collectible;
  playerDamaged?: boolean;
}