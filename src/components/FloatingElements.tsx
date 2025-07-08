import React, { useEffect, useState } from 'react';
import { Atom, Compass, Satellite, Book, PenTool, Heart, Star, Zap, Globe, Sparkles } from 'lucide-react';

interface FloatingElementsProps {
  count?: number;
  section?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ count = 6, section = 'default' }) => {
  const [elements, setElements] = useState<Array<{
    id: number;
    icon: React.ComponentType<any>;
    color: string;
    size: number;
    position: { x: number; y: number };
    delay: number;
    duration: number;
  }>>([]);

  const icons = [Atom, Compass, Satellite, Book, PenTool, Heart, Star, Zap, Globe, Sparkles];
  const colors = [
    'text-teal-400',
    'text-emerald-400', 
    'text-cyan-400',
    'text-blue-400',
    'text-purple-400',
    'text-pink-400',
    'text-yellow-400',
    'text-orange-400',
    'text-red-400',
    'text-green-400'
  ];

  useEffect(() => {
    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 20 + 16, // 16-36px
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 8 // 8-18s
    }));
    
    setElements(newElements);
  }, [count, section]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => {
        const IconComponent = element.icon;
        return (
          <div
            key={element.id}
            className={`absolute ${element.color} opacity-20 animate-float`}
            style={{
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              fontSize: `${element.size}px`
            }}
          >
            <IconComponent size={element.size} />
          </div>
        );
      })}
    </div>
  );
};

// Componente para esferas decorativas específicas
export const DecorativeSpheres: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const [spheres, setSpheres] = useState<Array<{
    id: number;
    size: number;
    position: { x: number; y: number };
    color: string;
    delay: number;
  }>>([]);

  const sphereColors = [
    'bg-gradient-to-r from-teal-400 to-emerald-500',
    'bg-gradient-to-r from-blue-400 to-cyan-500',
    'bg-gradient-to-r from-purple-400 to-pink-500',
    'bg-gradient-to-r from-yellow-400 to-orange-500',
    'bg-gradient-to-r from-green-400 to-teal-500',
    'bg-gradient-to-r from-red-400 to-pink-500'
  ];

  useEffect(() => {
    const newSpheres = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 40, // 40-100px
      position: {
        x: Math.random() * 90 + 5, // 5-95%
        y: Math.random() * 90 + 5  // 5-95%
      },
      color: sphereColors[Math.floor(Math.random() * sphereColors.length)],
      delay: Math.random() * 3
    }));
    
    setSpheres(newSpheres);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {spheres.map((sphere) => (
        <div
          key={sphere.id}
          className={`absolute rounded-full ${sphere.color} opacity-30 animate-float border-2 border-black shadow-lg`}
          style={{
            left: `${sphere.position.x}%`,
            top: `${sphere.position.y}%`,
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            animationDelay: `${sphere.delay}s`,
            animationDuration: '8s'
          }}
        />
      ))}
    </div>
  );
};