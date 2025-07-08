import React, { useEffect, useState } from 'react';
import { Atom, Compass, Satellite, Book, PenTool, Heart, Star, Zap, Globe, Sparkles, Music, Camera, Palette, Coffee, Flower, Sun, Moon, Cloud, Snowflake, Leaf, Diamond, Gem, Crown, Feather, Router as Butterfly, Fish, Bird, Cat, Dog, Rabbit } from 'lucide-react';

interface FloatingElementsProps {
  count?: number;
  section?: string;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ count = 12, section = 'default' }) => {
  const [elements, setElements] = useState<Array<{
    id: number;
    icon: React.ComponentType<any>;
    color: string;
    size: number;
    position: { x: number; y: number };
    delay: number;
    duration: number;
    animationType: string;
  }>>([]);

  const icons = [
    Atom, Compass, Satellite, Book, PenTool, Heart, Star, Zap, Globe, Sparkles,
    Music, Camera, Palette, Coffee, Flower, Sun, Moon, Cloud, Snowflake, Leaf,
    Diamond, Gem, Crown, Feather, Butterfly, Fish, Bird, Cat, Dog, Rabbit
  ];

  const colors = [
    'text-teal-300', 'text-emerald-300', 'text-cyan-300', 'text-blue-300',
    'text-purple-300', 'text-pink-300', 'text-yellow-300', 'text-orange-300',
    'text-red-300', 'text-green-300', 'text-indigo-300', 'text-violet-300',
    'text-rose-300', 'text-amber-300', 'text-lime-300', 'text-sky-300'
  ];

  const animationTypes = [
    'animate-float', 'animate-bounce-slow', 'animate-pulse-slow', 
    'animate-wiggle', 'animate-spin-slow', 'animate-sway'
  ];

  useEffect(() => {
    // Más posiciones distribuidas por toda la pantalla
    const safePositions = [
      // Esquinas
      { x: 3, y: 8 }, { x: 92, y: 12 }, { x: 5, y: 88 }, { x: 88, y: 85 },
      // Bordes superiores
      { x: 15, y: 5 }, { x: 25, y: 8 }, { x: 35, y: 6 }, { x: 45, y: 9 },
      { x: 55, y: 7 }, { x: 65, y: 10 }, { x: 75, y: 5 }, { x: 85, y: 8 },
      // Bordes inferiores
      { x: 12, y: 92 }, { x: 22, y: 88 }, { x: 32, y: 90 }, { x: 42, y: 87 },
      { x: 52, y: 91 }, { x: 62, y: 89 }, { x: 72, y: 93 }, { x: 82, y: 86 },
      // Bordes laterales
      { x: 2, y: 25 }, { x: 4, y: 35 }, { x: 3, y: 45 }, { x: 5, y: 55 },
      { x: 2, y: 65 }, { x: 4, y: 75 }, { x: 95, y: 28 }, { x: 93, y: 38 },
      { x: 96, y: 48 }, { x: 94, y: 58 }, { x: 95, y: 68 }, { x: 93, y: 78 },
      // Áreas intermedias seguras
      { x: 18, y: 20 }, { x: 78, y: 25 }, { x: 20, y: 75 }, { x: 75, y: 70 },
      { x: 25, y: 30 }, { x: 70, y: 35 }, { x: 30, y: 65 }, { x: 65, y: 60 }
    ];

    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      icon: icons[Math.floor(Math.random() * icons.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 20 + 10, // 10-30px
      position: safePositions[i % safePositions.length] || { 
        x: Math.random() > 0.5 ? Math.random() * 20 + 2 : Math.random() * 20 + 78, 
        y: Math.random() * 100 
      },
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 6, // 6-18s
      animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)]
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
            className={`absolute ${element.color} opacity-20 ${element.animationType}`}
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

// Componente para esferas decorativas con más variedad
export const DecorativeSpheres: React.FC<{ count?: number }> = ({ count = 8 }) => {
  const [spheres, setSpheres] = useState<Array<{
    id: number;
    size: number;
    position: { x: number; y: number };
    color: string;
    delay: number;
    animationType: string;
    opacity: number;
  }>>([]);

  const sphereColors = [
    'bg-gradient-to-r from-teal-200 to-emerald-300',
    'bg-gradient-to-r from-blue-200 to-cyan-300',
    'bg-gradient-to-r from-purple-200 to-pink-300',
    'bg-gradient-to-r from-yellow-200 to-orange-300',
    'bg-gradient-to-r from-green-200 to-teal-300',
    'bg-gradient-to-r from-red-200 to-pink-300',
    'bg-gradient-to-r from-indigo-200 to-purple-300',
    'bg-gradient-to-r from-rose-200 to-red-300',
    'bg-gradient-to-r from-amber-200 to-yellow-300',
    'bg-gradient-to-r from-lime-200 to-green-300'
  ];

  const animationTypes = ['animate-float', 'animate-bounce-slow', 'animate-pulse-slow'];

  useEffect(() => {
    // Más posiciones para las esferas
    const safePositions = [
      // Esquinas principales
      { x: 5, y: 10 }, { x: 88, y: 8 }, { x: 3, y: 85 }, { x: 90, y: 88 },
      // Posiciones intermedias
      { x: 15, y: 15 }, { x: 80, y: 20 }, { x: 12, y: 75 }, { x: 85, y: 70 },
      // Bordes laterales
      { x: 2, y: 40 }, { x: 95, y: 45 }, { x: 4, y: 60 }, { x: 92, y: 35 },
      // Áreas adicionales
      { x: 25, y: 12 }, { x: 70, y: 18 }, { x: 20, y: 82 }, { x: 75, y: 78 }
    ];

    const newSpheres = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 50 + 25, // 25-75px
      position: safePositions[i % safePositions.length] || {
        x: Math.random() > 0.5 ? Math.random() * 15 + 2 : Math.random() * 15 + 83,
        y: Math.random() * 90 + 5
      },
      color: sphereColors[Math.floor(Math.random() * sphereColors.length)],
      delay: Math.random() * 5,
      animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)],
      opacity: Math.random() * 0.15 + 0.1 // 0.1-0.25
    }));
    
    setSpheres(newSpheres);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {spheres.map((sphere) => (
        <div
          key={sphere.id}
          className={`absolute rounded-full ${sphere.color} ${sphere.animationType} border border-black/20 shadow-lg`}
          style={{
            left: `${sphere.position.x}%`,
            top: `${sphere.position.y}%`,
            width: `${sphere.size}px`,
            height: `${sphere.size}px`,
            animationDelay: `${sphere.delay}s`,
            animationDuration: '10s',
            opacity: sphere.opacity,
            zIndex: -1
          }}
        />
      ))}
    </div>
  );
};

