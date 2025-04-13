// animations.ts
import { Sprite, SpriteAnimation, ParticleEffect, ParticleSystem } from '../types/game';

// Define animation frame sequences
export const createSpriteAnimation = (
  frameCount: number,
  frameWidth: number,
  frameHeight: number,
  spriteSheetUrl: string,
  frameRate: number = 12
): SpriteAnimation => {
  const frames = Array.from({ length: frameCount }, (_, i) => ({
    x: i * frameWidth,
    y: 0,
    width: frameWidth,
    height: frameHeight,
  }));
  
  return {
    frames,
    frameRate,
    spriteSheetUrl,
    currentFrame: 0,
    lastFrameTime: 0,
    isPlaying: true,
    isLooping: true,
  };
};

// Update animation frame based on elapsed time
export const updateSpriteAnimation = (
  animation: SpriteAnimation,
  deltaTime: number
): SpriteAnimation => {
  if (!animation.isPlaying) return animation;
  
  const newAnimation = { ...animation };
  newAnimation.lastFrameTime += deltaTime;
  
  const frameDuration = 1000 / animation.frameRate;
  if (newAnimation.lastFrameTime >= frameDuration) {
    newAnimation.currentFrame = (newAnimation.currentFrame + 1) % newAnimation.frames.length;
    
    // If animation reached the end and is not looping, stop it
    if (newAnimation.currentFrame === 0 && !newAnimation.isLooping) {
      newAnimation.isPlaying = false;
    }
    
    newAnimation.lastFrameTime = 0;
  }
  
  return newAnimation;
};

// Create a particle effect system
export const createParticleSystem = (
  x: number,
  y: number,
  particleCount: number,
  options: {
    minSpeed?: number;
    maxSpeed?: number;
    minSize?: number;
    maxSize?: number;
    minLifespan?: number;
    maxLifespan?: number;
    colors?: string[];
    gravity?: number;
    spread?: number;
    fadeOut?: boolean;
  } = {}
): ParticleSystem => {
  const {
    minSpeed = 1,
    maxSpeed = 4,
    minSize = 2,
    maxSize = 6,
    minLifespan = 500,
    maxLifespan = 1500,
    colors = ['#FFFFFF'],
    gravity = 0.1,
    spread = 360,
    fadeOut = true,
  } = options;
  
  const particles: ParticleEffect[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    // Random angle within spread range
    const angle = (Math.random() * spread * Math.PI) / 180;
    const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
    
    particles.push({
      x,
      y,
      size: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
      gravity,
      lifespan: minLifespan + Math.random() * (maxLifespan - minLifespan),
      creationTime: Date.now(),
      fadeOut,
    });
  }
  
  return {
    particles,
    isActive: true,
    creationTime: Date.now(),
  };
};

// Update particle system
export const updateParticleSystem = (
  system: ParticleSystem,
  deltaTime: number
): ParticleSystem => {
  const currentTime = Date.now();
  const updatedParticles = system.particles
    .filter(particle => {
      const age = currentTime - particle.creationTime;
      return age < particle.lifespan;
    })
    .map(particle => {
      const age = currentTime - particle.creationTime;
      const lifePercent = age / particle.lifespan;
      
      // Update velocity with gravity
      const updatedVelocity = {
        x: particle.velocity.x,
        y: particle.velocity.y + particle.gravity * deltaTime,
      };
      
      // Update position
      const updatedX = particle.x + updatedVelocity.x * deltaTime;
      const updatedY = particle.y + updatedVelocity.y * deltaTime;
      
      // Calculate opacity based on life percent
      const opacity = particle.fadeOut ? 1 - lifePercent : 1;
      
      // Calculate size (optional: particles can shrink over time)
      const size = particle.size * (1 - lifePercent * 0.5);
      
      return {
        ...particle,
        x: updatedX,
        y: updatedY,
        velocity: updatedVelocity,
        opacity,
        size,
      };
    });
  
  return {
    ...system,
    particles: updatedParticles,
    isActive: updatedParticles.length > 0,
  };
};

// Predefine common particle effects
export const createCollectionEffect = (
  x: number,
  y: number,
  color: string = '#FFD700'
): ParticleSystem => {
  return createParticleSystem(x, y, 15, {
    minSpeed: 2,
    maxSpeed: 6,
    minSize: 3,
    maxSize: 6,
    minLifespan: 400,
    maxLifespan: 800,
    colors: [color, '#FFFFFF'],
    gravity: 0.05,
    spread: 360,
  });
};

export const createExplosionEffect = (
  x: number,
  y: number,
  size: 'small' | 'medium' | 'large' = 'medium'
): ParticleSystem => {
  const particleCount = size === 'small' ? 20 : size === 'medium' ? 35 : 50;
  const speedMultiplier = size === 'small' ? 1 : size === 'medium' ? 1.5 : 2;
  
  return createParticleSystem(x, y, particleCount, {
    minSpeed: 3 * speedMultiplier,
    maxSpeed: 8 * speedMultiplier,
    minSize: 2,
    maxSize: 8,
    minLifespan: 500,
    maxLifespan: 1200,
    colors: ['#FF4400', '#FFAA00', '#FFFF00', '#FFFFFF'],
    gravity: 0.15,
    spread: 360,
  });
};

export const createJumpEffect = (
  x: number,
  y: number
): ParticleSystem => {
  return createParticleSystem(x, y + 10, 8, {
    minSpeed: 1,
    maxSpeed: 3,
    minSize: 2,
    maxSize: 4,
    minLifespan: 300,
    maxLifespan: 500,
    colors: ['#CCCCCC', '#AAAAAA'],
    gravity: 0.05,
    spread: 120,
  });
};

// Create a text popup animation (like damage numbers or points)
export const createTextPopup = (
  x: number,
  y: number,
  text: string,
  options: {
    color?: string;
    fontSize?: number;
    duration?: number;
    floatSpeed?: number;
    fadeOut?: boolean;
  } = {}
): any => {
  const {
    color = '#FFFFFF',
    fontSize = 16,
    duration = 1000,
    floatSpeed = 1,
    fadeOut = true,
  } = options;
  
  return {
    x,
    y,
    text,
    color,
    fontSize,
    creationTime: Date.now(),
    duration,
    floatSpeed,
    fadeOut,
    opacity: 1,
  };
};

// Update text popup position and opacity
export const updateTextPopup = (
  popup: any,
  deltaTime: number
): any => {
  const currentTime = Date.now();
  const age = currentTime - popup.creationTime;
  const lifePercent = age / popup.duration;
  
  // Update position (float upward)
  const updatedY = popup.y - popup.floatSpeed * deltaTime;
  
  // Update opacity
  const opacity = popup.fadeOut ? 1 - lifePercent : 1;
  
  return {
    ...popup,
    y: updatedY,
    opacity,
    isActive: age < popup.duration,
  };
};