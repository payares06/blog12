import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, FileText, Activity, Eye, Heart, MessageCircle, Image as ImageIcon, Link } from 'lucide-react';
import { usersAPI, siteSettingsAPI, postsAPI, activitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SocialViewProps {
  selectedUserId?: string;
  onBack?: () => void;
}

export const SocialView: React.FC<SocialViewProps> = ({ selectedUserId, onBack }) => {
  const { user: currentUser } = useAuth();
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

  const handleLikePost = async (postId: string) => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      await postsAPI.toggleLike(postId);
      // Reload user posts to update like count
      const posts = await postsAPI.getAll(selectedUser._id);
      setUserPosts(posts);
    } catch (error) {
      console.error('Failed to like post:', error);
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
            Volver al Foro
          </button>

          {/* User Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg border-4 border-black p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="w-32 h-32 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedUser.name}</h1>
                <p className="text-gray-600 mb-4">{selectedUser.email}</p>
                
                {/* User Stats */}
                <div className="flex justify-center md:justify-start gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-teal-600 justify-center">
                      <FileText size={16} />
                      <span className="font-bold text-lg">{userPosts.length}</span>
                    </div>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-emerald-600 justify-center">
                      <Activity size={16} />
                      <span className="font-bold text-lg">{userActivities.length}</span>
                    </div>
                    <p className="text-sm text-gray-600">Actividades</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-blue-600 justify-center">
                      <Calendar size={16} />
                      <span className="font-bold text-lg">
                        {new Date(selectedUser.createdAt).getFullYear()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Miembro desde</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio/Description */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <p className="text-gray-700 text-lg leading-relaxed">
                {userSettings?.heroDescription || `Bienvenido al blog personal de ${selectedUser.name}. Aquí comparte sus pensamientos, experiencias y reflexiones.`}
              </p>
            </div>
          </div>

          {/* Posts and Activities Feed */}
          <div className="space-y-6">
            {/* Combine posts and activities into a single feed */}
            {[...userPosts.map(post => ({ ...post, type: 'post' })), 
              ...userActivities.map(activity => ({ ...activity, type: 'activity' }))
            ]
              .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
              .map((item: any, index: number) => (
                <div key={`${item.type}-${item._id}`} className="bg-white rounded-2xl shadow-lg border-4 border-black p-6">
                  {/* User Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-lg font-bold text-white">
                        {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.type === 'post' ? item.date : new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 border-black ${
                        item.type === 'post' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.type === 'post' ? 'Post' : 'Actividad'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {item.type === 'post' ? item.content : item.description}
                    </p>
                  </div>

                  {/* Activity specific content */}
                  {item.type === 'activity' && (
                    <div className="mb-4 space-y-3">
                      {/* Images */}
                      {item.images && item.images.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                            <ImageIcon size={16} />
                            Imágenes ({item.images.length})
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {item.images.slice(0, 4).map((img: any, imgIndex: number) => (
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

                      {/* Documents */}
                      {item.documents && item.documents.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                            <FileText size={16} />
                            Documentos ({item.documents.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.documents.map((doc: any, docIndex: number) => (
                              <span
                                key={docIndex}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm border-2 border-black"
                              >
                                {doc.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Links */}
                      {item.links && item.links.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                            <Link size={16} />
                            Enlaces
                          </p>
                          <div className="space-y-1">
                            {item.links.map((link: string, linkIndex: number) => (
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
                  )}

                  {/* Interaction Bar */}
                  <div className="flex items-center gap-6 pt-4 border-t-2 border-gray-100">
                    {item.type === 'post' && (
                      <>
                        <button
                          onClick={() => handleLikePost(item._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black transition-colors ${
                            item.likes && item.likes.some((like: any) => like.userId === currentUser?.id)
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart size={16} />
                          <span>{item.likes ? item.likes.length : 0}</span>
                        </button>
                        
                        <div className="flex items-center gap-2 text-gray-500">
                          <Eye size={16} />
                          <span>{item.views || 0} visualizaciones</span>
                        </div>
                      </>
                    )}

                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageCircle size={16} />
                      <span>Comentarios</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {userPosts.length === 0 && userActivities.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border-4 border-black">
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

  // Forum-style Users List View
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Foro de la Comunidad
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Conecta con otros miembros, explora sus perfiles y descubre contenido increíble
          </p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-4 border-black shadow-lg">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay usuarios registrados</h3>
            <p className="text-gray-500">Sé el primero en unirte a la comunidad</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user: any) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl border-4 border-black shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] p-6"
                onClick={() => handleUserClick(user._id)}
              >
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black flex-shrink-0">
                    <span className="text-xl font-bold text-white">
                      {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                      <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium border border-black">
                        Miembro
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{user.email}</p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-teal-600">
                        <FileText size={14} />
                        <span className="font-bold">{user.postsCount || 0}</span>
                        <span className="text-gray-500">posts</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Activity size={14} />
                        <span className="font-bold">{user.activitiesCount || 0}</span>
                        <span className="text-gray-500">actividades</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={12} />
                        <span>Se unió en {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    <button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-2 px-6 rounded-lg border-2 border-black hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 font-medium">
                      Ver Perfil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};