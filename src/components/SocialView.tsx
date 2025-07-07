import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, FileText, Activity, Eye } from 'lucide-react';
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
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Profile View
  if (viewMode === 'profile' && selectedUser) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a Perfiles
          </button>

          {/* User Hero Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-fade-in">
                  {userSettings?.heroTitle || `Blog de ${selectedUser.name}`}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {userSettings?.heroDescription || `Bienvenido al blog personal de ${selectedUser.name}`}
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
                <div className="text-center">
                  <div className="flex items-center gap-1 text-teal-600">
                    <FileText size={16} />
                    <span className="font-bold text-lg">{userPosts.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Activity size={16} />
                    <span className="font-bold text-lg">{userActivities.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Actividades</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-blue-600">
                    <Calendar size={16} />
                    <span className="font-bold text-lg">
                      {new Date(selectedUser.createdAt).getFullYear()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Miembro desde</p>
                </div>
              </div>
            </div>
          </section>

          {/* User Posts */}
          {userPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Posts Recientes</h2>
              <div className="space-y-8">
                {userPosts.map((post: any, index: number) => (
                  <div key={post._id} className="bg-white rounded-3xl shadow-lg p-8 border-4 border-black max-w-4xl mx-auto">
                    <div className="mb-4">
                      <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{post.content}</p>
                    {post.views > 0 && (
                      <div className="mt-4 flex items-center gap-2 text-gray-500">
                        <Eye size={16} />
                        <span className="text-sm">{post.views} visualizaciones</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* User Activities */}
          {userActivities.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Actividades</h2>
              <div className="space-y-8">
                {userActivities.map((activity: any, index: number) => (
                  <div key={activity._id} className="bg-white rounded-3xl shadow-lg p-8 border-4 border-black max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{activity.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">{activity.description}</p>
                    
                    {activity.links && activity.links.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-gray-600 mb-2">Enlaces:</p>
                        {activity.links.map((link: string, linkIndex: number) => (
                          <a
                            key={linkIndex}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-800 text-sm block"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    )}

                    {activity.documents && activity.documents.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-gray-600 mb-2">Documentos:</p>
                        <div className="flex flex-wrap gap-2">
                          {activity.documents.map((doc: any, docIndex: number) => (
                            <span
                              key={docIndex}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm border-2 border-black"
                            >
                              {doc.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activity.images && activity.images.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-600 mb-2">Imágenes:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {activity.images.map((img: any, imgIndex: number) => (
                            <img
                              key={imgIndex}
                              src={img.data}
                              alt={img.name}
                              className="w-full h-24 object-cover rounded border-2 border-black"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {userPosts.length === 0 && userActivities.length === 0 && (
            <div className="text-center py-16">
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
            Descubre los perfiles de otros usuarios y explora su contenido
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
                  <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                  
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
                    Ver Perfil
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