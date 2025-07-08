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
    'text-teal-300',
    'text-emerald-300', 
    'text-cyan-300',
    'text-blue-300',
    'text-purple-300',
    'text-pink-300',
    'text-yellow-300',
    'text-orange-300',
    'text-red-300',
    'text-green-300'
  ];

  useEffect(() => {
    // Posiciones específicas para evitar el contenido central
    const safePositions = [
      { x: 5, y: 10 },   // Top left
      { x: 85, y: 15 },  // Top right
      { x: 10, y: 85 },  // Bottom left
      { x: 80, y: 90 },  // Bottom right
      { x: 5, y: 50 },   // Middle left
      { x: 90, y: 45 },  // Middle right
      { x: 15, y: 25 },  // Upper left
      { x: 75, y: 75 },  // Lower right
      { x: 20, y: 80 },  // Lower left area
      { x: 85, y: 30 }   // Upper right area
    ];

    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 16 + 12, // 12-28px (más pequeños)
      position: safePositions[i % safePositions.length] || { 
        x: Math.random() > 0.5 ? Math.random() * 15 + 5 : Math.random() * 15 + 80, 
        y: Math.random() * 100 
      },
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 8 // 8-18s
    }));
    
    setElements(newElements);
  }, [count, section]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {elements.map((element) => {
        const IconComponent = element.icon;
        return (
          <div
            key={element.id}
            className={`absolute ${element.color} opacity-15 animate-float`}
            style={{
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
              fontSize: `${element.size}px`,
              zIndex: -1
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
    'bg-gradient-to-r from-teal-300 to-emerald-400',
    'bg-gradient-to-r from-blue-300 to-cyan-400',
    'bg-gradient-to-r from-purple-300 to-pink-400',
    'bg-gradient-to-r from-yellow-300 to-orange-400',
    'bg-gradient-to-r from-green-300 to-teal-400',
    'bg-gradient-to-r from-red-300 to-pink-400'
  ];

  useEffect(() => {
    // Posiciones seguras para las esferas (esquinas y bordes)
    const safePositions = [
      { x: 8, y: 12 },   // Top left corner
      { x: 85, y: 8 },   // Top right corner
      { x: 5, y: 85 },   // Bottom left corner
      { x: 88, y: 82 },  // Bottom right corner
      { x: 3, y: 45 },   // Middle left edge
      { x: 92, y: 55 },  // Middle right edge
    ];

    const newSpheres = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 40 + 30, // 30-70px (más pequeñas)
      position: safePositions[i % safePositions.length] || {
        x: Math.random() > 0.5 ? Math.random() * 10 + 2 : Math.random() * 10 + 88,
        y: Math.random() * 90 + 5
      },
      color: sphereColors[Math.floor(Math.random() * sphereColors.length)],
      delay: Math.random() * 3
    }));
    
    setSpheres(newSpheres);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {spheres.map((sphere) => (
        <div
          key={sphere.id}
          className={`absolute rounded-full ${sphere.color} opacity-20 animate-float border-2 border-black shadow-lg`}
          style={{
            left: `${sphere.position.x}%`,
            top: `${sphere.position.y}%`,
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            animationDelay: `${sphere.delay}s`,
            animationDuration: '8s',
            zIndex: -1
          }}
        />
      ))}
    </div>
  );
};