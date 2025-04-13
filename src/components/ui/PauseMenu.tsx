import { motion } from 'framer-motion';

interface PauseMenuProps {
  onResume: () => void;
  onExit: () => void;
}

const PauseMenu = ({ onResume, onExit }: PauseMenuProps) => {
  return (
    <motion.div 
      className="absolute inset-0 bg-black/80 flex items-center justify-center z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-dark border-2 border-primary p-6 rounded-lg max-w-sm w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        <motion.h2 
          className="text-2xl font-pixel text-primary mb-6 text-center"
          animate={{ 
            scale: [1, 1.03, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Game Paused
        </motion.h2>
        
        <div className="space-y-3">
          <motion.button 
            className="pixel-button w-full"
            onClick={onResume}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
          >
            Resume Game
          </motion.button>
          
          <motion.button 
            className="pixel-button w-full"
            onClick={onExit}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
          >
            Exit to Menu
          </motion.button>
        </div>
        
        <motion.p 
          className="mt-6 text-sm text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Press ESC to resume
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default PauseMenu;