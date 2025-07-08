import React, { useEffect, useState } from 'react';

interface RandomCharacterProps {
  position?: 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  animated?: boolean;
}

export const RandomCharacter: React.FC<RandomCharacterProps> = ({ 
  position = 'center', 
  size = 'medium',
  className = '',
  animated = true
}) => {
  const [character, setCharacter] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Todos los personajes disponibles
  const characters = [
    '/12.png', '/13.png', '/14.png', '/15.png', '/16.png', // Originales
    '/4.png', '/5.png', '/6.png', '/17.png', '/18.png'     // Nuevos
  ];

  const sizeClasses = {
    small: 'w-16 h-16 sm:w-20 sm:h-20',
    medium: 'w-24 h-24 sm:w-32 sm:h-32',
    large: 'w-32 h-32 sm:w-40 sm:h-40'
  };

  const positionClasses = {
    left: 'justify-start',
    right: 'justify-end', 
    center: 'justify-center'
  };

  useEffect(() => {
    // Seleccionar personaje aleatorio
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setCharacter(randomCharacter);

    // Animación de entrada con delay aleatorio
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, []);

  if (!character) return null;

  return (
    <div className={`flex ${positionClasses[position]} ${className}`}>
      <div
        className={`${sizeClasses[size]} transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-0 translate-y-8'
        } ${animated ? 'animate-float' : ''}`}
        style={{
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 4 + 6}s` // 6-10s
        }}
      >
        <img
          src={character}
          alt="Character"
          className="w-full h-full drop-shadow-2xl hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
  );
};

// Componente para múltiples personajes aleatorios
export const RandomCharacterGroup: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = '' 
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 80 + 10}%`, // 10-90%
            top: `${Math.random() * 80 + 10}%`,  // 10-90%
            zIndex: Math.floor(Math.random() * 10) + 1
          }}
        >
          <RandomCharacter 
            size={Math.random() > 0.5 ? 'small' : 'medium'}
            animated={true}
          />
        </div>
      ))}
    </div>
  );
};