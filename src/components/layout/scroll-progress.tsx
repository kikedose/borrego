'use client';

import { motion, useScroll } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-9999 h-1 origin-left bg-primary"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
