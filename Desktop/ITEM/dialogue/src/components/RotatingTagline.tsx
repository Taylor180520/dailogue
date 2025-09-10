import React, { useState, useEffect } from 'react';

interface RotatingTaglineProps {
  taglines: string[];
}

const RotatingTagline: React.FC<RotatingTaglineProps> = ({ taglines }) => {
  // Random starting index to ensure each instance starts at different points
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(() => 
    Math.floor(Math.random() * taglines.length)
  );
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Add random initial delay (0-2 seconds) to further desynchronize
    const initialDelay = Math.random() * 2000;
    
    const startRotation = () => {
      const interval = setInterval(() => {
        setIsFading(true);
        
        setTimeout(() => {
          setCurrentTaglineIndex(prev => (prev + 1) % taglines.length);
          setIsFading(false);
        }, 250); // Half of the transition duration for smooth effect
      }, 3000); // Change tagline every 3 seconds

      return interval;
    };

    // Start rotation after initial delay
    const initialTimer = setTimeout(() => {
      const interval = startRotation();
      
      // Cleanup function
      return () => clearInterval(interval);
    }, initialDelay);

    // Cleanup function
    return () => {
      clearTimeout(initialTimer);
    };
  }, [taglines.length]);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 overflow-hidden">
      <div className="relative h-6">
        <p className={`absolute inset-0 text-gray-100 text-sm leading-relaxed italic transition-all duration-500 ease-in-out ${
          isFading ? 'transform translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
        }`}>
          "{taglines[currentTaglineIndex]}"
        </p>
      </div>
    </div>
  );
};

export default RotatingTagline;