// Nuevo componente para formas geométricas adicionales
export const GeometricShapes: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const [shapes, setShapes] = useState<Array<{
    id: number;
    type: 'triangle' | 'square' | 'diamond' | 'hexagon';
    size: number;
    position: { x: number; y: number };
    color: string;
    delay: number;
    rotation: number;
  }>>([]);

  const shapeColors = [
    'border-teal-300', 'border-emerald-300', 'border-cyan-300', 'border-blue-300',
    'border-purple-300', 'border-pink-300', 'border-yellow-300', 'border-orange-300'
  ];

  useEffect(() => {
    const safePositions = [
      { x: 8, y: 15 }, { x: 85, y: 12 }, { x: 10, y: 80 }, { x: 88, y: 75 },
      { x: 20, y: 25 }, { x: 75, y: 30 }, { x: 15, y: 65 }, { x: 80, y: 60 }
    ];

    const newShapes = Array.from({ length: count }, (_, i) => ({
      id: i,
      type: ['triangle', 'square', 'diamond', 'hexagon'][Math.floor(Math.random() * 4)] as any,
      size: Math.random() * 30 + 20, // 20-50px
      position: safePositions[i % safePositions.length] || {
        x: Math.random() > 0.5 ? Math.random() * 20 + 5 : Math.random() * 20 + 75,
        y: Math.random() * 80 + 10
      },
      color: shapeColors[Math.floor(Math.random() * shapeColors.length)],
      delay: Math.random() * 6,
      rotation: Math.random() * 360
    }));
    
    setShapes(newShapes);
  }, [count]);

  const getShapeClasses = (type: string, size: number, color: string) => {
    const baseClasses = `absolute border-2 ${color} opacity-15 animate-spin-slow`;
    
    switch (type) {
      case 'triangle':
        return `${baseClasses} border-l-transparent border-r-transparent border-b-0`;
      case 'square':
        return `${baseClasses} border-4`;
      case 'diamond':
        return `${baseClasses} border-4 transform rotate-45`;
      case 'hexagon':
        return `${baseClasses} border-4 rounded-lg`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={getShapeClasses(shape.type, shape.size, shape.color)}
          style={{
            left: `${shape.position.x}%`,
            top: `${shape.position.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: `${shape.delay}s`,
            animationDuration: '15s',
            transform: `rotate(${shape.rotation}deg)`,
            zIndex: -1
          }}
        />
      ))}
    </div>
  );
};

// Componente para partículas flotantes pequeñas
export const FloatingParticles: React.FC<{ count?: number }> = ({ count = 15 }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    size: number;
    position: { x: number; y: number };
    color: string;
    delay: number;
    opacity: number;
  }>>([]);

  const particleColors = [
    'bg-teal-400', 'bg-emerald-400', 'bg-cyan-400', 'bg-blue-400',
    'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-orange-400',
    'bg-red-400', 'bg-green-400', 'bg-indigo-400', 'bg-violet-400'
  ];

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 8 + 3, // 3-11px
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1 // 0.1-0.4
    }));
    
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color} animate-float`}
          style={{
            left: `${particle.position.x}%`,
            top: `${particle.position.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '12s',
            opacity: particle.opacity,
            zIndex: -1
          }}
        />
      ))}
    </div>
  );
};