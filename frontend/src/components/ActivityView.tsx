import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { activitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { defaultActivities } from '../data/blogPosts';
import { Link, FileText, Clock, Star, AlertCircle } from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (user) {
        const userActivities = await activitiesAPI.getAll(user.id);
        setActivities(userActivities.length > 0 ? userActivities : defaultActivities);
      } else {
        setActivities(defaultActivities);
      }
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError('Error al cargar las actividades. Mostrando contenido por defecto.');
      setActivities(defaultActivities);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'personal': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'professional': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'creative': return 'bg-pink-100 text-pink-800 border-pink-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando actividades...</p>
        </div>
      </section>
    );
  }

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
          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border-2 border-amber-200 max-w-md mx-auto">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {activities.map((activity: Activity, index: number) => {
            const isEven = index % 2 === 0;
            
            return (
              <div key={activity.id || activity._id} className="relative mb-8 sm:mb-16 max-w-7xl mx-auto">
                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={activity.character}
                      alt={`Character ${activity.id}`}
                      className="w-32 h-32 drop-shadow-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/12.png';
                      }}
                    />
                    <div 
                      className="w-full p-6 rounded-2xl shadow-lg border-4 border-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      style={{ backgroundColor: '#7DD3C0' }}
                    >
                      <div className="mb-4 flex flex-wrap gap-2">
                        {activity.category && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getCategoryColor(activity.category)}`}>
                            {activity.category}
                          </span>
                        )}
                        {activity.difficulty && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getDifficultyColor(activity.difficulty)}`}>
                            {activity.difficulty}
                          </span>
                        )}
                        {activity.estimatedTime && (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium border-2 border-gray-300 flex items-center gap-1">
                            <Clock size={12} />
                            {activity.estimatedTime}min
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                        {activity.title}
                      </h3>
                      
                      <p className="text-gray-700 text-base leading-relaxed mb-4 text-center">
                        {activity.description}
                      </p>

                      {activity.links && activity.links.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                            <Link size={14} />
                            Enlaces:
                          </h4>
                          <div className="space-y-1">
                            {activity.links.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 text-sm block truncate"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {activity.documents && activity.documents.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                            <FileText size={14} />
                            Documentos:
                          </h4>
                          <div className="space-y-1">
                            {activity.documents.map((doc, docIndex) => (
                              <div key={docIndex} className="text-gray-700 text-sm">
                                {typeof doc === 'string' ? doc : doc.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
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
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/12.png';
                        }}
                      />
                    </div>

                    {/* Activity Card */}
                    <div className={`${isEven ? 'order-1' : 'order-2'} flex-1 max-w-4xl`}>
                      <div 
                        className="p-8 rounded-2xl shadow-lg border-4 border-black cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        style={{ backgroundColor: '#7DD3C0' }}
                      >
                        <div className="mb-4 flex flex-wrap gap-2">
                          {activity.category && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getCategoryColor(activity.category)}`}>
                              {activity.category}
                            </span>
                          )}
                          {activity.difficulty && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getDifficultyColor(activity.difficulty)}`}>
                              {activity.difficulty}
                            </span>
                          )}
                          {activity.estimatedTime && (
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-gray-300 flex items-center gap-1">
                              <Clock size={14} />
                              {activity.estimatedTime}min
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          {activity.title}
                        </h3>
                        
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                          {activity.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {activity.links && activity.links.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                <Link size={16} />
                                Enlaces:
                              </h4>
                              <div className="space-y-1">
                                {activity.links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-600 hover:text-teal-800 text-sm block truncate"
                                  >
                                    {link}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {activity.documents && activity.documents.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                                <FileText size={16} />
                                Documentos:
                              </h4>
                              <div className="space-y-1">
                                {activity.documents.map((doc, docIndex) => (
                                  <div key={docIndex} className="text-gray-700 text-sm">
                                    {typeof doc === 'string' ? doc : doc.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
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