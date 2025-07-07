import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, FileText, Activity, Eye, Heart, MessageCircle } from 'lucide-react';
import { usersAPI, siteSettingsAPI, postsAPI, activitiesAPI } from '../services/api';

interface SocialViewProps {
  selectedUserId?: string;
  onBack?: () => void;
}

export const SocialView: React.FC<SocialViewProps> = ({ selectedUserId, onBack }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userActivities, setUserActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'profile'>('list');

  useEffect(() => {
    if (selectedUserId) {
      setViewMode('profile');
      loadUserProfile(selectedUserId);
    } else {
      loadUsers();
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const [user, settings, posts, activities] = await Promise.all([
        usersAPI.getById(userId),
        siteSettingsAPI.getPublicSettings(userId),
        postsAPI.getAll(userId),
        activitiesAPI.getAll(userId)
      ]);

      setSelectedUser(user);
      setUserSettings(settings);
      setUserPosts(posts);
      setUserActivities(activities);
      setViewMode('profile');
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    loadUserProfile(userId);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
    setUserSettings(null);
    setUserPosts([]);
    setUserActivities([]);
    if (onBack) {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  // Profile View - User's Personal Blog
  if (viewMode === 'profile' && selectedUser) {
    const characterImages = ['/12.png', '/13.png', '/14.png', '/15.png', '/16.png'];
    
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F5F5DC' }}>
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors bg-white px-4 py-2 rounded-lg border-2 border-black shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft size={20} />
            Volver a la Comunidad
          </button>

          {/* User's Blog Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
                  {userSettings?.heroTitle || `Blog de ${selectedUser.name}`}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {userSettings?.heroDescription || `Bienvenido al mundo personal de ${selectedUser.name}. Descubre sus pensamientos, experiencias y reflexiones.`}
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg border-2 border-black">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-2xl sm:text-4xl font-bold text-white">
                      {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="mt-8 flex justify-center gap-6">
                <div className="text-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-black">
                  <div className="flex items-center gap-1 text-teal-600 justify-center">
                    <FileText size={16} />
                    <span className="font-bold text-lg">{userPosts.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-black">
                  <div className="flex items-center gap-1 text-emerald-600 justify-center">
                    <Activity size={16} />
                    <span className="font-bold text-lg">{userActivities.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Actividades</p>
                </div>
                <div className="text-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-black">
                  <div className="flex items-center gap-1 text-blue-600 justify-center">
                    <Calendar size={16} />
                    <span className="font-bold text-lg">
                      {new Date(selectedUser.createdAt).getFullYear()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Miembro desde</p>
                </div>
              </div>

              {/* Floating elements */}
              <div className="hidden sm:block absolute top-20 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-50 animate-float border-2 border-black"></div>
              <div className="hidden sm:block absolute top-40 right-20 w-16 h-16 bg-emerald-200 rounded-full opacity-50 animate-float-delayed border-2 border-black"></div>
              <div className="hidden sm:block absolute bottom-20 left-1/4 w-12 h-12 bg-cyan-200 rounded-full opacity-50 animate-float border-2 border-black"></div>
            </div>
          </section>

          {/* User's Blog Posts */}
          {userPosts.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  Últimas Reflexiones de {selectedUser.name.split(' ')[0]}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Descubre los pensamientos y experiencias compartidas en este blog personal
                </p>
              </div>

              <div className="space-y-8">
                {userPosts.map((post: any, index: number) => {
                  const isEven = index % 2 === 0;
                  const characterImage = characterImages[index % characterImages.length];
                  
                  return (
                    <article key={post._id} className="relative mb-8 sm:mb-16 max-w-6xl mx-auto">
                      {/* Mobile Layout */}
                      <div className="sm:hidden">
                        <div className="flex flex-col items-center space-y-4">
                          <img
                            src={characterImage}
                            alt={`character-${index}`}
                            className="w-32 h-32 drop-shadow-2xl"
                          />
                          <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-black w-full relative z-20">
                            <div className="mb-4">
                              <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                                {post.date}
                              </span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-700 leading-relaxed text-base mb-4">
                              {post.content}
                            </p>

                            {/* Post Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
                              {post.views > 0 && (
                                <div className="flex items-center gap-1">
                                  <Eye size={14} />
                                  <span>{post.views}</span>
                                </div>
                              )}
                              {post.likes && post.likes.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Heart size={14} />
                                  <span>{post.likes.length}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 flex gap-2 flex-wrap">
                              <span className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black">
                                Personal
                              </span>
                              <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black">
                                Blog
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-center min-h-[350px]">
                        <div className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} w-full`}>
                          <div className={`bg-white rounded-3xl shadow-lg p-8 border-4 border-black ${
                            isEven ? 'mr-32' : 'ml-32'
                          } max-w-3xl relative z-20`}>
                            <div className="mb-4">
                              <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                                {post.date}
                              </span>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">
                              {post.title}
                            </h3>
                            
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                              {post.content}
                            </p>

                            {/* Post Stats */}
                            <div className="flex items-center gap-6 text-sm text-gray-500 border-t pt-4 mb-4">
                              {post.views > 0 && (
                                <div className="flex items-center gap-2">
                                  <Eye size={16} />
                                  <span>{post.views} visualizaciones</span>
                                </div>
                              )}
                              {post.likes && post.likes.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Heart size={16} />
                                  <span>{post.likes.length} me gusta</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <span className="bg-teal-200 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black">
                                Personal
                              </span>
                              <span className="bg-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black">
                                Blog
                              </span>
                            </div>
                          </div>

                          {/* Character Image */}
                          <div className={`absolute ${isEven ? '-right-12' : '-left-12'} top-1/2 transform -translate-y-1/2`}>
                            <img
                              src={characterImage}
                              alt={`character-${index}`}
                              className="w-52 h-52 sm:w-60 sm:h-60 drop-shadow-2xl"
                            />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* User Activities Section */}
          {userActivities.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  Actividades de {selectedUser.name.split(' ')[0]}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                  Proyectos y actividades desarrolladas
                </p>
              </div>

              <div className="space-y-8">
                {userActivities.map((activity: any, index: number) => {
                  const isEven = index % 2 === 0;
                  const characterImage = characterImages[index % characterImages.length];
                  
                  return (
                    <div key={activity._id} className="relative mb-8 sm:mb-16 max-w-7xl mx-auto">
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

                            {/* Activity Files */}
                            {((activity.documents && activity.documents.length > 0) || 
                              (activity.images && activity.images.length > 0)) && (
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
                              </div>
                            )}

                            {activity.links && activity.links.length > 0 && (
                              <div className="mt-4">
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
            </section>
          )}

          {/* Empty State */}
          {userPosts.length === 0 && userActivities.length === 0 && (
            <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg border-2 border-black">
              <User size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                {selectedUser.name} aún no ha publicado contenido
              </h3>
              <p className="text-gray-500">
                Vuelve más tarde para ver sus posts y actividades
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Users List View
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Comunidad Social
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los blogs personales de otros usuarios y explora su contenido único
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-black">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-500">Sé el primero en unirte a la comunidad</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: any) => (
              <div
                key={user._id}
                className="bg-white p-6 rounded-lg border-4 border-black shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleUserClick(user._id)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black mx-auto mb-4">
                    <span className="text-xl font-bold text-white">
                      {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 truncate">{user.email}</p>
                  
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-teal-600">
                        <FileText size={14} />
                        <span className="font-bold">{user.postsCount || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Posts</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-emerald-600">
                        <Activity size={14} />
                        <span className="font-bold">{user.activitiesCount || 0}</span>
                      </div>
                      <p className="text-xs text-gray-500">Actividades</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    <Calendar size={12} className="inline mr-1" />
                    Miembro desde {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2 px-4 rounded-lg border-2 border-black hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 font-medium">
                    Ver Blog Personal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};