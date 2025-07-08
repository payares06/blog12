import React, { useEffect, useState } from 'react';

interface AnimatedCharacterProps {
  imageSrc: string;
  alt: string;
  delay?: number;
  position: 'left' | 'right';
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({ 
  imageSrc, 
  alt, 
  delay = 0,
  position 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(`character-${alt}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [alt, delay, hasAnimated]);

  return (
    <div
      id={`character-${alt}`}
      className={`absolute ${position === 'right' ? '-right-12' : '-left-12'} top-1/2 transform -translate-y-1/2 transition-all duration-1000 ease-out decorative-background ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : `opacity-0 scale-0 ${position === 'right' ? 'translate-x-8' : '-translate-x-8'}`
      }`}
      style={{ zIndex: -1 }}
    >
      <div className="relative">
        <img
          src={imageSrc}
          alt={alt}
          className="w-40 h-40 sm:w-48 sm:h-48 drop-shadow-2xl opacity-80"
        />
      </div>
    </div>
  );
};