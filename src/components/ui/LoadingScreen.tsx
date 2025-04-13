import { motion } from 'framer-motion';

interface LoadingScreenProps {
  progress: number;
}

const LoadingScreen = ({ progress }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <motion.div 
        className="w-24 h-24 md:w-32 md:h-32 bg-contain bg-no-repeat bg-center mb-8"
        style={{ backgroundImage: "url('/assets/sprites/logo.png')" }}
        animate={{ 
          rotate: [0, 360],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.h2
        className="text-2xl md:text-3xl font-pixel text-primary mb-6"
        animate={{ 
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        RetroQuest
      </motion.h2>
      
      <div className="w-64 h-6 border-2 border-white/50 relative mb-6 overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <motion.p
        className="text-md font-pixel"
        animate={{ 
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
        }}
      >
        Loading adventure...
      </motion.p>
    </div>
  );
};

export default LoadingScreen;