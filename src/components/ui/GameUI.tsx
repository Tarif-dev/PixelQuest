import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerControls } from '../../hooks/usePlayerControls';

interface GameUIProps {
  onPause: () => void;
}

const GameUI = ({ onPause }: GameUIProps) => {
  const { health, score, collectibles } = useGameState();
  
  // Set up player controls
  usePlayerControls();
  
  // Calculate collected gems
  const collectedCount = collectibles.filter(c => c.collected).length;
  const totalCount = collectibles.length;
  
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top HUD */}
      <motion.div 
        className="absolute top-4 left-4 right-4 flex items-center justify-between"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Health Bar */}
        <div className="bg-black/50 p-2 rounded-lg flex items-center">
          <div className="w-32 h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-health-color"
              initial={{ width: `${health}%` }}
              animate={{ width: `${health}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
          <span className="ml-2 text-white font-pixel text-sm">{health}%</span>
        </div>
        
        {/* Score */}
        <div className="bg-black/50 p-2 rounded-lg">
          <span className="text-white font-pixel">Score: {score}</span>
        </div>
        
        {/* Collectibles */}
        <div className="bg-black/50 p-2 rounded-lg flex items-center">
          <motion.div 
            className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <span className="text-white font-pixel text-sm">{collectedCount}/{totalCount}</span>
        </div>
      </motion.div>
      
      {/* Pause Button */}
      <motion.button 
        className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg pointer-events-auto"
        onClick={onPause}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="6" y="4" width="4" height="16" fill="currentColor" />
          <rect x="14" y="4" width="4" height="16" fill="currentColor" />
        </svg>
      </motion.button>
      
      {/* Mobile Controls - only visible on smaller screens */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6 md:hidden pointer-events-auto">
        {/* D-Pad */}
        <div className="flex gap-2">
          <motion.button 
            className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.9, backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button 
            className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center"
            whileTap={{ scale: 0.9, backgroundColor: "rgba(0,0,0,0.6)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
        
        {/* Jump Button */}
        <motion.button 
          className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center"
          whileTap={{ scale: 0.9, backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default GameUI;