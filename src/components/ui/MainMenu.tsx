import { useState } from 'react';
import { motion } from 'framer-motion';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu = ({ onStartGame }: MainMenuProps) => {
  const [selectedOption, setSelectedOption] = useState('start');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div 
      className="absolute inset-0 bg-dark/80 flex flex-col items-center justify-center z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 
        className="text-4xl md:text-6xl font-pixel text-primary mb-8 tracking-wider"
        style={{ textShadow: '4px 4px 0 #ff8a2b' }}
        variants={itemVariants}
        animate={{ 
          rotateX: [0, 5, 0],
          scale: [1, 1.03, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        RetroQuest
      </motion.h1>
      
      <motion.div className="flex flex-col gap-3 w-48" variants={itemVariants}>
        <MenuButton 
          label="Start Game" 
          isSelected={selectedOption === 'start'} 
          onClick={() => {
            setSelectedOption('start');
            onStartGame();
          }} 
        />
        
        <MenuButton 
          label="Controls" 
          isSelected={selectedOption === 'controls'} 
          onClick={() => setSelectedOption('controls')} 
        />
        
        <MenuButton 
          label="Settings" 
          isSelected={selectedOption === 'settings'} 
          onClick={() => setSelectedOption('settings')} 
        />
      </motion.div>
      
      {selectedOption === 'controls' && (
        <motion.div 
          className="mt-8 bg-dark/80 p-4 border border-primary/30 rounded-lg max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-pixel mb-2 text-secondary">Controls</h3>
          <ul className="text-sm space-y-1">
            <li>→ / D: Move right</li>
            <li>← / A: Move left</li>
            <li>Space: Jump</li>
            <li>E: Interact</li>
            <li>Esc: Pause game</li>
          </ul>
        </motion.div>
      )}
      
      <motion.div 
        className="absolute bottom-16 w-56 h-32 opacity-60"
        style={{ 
          backgroundImage: "url('/assets/sprites/character-idle.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}
        variants={itemVariants}
        animate={{ y: [0, -5, 0] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </motion.div>
  );
};

interface MenuButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const MenuButton = ({ label, isSelected, onClick }: MenuButtonProps) => {
  return (
    <motion.button 
      className={`pixel-button w-full ${isSelected ? 'bg-secondary' : 'bg-primary'}`}
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 2 }}
    >
      {isSelected && (
        <motion.span 
          className="absolute -left-5 text-yellow-300"
          animate={{ x: [0, 2, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          &gt;
        </motion.span>
      )}
      {label}
    </motion.button>
  );
};

export default MainMenu;