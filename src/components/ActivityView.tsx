import React from 'react';

const defaultActivities = [
  {
    id: 1,
    title: 'Actividad 1',
    description: 'Descripción de la primera actividad que realizamos en clase.',
    character: '/12.png'
  },
  {
    id: 2,
    title: 'Actividad 2', 
    description: 'Segunda actividad donde exploramos nuevos conceptos.',
    character: '/13.png'
  },
  {
    id: 3,
    title: 'Actividad 3',
    description: 'Tercera actividad con ejercicios prácticos.',
    character: '/14.png'
  },
  {
    id: 4,
    title: 'Actividad 4',
    description: 'Cuarta actividad enfocada en el trabajo colaborativo.',
    character: '/15.png'
  },
  {
    id: 5,
    title: 'Actividad 5',
    description: 'Quinta actividad con proyectos creativos.',
    character: '/16.png'
  },
  {
    id: 6,
    title: 'Actividad 6',
    description: 'Sexta actividad de evaluación y reflexión.',
    character: '/12.png'
  }
];

export const ActivityView: React.FC = () => {
  // Load custom activities from localStorage
  const loadActivities = () => {
    const custom = JSON.parse(localStorage.getItem('customActivities') || '[]');
    return custom.length > 0 ? custom : defaultActivities;
  };

  const activities = loadActivities();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Actividades
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Explora todas las actividades y proyectos que hemos desarrollado
          </p>
        </div>

        <div className="space-y-8">
          {activities.map((activity: any, index: number) => {
            const isEven = index % 2 === 0;
            
            return (
              <div key={activity.id} className="relative mb-8 sm:mb-16 max-w-7xl mx-auto">
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={activity.character}
                      alt={`Character ${activity.id}`}
                      className="w-32 h-32 drop-shadow-2xl"
                    />
                    <div 
                      className="w-full p-6 rounded-2xl shadow-lg border-4 border-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{ backgroundColor: '#7DD3C0' }}
                      onClick={() => {
                        console.log(`Navigating to ${activity.title}`);
                      }}
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                        {activity.title}
                      </h3>
                      <p className="text-gray-700 text-base leading-relaxed mb-4 text-center">
                        {activity.description}
                      </p>
                      <div className="text-center">
                        <span className="inline-block bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black hover:bg-gray-100 transition-colors">
                          Ver Actividad →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-center min-h-[250px]">
                  <div className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} w-full`}>
                    {/* Character */}
                    <div className={`${isEven ? 'order-2 ml-12' : 'order-1 mr-12'} flex-shrink-0`}>
                      <img
                        src={activity.character}
                        alt={`Character ${activity.id}`}
                        className="w-48 h-48 lg:w-56 lg:h-56 drop-shadow-2xl"
                      />
                    </div>

                    {/* Activity Card */}
                    <div className={`${isEven ? 'order-1' : 'order-2'} flex-1 max-w-4xl`}>
                      <div 
                        className="p-8 rounded-2xl shadow-lg border-4 border-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={{ backgroundColor: '#7DD3C0' }}
                        onClick={() => {
                          console.log(`Navigating to ${activity.title}`);
                        }}
                      >
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          {activity.title}
                        </h3>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                          {activity.description}
                        </p>
                        <div className="mt-4">
                          <span className="inline-block bg-white text-gray-800 px-6 py-3 rounded-full text-sm font-medium border-2 border-black hover:bg-gray-100 transition-colors">
                            Ver Actividad →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};