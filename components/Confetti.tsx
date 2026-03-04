import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  useEffect(() => {
    if (trigger) {
      // Fireworks logic
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      // Initial heart burst
      const scalar = 3;
      const heart = confetti.shapeFromPath({
        path: 'M167 102.7c-50.1-3.3-69.4 14-89 48C57.6 116.7 38.2 99.4-12 102.7c-33.6 2.2-68.5 24.8-68.5 73.7 0 54.3 64.6 98.4 163.5 174.9 98.9-76.5 163.5-120.6 163.5-174.9 0-48.9-34.9-71.5-68.5-73.7z'
      });

      confetti({
          particleCount: 30,
          spread: 80,
          origin: { y: 0.6 },
          shapes: [heart],
          colors: ['#FF6B6B', '#FFD93D', '#FF8E8E'],
          scalar: 2
      });

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        
        // Random bursts from different places to simulate fireworks
        confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
            colors: ['#FF9AA2', '#FFB7B2', '#FFDAC1']
        });
        confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
            colors: ['#E2F0CB', '#B5EAD7', '#C7CEEA']
        });
        
        // Occasional center explosion with hearts
        if (Math.random() > 0.7) {
             confetti({
                startVelocity: 45,
                spread: 360,
                ticks: 60,
                zIndex: 100,
                particleCount: 20,
                origin: { x: randomInRange(0.3, 0.7), y: Math.random() * 0.5 },
                colors: ['#FF4757', '#FF6348', '#FF6B81'],
                shapes: [heart],
                scalar: 1.5
            });
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [trigger]);

  return null;
};

export default Confetti;