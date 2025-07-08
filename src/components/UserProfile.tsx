import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Calendar, FileText, Activity, Eye, Heart, MessageCircle, Image as ImageIcon, Link, Grid, List } from 'lucide-react';
import { usersAPI, siteSettingsAPI, postsAPI, activitiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ImageGallery } from './ImageGallery';

interface UserProfileProps {
  userId: string;
  onBack: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onBack }) => {
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userActivities, setUserActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'activities'>('posts');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
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
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const openImageGallery = (images: any[], startIndex: number = 0) => {
    setGalleryImages(images);
    setGalleryStartIndex(startIndex);
    setIsGalleryOpen(true);
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
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuario no encontrado</h2>
          <button
            onClick={onBack}
            className="bg-teal-500 text-white px-6 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Get all images from posts for gallery view
  const allPostImages = userPosts.flatMap(post => 
    post.postImages?.map((img: any, index: number) => ({
      ...img,
      postId: post._id,
      postTitle: post.title,
      postIndex: index
    })) || []
  );

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: '#F5F5DC' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors bg-white px-4 py-2 rounded-lg border-2 border-black shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border-4 border-black p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <div className="w-32 h-32 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
              <span className="text-4xl font-bold text-white">
                {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedUser.name}</h1>
              
              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-8 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800">{userPosts.length}</div>
                  <div className="text-sm text-gray-600">publicaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800">{userActivities.length}</div>
                  <div className="text-sm text-gray-600">actividades</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800">
                    {userPosts.reduce((total, post) => total + (post.likes?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">likes</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 leading-relaxed">
                {userSettings?.heroDescription || `Perfil de ${selectedUser.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg border-4 border-black shadow-lg overflow-hidden">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Grid size={20} />
              PUBLICACIONES
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-l-2 border-black ${
                activeTab === 'activities'
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Activity size={20} />
              ACTIVIDADES
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'posts' ? (
          <div>
            {userPosts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-4 border-black">
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Sin publicaciones aún</h3>
                <p className="text-gray-500">
                  {selectedUser.name} no ha compartido ninguna publicación
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                {allPostImages.map((image, index) => (
                  <div
                    key={`${image.postId}-${image.postIndex}`}
                    className="aspect-square cursor-pointer group relative overflow-hidden"
                    onClick={() => openImageGallery(allPostImages, index)}
                  >
                    <img
                      src={image.data}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
                        <Heart size={24} className="mx-auto mb-1" />
                        <span className="text-sm font-medium">Ver publicación</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {userActivities.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-4 border-black">
                <Activity size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">Sin actividades aún</h3>
                <p className="text-gray-500">
                  {selectedUser.name} no ha compartido ninguna actividad
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userActivities.map((activity: any) => (
                  <div key={activity._id} className="bg-white rounded-2xl shadow-lg border-4 border-black p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                        <span className="text-lg font-bold text-white">
                          {selectedUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{activity.description}</p>

                    {/* Activity Images */}
                    {activity.images && activity.images.length > 0 && (
                      <div className="mb-4">
                        <div 
                          className="grid grid-cols-2 md:grid-cols-4 gap-2 cursor-pointer"
                          onClick={() => openImageGallery(activity.images, 0)}
                        >
                          {activity.images.slice(0, 4).map((img: any, imgIndex: number) => (
                            <img
                              key={imgIndex}
                              src={img.data}
                              alt={img.name}
                              className="w-full h-24 object-cover rounded border-2 border-black hover:opacity-80 transition-opacity"
                            />
                          ))}
                          {activity.images.length > 4 && (
                            <div className="w-full h-24 bg-gray-100 rounded border-2 border-black flex items-center justify-center text-gray-600 font-medium">
                              +{activity.images.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {activity.links && activity.links.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                          <Link size={16} />
                          Enlaces
                        </p>
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={galleryImages}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
};