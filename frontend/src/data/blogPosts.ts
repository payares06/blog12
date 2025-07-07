import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Mi Primer Día en la Universidad',
    content: 'Hoy fue un día muy especial para mí. Comenzar esta nueva etapa de mi vida universitaria me llena de emoción y nervios a la vez. Conocí a muchas personas increíbles y estoy segura de que este será el inicio de grandes aventuras. Los profesores parecen muy preparados y el campus es hermoso. No puedo esperar a ver qué me depara el futuro en este lugar.',
    date: '15 de Enero, 2025',
    image: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['universidad', 'nuevo-comienzo', 'educación']
  },
  {
    id: '2',
    title: 'Reflexiones sobre la Amistad',
    content: 'La amistad es uno de los tesoros más valiosos que podemos tener en la vida. Hoy estuve pensando en todas las personas especiales que han marcado mi camino y me di cuenta de lo afortunada que soy. Cada amigo aporta algo único y especial a mi vida. Desde las risas compartidas hasta los momentos de apoyo en tiempos difíciles, cada experiencia me ha ayudado a crecer como persona.',
    date: '12 de Enero, 2025',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['amistad', 'reflexiones', 'vida-personal']
  },
  {
    id: '3',
    title: 'Mis Metas para Este Año',
    content: 'Este año quiero enfocarme en mi crecimiento personal y académico. He establecido varias metas que espero cumplir: mejorar mis habilidades de programación, leer al menos 20 libros, aprender un nuevo idioma y viajar a un lugar que nunca haya visitado. También quiero dedicar más tiempo a mis pasatiempos y mantener un equilibrio saludable entre el estudio y la diversión.',
    date: '8 de Enero, 2025',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['metas', 'crecimiento-personal', 'año-nuevo']
  },
  {
    id: '4',
    title: 'La Importancia de los Pequeños Momentos',
    content: 'A veces nos enfocamos tanto en los grandes eventos que olvidamos apreciar los pequeños momentos que realmente dan significado a nuestras vidas. Una conversación profunda con un amigo, el aroma del café por la mañana, una puesta de sol hermosa, o simplemente la sensación de logro después de completar una tarea difícil. Estos momentos son los que realmente importan y los que debemos atesorar.',
    date: '5 de Enero, 2025',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['mindfulness', 'gratitud', 'momentos-especiales']
  },
  {
    id: '5',
    title: 'Aprendiendo a Cocinar',
    content: 'Decidí que era hora de aprender a cocinar más que solo pasta y huevos revueltos. Esta semana intenté hacer mi primera lasaña desde cero y, aunque no quedó perfecta, el proceso fue muy divertido y relajante. Cocinar me está enseñando paciencia y creatividad. Además, es una habilidad práctica que definitivamente necesitaré en mi vida independiente. ¡La próxima semana intentaré hacer sushi!',
    date: '2 de Enero, 2025',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['cocina', 'aprendizaje', 'vida-independiente']
  }
];

export const defaultActivities = [
  {
    id: '1',
    title: 'Proyecto de Programación Web',
    description: 'Desarrollo de una aplicación web completa utilizando React, Node.js y MongoDB. Este proyecto incluye autenticación de usuarios, gestión de contenido y una interfaz moderna y responsiva.',
    character: '/12.png',
    category: 'academic' as const,
    difficulty: 'intermediate' as const,
    estimatedTime: 120,
    links: ['https://github.com/ejemplo/proyecto-web'],
    documents: []
  },
  {
    id: '2',
    title: 'Análisis de Datos con Python',
    description: 'Proyecto de análisis de datos utilizando Python, Pandas y Matplotlib. Incluye limpieza de datos, visualizaciones y generación de insights para la toma de decisiones.',
    character: '/13.png',
    category: 'academic' as const,
    difficulty: 'advanced' as const,
    estimatedTime: 90,
    links: ['https://github.com/ejemplo/analisis-datos'],
    documents: []
  },
  {
    id: '3',
    title: 'Diseño de Base de Datos',
    description: 'Diseño e implementación de una base de datos relacional para un sistema de gestión académica. Incluye normalización, índices y procedimientos almacenados.',
    character: '/14.png',
    category: 'academic' as const,
    difficulty: 'intermediate' as const,
    estimatedTime: 60,
    links: [],
    documents: []
  },
  {
    id: '4',
    title: 'Proyecto de Machine Learning',
    description: 'Implementación de algoritmos de machine learning para predicción de tendencias. Utiliza scikit-learn y TensorFlow para crear modelos predictivos.',
    character: '/15.png',
    category: 'academic' as const,
    difficulty: 'advanced' as const,
    estimatedTime: 150,
    links: ['https://github.com/ejemplo/ml-project'],
    documents: []
  },
  {
    id: '5',
    title: 'Aplicación Mobile con React Native',
    description: 'Desarrollo de una aplicación móvil multiplataforma utilizando React Native. Incluye navegación, estado global y integración con APIs externas.',
    character: '/16.png',
    category: 'personal' as const,
    difficulty: 'intermediate' as const,
    estimatedTime: 100,
    links: ['https://github.com/ejemplo/mobile-app'],
    documents: []
  }
];