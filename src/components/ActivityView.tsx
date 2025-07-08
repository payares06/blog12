import React, { useState, useEffect } from 'react';
import { activitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FloatingElements, DecorativeSpheres, GeometricShapes, FloatingParticles } from './FloatingElements';
import { RandomCharacter, RandomCharacterGroup } from './RandomCharacter';

export const ActivityView: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      if (user) {
        // Load user's activities from API
        const activitiesData = await activitiesAPI.getAll(user.id);
        setActivities(activitiesData);
      } else {
        // No activities for non-authenticated users
        setActivities([]);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 pt-32 overflow-hidden">
      {/* Elementos decorativos */}
      <FloatingElements count={8} section="activities" />
      <DecorativeSpheres count={5} />
      <GeometricShapes count={3} />
      <FloatingParticles count={12} />
      <RandomCharacterGroup count={1} className="hidden lg:block" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Mis Actividades
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {user 
              ? 'Aquí puedes ver todas las actividades que has creado'
              : 'Inicia sesión para ver y gestionar tus actividades'
            }
          </p>
        </div>

        {!user ? (
          <div className="text-center py-16 bg-white rounded-2xl border-4 border-black shadow-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-black mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Acceso Restringido</h3>
            <p className="text-gray-500 mb-6">
              Debes iniciar sesión para ver y gestionar tus actividades
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg border-2 border-black hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border-4 border-black shadow-lg">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center border-2 border-black mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No tienes actividades aún</h3>
            <p className="text-gray-500 mb-6">
              Crea tu primera actividad desde el dashboard para comenzar
            </p>
            <button
              onClick={() => {
                // This would trigger navigation to dashboard
                const event = new CustomEvent('navigate-to-dashboard');
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg border-2 border-black hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 font-medium"
            >
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Personaje de bienvenida */}
            <div className="flex justify-center mb-12">
              <RandomCharacter size="medium" animated={true} />
            </div>
            
            {activities.map((activity: any, index: number) => {
              const isEven = index % 2 === 0;
              const characterImages = ['/12.png', '/13.png', '/14.png', '/15.png', '/16.png'];
              const characterImage = characterImages[index % characterImages.length];
              
              return (
                <div key={activity._id} className="relative mb-8 sm:mb-16 max-w-7xl mx-auto">
                  {/* Personajes aleatorios ocasionales */}
                  {index % 3 === 0 && index > 0 && (
                    <div className="absolute -top-8 -right-16 hidden lg:block" style={{ zIndex: -1 }}>
                      <RandomCharacter size="small" animated={true} safeMode={true} />
                    </div>
                  )}
                  
                  {/* Mobile Layout */}
                  <div className="sm:hidden">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={characterImage}
                        alt={`Character ${activity._id}`}
                        className="w-32 h-32 drop-shadow-2xl"
                      />
                      <div 
                        className="w-full p-6 rounded-2xl shadow-lg border-4 border-black"
                        style={{ backgroundColor: '#7DD3C0' }}
                      >
                        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                          {activity.title}
                        </h3>
                        <p className="text-gray-700 text-base leading-relaxed mb-4 text-center">
                          {activity.description}
                        </p>

                        {/* Activity Content */}
                        {((activity.documents && activity.documents.length > 0) || 
                          (activity.images && activity.images.length > 0) ||
                          (activity.links && activity.links.length > 0)) && (
                          <div className="mt-4 space-y-3">
                            {activity.documents && activity.documents.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">
                                  Documentos ({activity.documents.length})
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {activity.documents.map((doc: any, docIndex: number) => (
                                    <span
                                      key={docIndex}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs border border-black"
                                    >
                                      {doc.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activity.images && activity.images.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">
                                  Imágenes ({activity.images.length})
                                </p>
                                <div className="grid grid-cols-3 gap-1">
                                  {activity.images.slice(0, 3).map((img: any, imgIndex: number) => (
                                    <img
                                      key={imgIndex}
                                      src={img.data}
                                      alt={img.name}
                                      className="w-full h-12 object-cover rounded border border-black"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {activity.links && activity.links.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-2">Enlaces:</p>
                                {activity.links.slice(0, 2).map((link: string, linkIndex: number) => (
                                  <a
                                    key={linkIndex}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-xs block truncate"
                                  >
                                    {link}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-center min-h-[250px]">
                    <div className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} w-full`}>
                      {/* Character */}
                      <div className={`${isEven ? 'order-2 ml-12' : 'order-1 mr-12'} flex-shrink-0`}>
                        <img
                          src={characterImage}
                          alt={`Character ${activity._id}`}
                          className="w-48 h-48 lg:w-56 lg:h-56 drop-shadow-2xl"
                        />
                      </div>

                      {/* Activity Card */}
                      <div className={`${isEven ? 'order-1' : 'order-2'} flex-1 max-w-4xl`}>
                        <div 
                          className="p-8 rounded-2xl shadow-lg border-4 border-black"
                          style={{ backgroundColor: '#7DD3C0' }}
                        >
                          <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            {activity.title}
                          </h3>
                          <p className="text-gray-700 text-lg leading-relaxed mb-6">
                            {activity.description}
                          </p>

                          {/* Activity Content */}
                          {((activity.documents && activity.documents.length > 0) || 
                            (activity.images && activity.images.length > 0) ||
                            (activity.links && activity.links.length > 0)) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Documents */}
                              {activity.documents && activity.documents.length > 0 && (
                                <div>
                                  <p className="font-medium text-gray-600 mb-2">
                                    Documentos ({activity.documents.length})
                                  </p>
                                  <div className="space-y-1 max-h-24 overflow-y-auto">
                                    {activity.documents.map((doc: any, docIndex: number) => (
                                      <div key={docIndex} className="bg-white/50 p-2 rounded text-sm border border-black">
                                        {doc.name}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Images */}
                              {activity.images && activity.images.length > 0 && (
                                <div>
                                  <p className="font-medium text-gray-600 mb-2">
                                    Imágenes ({activity.images.length})
                                  </p>
                                  <div className="grid grid-cols-3 gap-2 max-h-24 overflow-y-auto">
                                    {activity.images.map((img: any, imgIndex: number) => (
                                      <img
                                        key={imgIndex}
                                        src={img.data}
                                        alt={img.name}
                                        className="w-full h-16 object-cover rounded border border-black"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Links */}
                          {activity.links && activity.links.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium text-gray-600 mb-2">Enlaces:</p>
                              <div className="space-y-1">
                                {activity.links.map((link: string, linkIndex: number) => (
                                  <a
                                    key={linkIndex}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm block"
                                  >
                                    {link}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};