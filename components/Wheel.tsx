import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { WheelItem } from '../types';

interface WheelProps {
  items: WheelItem[];
  onSpinEnd: (winner: WheelItem) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  spinDuration: number;
}

// Workaround for TypeScript errors where 'animate' is not recognized on motion.div in some environments
const MotionDiv = motion.div as any;

const Wheel: React.FC<WheelProps> = ({ items, onSpinEnd, isSpinning, setIsSpinning, spinDuration }) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  const spinningRef = useRef(false); // Use ref to track active animation to avoid closure staleness issues

  // Constants
  const SIZE = 340; 
  const CENTER = SIZE / 2;
  const RADIUS = SIZE / 2 - 10; 

  const sliceAngle = 360 / items.length;

  const spin = async () => {
    // If currently mechanically spinning, don't restart
    if (spinningRef.current) return;
    
    spinningRef.current = true;
    
    const winningIndex = Math.floor(Math.random() * items.length);
    
    // Calculate full rotations based on duration to ensure it looks fast enough
    // We force at least 5 full spins
    const minSpins = Math.max(5, spinDuration * 1.5);
    const extraSpins = 360 * (Math.floor(minSpins) + Math.floor(Math.random() * 4));
    
    const sliceCenterAngle = (winningIndex * sliceAngle) + (sliceAngle / 2);
    
    const currentRotation = rotation;
    // Calculate target to land exactly on the slice
    const targetRotation = currentRotation + extraSpins + (360 - (currentRotation % 360)) + (360 - sliceCenterAngle);

    // Add a tiny bit of random variance within the slice so it's not always dead center
    const variance = (Math.random() - 0.5) * (sliceAngle * 0.8);
    const finalRotation = targetRotation + variance;

    try {
        await controls.start({
            rotate: finalRotation,
            transition: {
                duration: spinDuration, 
                ease: [0.25, 0.1, 0.25, 1], // Cubic-bezier for realistic friction (start fast, slow down)
            },
        });
    } catch (e) {
        // Handle animation interruption if necessary
    }

    setRotation(finalRotation);
    spinningRef.current = false;
    
    // Notify parent spin is done
    setIsSpinning(false);
    onSpinEnd(items[winningIndex]);
  };
  
  useEffect(() => {
    if (isSpinning) {
       spin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  // Generate SVG path for a slice
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", x, y,
      "Z"
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="relative flex items-center justify-center py-10">
      {/* iOS-style Glass Backdrop Glow */}
      <div className="absolute inset-0 bg-pink-300/20 blur-3xl rounded-full transform scale-110 pointer-events-none" />

      {/* Pointer with Ticking Animation */}
      <MotionDiv 
        className="absolute top-2 z-20 drop-shadow-xl filter origin-top"
        animate={isSpinning ? {
          rotate: [0, -25, 0, -15, 0],
          transition: { 
            duration: 0.15, 
            repeat: Infinity, 
            ease: "linear"
          }
        } : { rotate: 0 }}
      >
         <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
             <path d="M20 40L4 8H36L20 40Z" fill="#F43F5E" stroke="white" strokeWidth="3" strokeLinejoin="round"/>
             <circle cx="20" cy="8" r="4" fill="white" />
         </svg>
      </MotionDiv>

      {/* Wheel Container */}
      <MotionDiv
        ref={wheelRef}
        className="relative rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border-[6px] border-white bg-white overflow-hidden will-change-transform"
        style={{ width: SIZE, height: SIZE }}
        animate={controls}
        initial={{ rotate: 0 }}
      >
        {/* Blur effect during spin */}
        <MotionDiv 
            className="w-full h-full"
            animate={{ filter: isSpinning ? "blur(2px)" : "blur(0px)" }}
            transition={{ duration: 0.2 }}
        >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {items.map((item, index) => {
            const startAngle = index * sliceAngle;
            const endAngle = (index + 1) * sliceAngle;
            const midAngle = startAngle + (sliceAngle / 2);
            
            const contentPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.65, midAngle);
            
            return (
              <g key={item.id}>
                <path
                  d={describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                
                {item.isImage && item.icon ? (
                   <g transform={`translate(${contentPos.x}, ${contentPos.y}) rotate(${midAngle + 90})`}>
                      <foreignObject x="-20" y="-20" width="40" height="40">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex items-center justify-center">
                           <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                        </div>
                      </foreignObject>
                      <text
                        y="32"
                        fill={items.length > 8 ? "transparent" : "white"} 
                        fontSize="10"
                        fontWeight="800"
                        textAnchor="middle"
                        stroke="rgba(0,0,0,0.2)"
                        strokeWidth="2"
                        paintOrder="stroke"
                      >
                         {item.label}
                      </text>
                      <text
                        y="32"
                        fill="white"
                        fontSize="10"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                         {item.label}
                      </text>
                   </g>
                ) : (
                    <g transform={`translate(${contentPos.x}, ${contentPos.y}) rotate(${midAngle + 90})`}>
                       <text
                         y={item.label ? "0" : "5"}
                         fontSize="28"
                         textAnchor="middle"
                         alignmentBaseline="middle"
                         className="filter drop-shadow-md"
                       >
                         {item.icon || '❓'}
                       </text>
                       <text
                         y="24"
                         fill="white"
                         fontSize="11"
                         fontWeight="800"
                         textAnchor="middle"
                         stroke="rgba(0,0,0,0.1)"
                         strokeWidth="3"
                         paintOrder="stroke"
                       >
                         {item.label.substring(0, 10)}
                       </text>
                    </g>
                )}
              </g>
            );
          })}
        </svg>
        </MotionDiv>
      </MotionDiv>
      
      {/* Center Cap with Glassmorphism */}
      <div className="absolute z-10 w-16 h-16 bg-white/80 backdrop-blur-md rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center border-4 border-white">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-orange-300 opacity-90 animate-pulse shadow-inner"></div>
      </div>
    </div>
  );
};

export default Wheel;