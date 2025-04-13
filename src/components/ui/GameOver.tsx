// GameOver.tsx
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { useRouter } from 'next/router';

const GameOver: React.FC = () => {
  const { gameState, dispatch } = useGameContext();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [scoreAnimation, setScoreAnimation] = useState(0);
  
  useEffect(() => {
    if (gameState.gameOver) {
      setVisible(true);
      setFinalScore(gameState.score);
      
      // Animate score counting up
      let currentScore = 0;
      const interval = setInterval(() => {
        if (currentScore >= gameState.score) {
          clearInterval(interval);
          return;
        }
        
        const increment = Math.max(1, Math.floor(gameState.score / 30));
        currentScore = Math.min(gameState.score, currentScore + increment);
        setScoreAnimation(currentScore);
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setVisible(false);
    }
  }, [gameState.gameOver, gameState.score]);
  
  if (!visible) return null;
  
  const handleRestart = () => {
    // Reset game state
    dispatch({ type: 'RESET_GAME' });
    // Restart current level
    dispatch({ type: 'LOAD_LEVEL', payload: gameState.currentLevel });
  };
  
  const handleMainMenu = () => {
    // Reset game state
    dispatch({ type: 'RESET_GAME' });
    // Navigate to main menu
    router.push('/');
  };
  
  return (
    <div className="game-over-container" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      color: '#FFFFFF',
      fontFamily: '"Press Start 2P", monospace',
      animation: 'fadeIn 0.5s ease-in-out'
    }}>
      <div className="game-over-content" style={{
        backgroundColor: 'rgba(20, 20, 40, 0.9)',
        padding: '2rem',
        borderRadius: '8px',
        border: '4px solid #FF4444',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '400px',
        width: '80%',
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.5)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#FF4444',
          textShadow: '3px 3px 0px #000000',
          margin: 0,
          textAlign: 'center',
          letterSpacing: '2px'
        }}>GAME OVER</h1>
        
        <div className="score-container" style={{
          marginTop: '1rem',
          fontSize: '1.2rem'
        }}>
          <p>YOUR SCORE</p>
          <p style={{
            fontSize: '2rem',
            color: '#FFDD00',
            textShadow: '2px 2px 0px #000000'
          }}>{scoreAnimation}</p>
        </div>
        
        <div className="button-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%',
          marginTop: '1rem'
        }}>
          <button 
            onClick={handleRestart}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#6648FF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
              boxShadow: '0 4px 0 #4428DD',
              transition: 'transform 0.1s, box-shadow 0.1s',
              position: 'relative',
              outline: 'none'
            }}
            className="game-button"
          >
            TRY AGAIN
          </button>
          
          <button 
            onClick={handleMainMenu}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P", monospace',
              boxShadow: '0 4px 0 #222',
              transition: 'transform 0.1s, box-shadow 0.1s',
              position: 'relative',
              outline: 'none'
            }}
            className="game-button"
          >
            MAIN MENU
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .game-button:hover {
          transform: translateY(2px);
          box-shadow: 0 2px 0 currentColor;
        }
        .game-button:active {
          transform: translateY(4px);
          box-shadow: 0 0 0 currentColor;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>