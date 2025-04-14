import { useEffect } from "react";
import { motion } from "framer-motion";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  // Pre-load some assets
  useEffect(() => {
    const preloadImages = [
      "/assets/sprites/logo.svg",
      "/assets/backgrounds/menu-bg.png",
    ];

    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <>
      <Head>
        <title>RetroQuest: Pixel Adventure</title>
        <meta
          name="description"
          content="An award-winning retro-style platform game with stunning pixel art and modern web techniques"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-screen bg-dark flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-pixel text-primary mb-8 tracking-wider"
            style={{ textShadow: "4px 4px 0 #ff8a2b" }}
            animate={{
              rotateX: [0, 10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            RetroQuest
          </motion.h1>

          <motion.div
            className="w-24 h-24 md:w-40 md:h-40 bg-contain bg-no-repeat bg-center mx-auto mb-8"
            style={{ backgroundImage: "url('/assets/sprites/logo.svg')" }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <motion.p
            className="text-lg mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Embark on a pixel-perfect adventure filled with challenging
            platforms, hidden collectibles, and retro charm!
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/game">
              <motion.button
                className="pixel-button text-xl py-3 px-8"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ y: 2, transition: { duration: 0.1 } }}
              >
                Start Adventure
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-4 text-sm opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Use arrow keys to move, space to jump. Mobile controls available
          in-game.
        </motion.div>
      </main>
    </>
  );
};

export default Home;
