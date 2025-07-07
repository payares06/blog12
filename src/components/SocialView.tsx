import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, FileText, Activity, Eye, Heart, MessageCircle, Image as ImageIcon, Link, Search, Plus } from 'lucide-react';
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
    <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl border-4 border-black p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-xl font-bold text-white">MC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mi Blog Social</h1>
              <p className="text-gray-600">Conecta con la comunidad</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-gray-100 rounded-full border-2 border-black hover:bg-gray-200 transition-colors">
              <Search size={20} className="text-gray-600" />
            </button>
            {currentUser && (
              <button className="p-3 bg-teal-500 text-white rounded-full border-2 border-black hover:bg-teal-600 transition-colors">
                <Plus size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Social Feed */}
        <div className="space-y-6">
          {users.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-4 border-black shadow-lg">
              <User size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">¡Bienvenido a la comunidad!</h3>
              <p className="text-gray-500 mb-6">Sé el primero en unirte y compartir contenido</p>
              {!currentUser && (
                <button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg border-2 border-black hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 font-medium">
                  Únete Ahora
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Load all posts and activities from all users */}
              {users.map((user: any) => (
                <UserFeedCard 
                  key={user._id} 
                  user={user} 
                  currentUser={currentUser}
                  onUserClick={handleUserClick}
                  onLikePost={handleLikePost}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for individual user feed cards
const UserFeedCard: React.FC<{
  user: any;
  currentUser: any;
  onUserClick: (userId: string) => void;
  onLikePost: (postId: string) => void;
}> = ({ user, currentUser, onUserClick, onLikePost }) => {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userActivities, setUserActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserContent();
  }, [user._id]);

  const loadUserContent = async () => {
    try {
      const [posts, activities] = await Promise.all([
        postsAPI.getAll(user._id),
        activitiesAPI.getAll(user._id)
      ]);
      setUserPosts(posts.slice(0, 2)); // Show only latest 2 posts
      setUserActivities(activities.slice(0, 1)); // Show only latest activity
    } catch (error) {
      console.error('Failed to load user content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border-4 border-black shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-32 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const allContent = [
    ...userPosts.map(post => ({ ...post, type: 'post' })),
    ...userActivities.map(activity => ({ ...activity, type: 'activity' }))
  ].sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());

  if (allContent.length === 0) {
    return null; // Don't show users with no content
  }

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-lg overflow-hidden">
      {/* User Header */}
      <div className="p-4 border-b-2 border-gray-100">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onUserClick(user._id)}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-lg font-bold text-white">
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-600">
                {user.postsCount || 0} posts • {user.activitiesCount || 0} actividades
              </p>
            </div>
          </div>
          <button 
            onClick={() => onUserClick(user._id)}
            className="text-teal-600 hover:text-teal-800 font-medium text-sm"
          >
            Ver perfil
          </button>
        </div>
      </div>

      {/* Content Feed */}
      <div className="divide-y-2 divide-gray-100">
        {allContent.map((item: any, index: number) => (
          <div key={`${item.type}-${item._id}-${index}`} className="p-4">
            {/* Content Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border border-black ${
                  item.type === 'post' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {item.type === 'post' ? 'Post' : 'Actividad'}
                </span>
                <span className="text-xs text-gray-500">
                  {item.type === 'post' ? item.date : new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                {item.type === 'post' ? item.content : item.description}
              </p>
            </div>

            {/* Activity Media Preview */}
            {item.type === 'activity' && item.images && item.images.length > 0 && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  {item.images.slice(0, 2).map((img: any, imgIndex: number) => (
                    <img
                      key={imgIndex}
                      src={img.data}
                      alt={img.name}
                      className="w-full h-24 object-cover rounded-lg border-2 border-black"
                    />
                  ))}
                </div>
                {item.images.length > 2 && (
                  <p className="text-xs text-gray-500 mt-1">+{item.images.length - 2} más</p>
                )}
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4">
                {item.type === 'post' && (
                  <button
                    onClick={() => onLikePost(item._id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full border border-black transition-colors text-sm ${
                      item.likes && item.likes.some((like: any) => like.userId === currentUser?.id)
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={14} />
                    <span>{item.likes ? item.likes.length : 0}</span>
                  </button>
                )}
                
                <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm border border-black">
                  <MessageCircle size={14} />
                  <span>Comentar</span>
                </button>
              </div>
              
              {item.type === 'post' && (
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Eye size={12} />
                  <span>{item.views || 0}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};