// LevelComplete.tsx
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { useRouter } from 'next/router';

interface LevelStats {
  coinsCollected: number;
  totalCoins: number;
  timeElapsed: number;
  enemiesDefeated: number;
}

const LevelComplete: React.FC = () => {
  const { gameState, dispatch } = useGameContext();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState<LevelStats>({
    coinsCollected: 0,
    totalCoins: 0,
    timeElapsed: 0,
    enemiesDefeated: 0
  });
  const [stars, setStars] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    if (gameState.levelComplete) {
      setVisible(true);
      setStats({
        coinsCollected: gameState.collectibles.collected.filter(c => c.type === 'coin').length,
        totalCoins: gameState.collectibles.total.filter(c => c.type === 'coin').length,
        timeElapsed: gameState.timeElapsed,
        enemiesDefeated: gameState.defeatedEnemies
      });
      
      // Calculate stars based on performance
      let starCount = 0;
      
      // Star 1: Complete the level
      starCount++;
      
      // Star 2: Collect at least 80% of coins
      const coinPercentage = stats.totalCoins > 0 
        ? (stats.coinsCollected / stats.totalCoins) 
        : 1;
      if (coinPercentage >= 0.8) starCount++;
      
      // Star 3: Complete within time limit (varies by level)
      const timeLimit = gameState.levelConfig?.timeLimit || 180; // 3 minutes default
      if (stats.timeElapsed <= timeLimit) starCount++;
      
      setStars(starCount);
      
      // Animate the completion screen elements sequentially
      const animationInterval = setInterval(() => {
        setAnimationPhase(prev => {
          const next = prev + 1;
          if (next >= 4) clearInterval(animationInterval);
          return next;
        });
      }, 500);
      
      return () => clearInterval(animationInterval);
    } else {
      setVisible(false);
      setAnimationPhase(0);
    }
  }, [gameState.levelComplete, gameState.collectibles, gameState.timeElapsed, gameState.defeatedEnemies, gameState.levelConfig]);
  
  if (!visible) return null;
  
  const handleNextLevel = () => {
    dispatch({ type: 'LOAD_NEXT_LEVEL' });
  };
  
  const handleReplayLevel = () => {
    dispatch({ type: 'RESET_LEVEL' });
    dispatch({ type: 'LOAD_LEVEL', payload: gameState.currentLevel });
  };
  
  const handleMainMenu = () => {
    dispatch({ type: 'RESET_GAME' });
    router.push('/');
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="level-complete-container" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      color: '#FFFFFF',
      fontFamily: '"Press Start 2P", monospace',
      animation: 'fadeIn 0.5s ease-in-out'
    }}>
      <div className="level-complete-content" style={{
        backgroundColor: 'rgba(25, 25, 60, 0.9)',
        padding: '2rem',
        borderRadius: '8px',
        border: '4px solid #44AAFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '500px',
        width: '85%',
        boxShadow: '0 0 25px rgba(68, 170, 255, 0.5)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#44AAFF',
          textShadow: '3px 3px 0px #000000',
          margin: 0,
          opacity: animationPhase >= 1 ? 1 : 0,
          transform: animationPhase >= 1 ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.5s, transform 0.5s',
          textAlign: 'center'
        }}>LEVEL COMPLETE!</h1>
        
        <div className="stars-container" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '0.5rem',
          marginBottom: '1rem',
          opacity: animationPhase >= 2 ? 1 : 0,
          transform: animationPhase >= 2 ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}>
          {[1, 2, 3].map((starIndex) => (
            <div 
              key={starIndex}
              className={`star ${stars >= starIndex ? 'earned' : ''}`}
              style={{
                width: '40px',
                height: '40px',
                backgroundImage: stars >= starIndex 
                  ? "url('/assets/sprites/star_filled.png')" 
                  : "url('/assets/sprites/star_empty.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                transition: 'transform 0.3s',
                transform: stars >= starIndex ? 'rotate(360deg) scale(1.2)' : 'rotate(0) scale(1)',
                transitionDelay: `${(starIndex - 1) * 0.2}s`
              }}
            />
          ))}
        </div>
        
        <div className="stats-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          marginTop: '0.5rem',
          opacity: animationPhase >= 3 ? 1 : 0,
          transform: animationPhase >= 3 ? 'translateX(0)' : 'translateX(-20px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}>
          <div className="stat-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
          }}>
            <span>Coins:</span>
            <span style={{ color: '#FFD700' }}>{stats.coinsCollected} / {stats.totalCoins}</span>
          </div>
          
          <div className="stat-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
          }}>
            <span>Time:</span>
            <span style={{ color: '#44AAFF' }}>{formatTime(stats.timeElapsed)}</span>
          </div>
          
          <div className="stat-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
          }}>
            <span>Enemies defeated:</span>
            <span style={{ color: '#FF6644' }}>{stats.enemiesDefeated}</span>
          </div>
          
          <div className="stat-row" style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '0.75rem',
            marginTop: '0.25rem'
          }}>
            <span>Score:</span>
            <span style={{ 
              color: '#FFDD00',
              fontSize: '1.2rem',
              textShadow: '1px 1px 0px #000000'
            }}>{gameState.score}</span>
          </div>
        </div>
        
        <div className="button-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          marginTop: '1.5rem',
          opacity: animationPhase >= 4 ? 1 : 0,
          transform: animationPhase >= 4 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s, transform 0.5s',
        }}>
          <button 
            onClick={handleNextLevel}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#44AAFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
              boxShadow: '0 4px 0 #2288DD',
              transition: 'transform 0.1s, box-shadow 0.1s',
              position: 'relative',
              outline: 'none'
            }}
            className="game-button"
            disabled={!gameState.hasNextLevel}
          >
            NEXT LEVEL
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <button 
              onClick={handleReplayLevel}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                fontSize: '0.8rem',
                backgroundColor: '#66DD66',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: '"Press Start 2P", monospace',
                boxShadow: '0 4px 0 #44BB44',
                transition: 'transform 0.1s, box-shadow 0.1s',
                position: 'relative',
                outline: 'none'
              }}
              className="game-button"
            >
              REPLAY
            </button>
            
            <button 
              onClick={handleMainMenu}
              style={{
                flex: 1,
                padding: '0.75rem 0.5rem',
                fontSize: '0.8rem',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: '"Press Start 2P", monospace',
                boxShadow: '0 4px 0 #444',
                transition: 'transform 0.1s, box-shadow 0.1s',
                position: 'relative',
                outline: 'none'
              }}
              className="game-button"
            >
              MENU
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .game-button:hover:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 2px 0 currentColor;
        }
        .game-button:active:not(:disabled) {
          transform: translateY(4px);
          box-shadow: 0 0 0 currentColor;
        }
        .game-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .star.earned {
          filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
        }
      `}</style>
    </div>
  );
};

export default LevelComplete;