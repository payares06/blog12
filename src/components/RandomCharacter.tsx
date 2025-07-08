import React, { useEffect, useState } from 'react';

interface RandomCharacterProps {
  position?: 'left' | 'right' | 'center';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  animated?: boolean;
  safeMode?: boolean; // Nueva prop para posicionamiento seguro
}

export const RandomCharacter: React.FC<RandomCharacterProps> = ({ 
  position = 'center', 
  size = 'medium',
  className = '',
  animated = true,
  safeMode = false
}) => {
  const [character, setCharacter] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Todos los personajes disponibles
  const characters = [
    '/12.png', '/13.png', '/14.png', '/15.png', '/16.png', // Originales
    '/4.png', '/5.png', '/6.png', '/17.png', '/18.png'     // Nuevos
  ];

  const sizeClasses = {
    small: 'w-12 h-12 sm:w-16 sm:h-16',
    medium: 'w-16 h-16 sm:w-20 sm:h-20',
    large: 'w-20 h-20 sm:w-24 sm:h-24'
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
    <div className={`flex ${positionClasses[position]} ${className} ${safeMode ? 'relative z-0' : ''}`}>
      <div
        className={`${sizeClasses[size]} transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-0 translate-y-8'
        } ${animated ? 'animate-float' : ''}`}
        style={{
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${Math.random() * 4 + 6}s`, // 6-10s
          zIndex: safeMode ? -1 : 'auto'
        }}
      >
        <img
          src={character}
          alt="Character"
          className="w-full h-full drop-shadow-2xl hover:scale-110 transition-transform duration-300"
          style={{ zIndex: safeMode ? -1 : 'auto' }}
        />
      </div>
    </div>
  );
};

// Componente para múltiples personajes aleatorios en posiciones seguras
export const RandomCharacterGroup: React.FC<{ count?: number; className?: string }> = ({ 
  count = 3, 
  className = '' 
}) => {
  const [characters, setCharacters] = useState<Array<{
    id: number;
    position: { x: number; y: number };
    size: 'small' | 'medium';
    delay: number;
  }>>([]);

  useEffect(() => {
    // Posiciones seguras que no interfieren con el contenido
    const safePositions = [
      { x: 5, y: 15 },   // Top left
      { x: 85, y: 10 },  // Top right
      { x: 10, y: 80 },  // Bottom left
      { x: 80, y: 85 },  // Bottom right
      { x: 2, y: 50 },   // Middle left
      { x: 90, y: 45 },  // Middle right
      { x: 15, y: 25 },  // Upper left area
      { x: 75, y: 75 },  // Lower right area
    ];

    const newCharacters = Array.from({ length: count }, (_, i) => ({
      id: i,
      position: safePositions[i % safePositions.length] || {
        x: Math.random() > 0.5 ? Math.random() * 15 + 2 : Math.random() * 15 + 83,
        y: Math.random() * 80 + 10
      },
      size: Math.random() > 0.7 ? 'medium' : 'small' as 'small' | 'medium',
      delay: Math.random() * 3
    }));

    setCharacters(newCharacters);
  }, [count]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      {characters.map((char) => (
        <div
          key={char.id}
          className="absolute"
          style={{
            left: `${char.position.x}%`,
            top: `${char.position.y}%`,
            zIndex: -1,
            animationDelay: `${char.delay}s`
          }}
        >
          <RandomCharacter 
            size={char.size}
            animated={true}
            safeMode={true}
          />
        </div>
      ))}
    </div>
  );
};