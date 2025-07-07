import React, { useState, useEffect } from 'react';
import { Save, Upload, Edit3, Image, FileText, Trash2, Plus, Link, FileUp, Home, Users, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI, activitiesAPI, imagesAPI, siteSettingsAPI } from '../services/api';
import { PublishModal } from './PublishModal';

interface DashboardProps {
  onDataUpdate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onDataUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'activities' | 'home'>('content');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [posts, setPosts] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [homeSettings, setHomeSettings] = useState({ heroTitle: '', heroDescription: '' });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Load data from API
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'content') {
        const postsData = await postsAPI.getAll(user?.id);
        setPosts(postsData);
      } else if (activeTab === 'activities') {
        const activitiesData = await activitiesAPI.getAll(user?.id);
        setActivities(activitiesData);
      } else if (activeTab === 'images') {
        const imagesData = await imagesAPI.getAll();
        setImages(imagesData);
      } else if (activeTab === 'home') {
        const settings = await siteSettingsAPI.getSettings();
        setHomeSettings(settings);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateUploadProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return interval;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('png')) {
      alert('Solo se permiten archivos PNG');
      return;
    }

    // Create image to check dimensions
    const img = new Image();
    img.onload = async () => {
      if (img.width !== 512 || img.height !== 512) {
        alert('La imagen debe ser de 512x512 píxeles');
        return;
      }

      const progressInterval = simulateUploadProgress();

      try {
        await imagesAPI.upload(file);
        setUploadProgress(100);
        setTimeout(async () => {
          await loadData();
          onDataUpdate();
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Error al subir la imagen');
        setIsUploading(false);
        setUploadProgress(0);
        clearInterval(progressInterval);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleActivityFileUpload = async (activityId: string, file: File, type: 'document' | 'image') => {
    const progressInterval = simulateUploadProgress();

    try {
      if (type === 'document') {
        await activitiesAPI.uploadDocument(activityId, file);
      } else {
        await activitiesAPI.uploadImage(activityId, file);
      }
      
      setUploadProgress(100);
      setTimeout(async () => {
        await loadData();
        onDataUpdate();
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Error al subir ${type === 'document' ? 'documento' : 'imagen'}`);
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const saveHomeSettings = async () => {
    try {
      setLoading(true);
      await siteSettingsAPI.updateSettings(homeSettings);
      onDataUpdate();
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (id: string, data: any) => {
    setIsEditing(id);
    setEditData({ ...data });
  };

  const saveEdit = async () => {
    if (!isEditing) return;

    try {
      setLoading(true);
      
      if (activeTab === 'content') {
        if (editData._id) {
          await postsAPI.update(editData._id, editData);
        } else {
          await postsAPI.create(editData);
        }
      } else if (activeTab === 'activities') {
        if (editData._id) {
          await activitiesAPI.update(editData._id, editData);
        } else {
          await activitiesAPI.create(editData);
        }
      }

      await loadData();
      onDataUpdate();
      setIsEditing(null);
      setEditData({});
    } catch (error) {
      console.error('Save failed:', error);
      alert('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;

    try {
      setLoading(true);
      
      if (activeTab === 'content') {
        await postsAPI.delete(id);
      } else if (activeTab === 'activities') {
        await activitiesAPI.delete(id);
      } else if (activeTab === 'images') {
        await imagesAPI.delete(id);
      }

      await loadData();
      onDataUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const deleteActivityFile = async (activityId: string, fileId: string, type: 'document' | 'image') => {
    if (!confirm(`¿Estás seguro de que quieres eliminar este ${type === 'document' ? 'documento' : 'imagen'}?`)) return;

    try {
      setLoading(true);
      
      if (type === 'document') {
        await activitiesAPI.deleteDocument(activityId, fileId);
      } else {
        await activitiesAPI.deleteImage(activityId, fileId);
      }

      await loadData();
      onDataUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const addNew = () => {
    const newId = 'new-' + Date.now().toString();
    if (activeTab === 'content') {
      startEditing(newId, {
        title: 'Nuevo Post',
        content: 'Contenido del nuevo post...',
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        image: ''
      });
    } else if (activeTab === 'activities') {
      startEditing(newId, {
        title: 'Nueva Actividad',
        description: 'Descripción de la nueva actividad...',
        character: '/12.png',
        links: [],
        documents: [],
        images: []
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder al dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-600">Gestiona el contenido de tu blog</p>
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-lg border-2 border-black hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-medium shadow-lg"
            >
              <Send size={20} />
              Publicar
            </button>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mb-6 bg-white p-4 rounded-lg border-4 border-black shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Upload className="text-teal-600" size={20} />
              <span className="font-medium text-gray-800">Subiendo archivo...</span>
              <span className="text-sm text-gray-600">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
              <div 
                className="bg-gradient-to-r from-teal-500 to-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b-2 border-black overflow-x-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'home'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              <Home className="inline mr-2" size={20} />
              Editar Inicio
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <FileText className="inline mr-2" size={20} />
              Contenido
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'activities'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <Edit3 className="inline mr-2" size={20} />
              Actividades
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === 'images'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <Image className="inline mr-2" size={20} />
              Imágenes
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        )}

        {/* Home Settings Tab */}
        {activeTab === 'home' && !loading && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración del Inicio</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={homeSettings.heroTitle}
                    onChange={(e) => setHomeSettings({ ...homeSettings, heroTitle: e.target.value })}
                    className="w-full p-3 border-2 border-black rounded-lg font-bold text-xl"
                    placeholder="Bienvenidos a Mi Mundo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={homeSettings.heroDescription}
                    onChange={(e) => setHomeSettings({ ...homeSettings, heroDescription: e.target.value })}
                    className="w-full p-3 border-2 border-black rounded-lg h-32"
                    placeholder="Un espacio donde comparto mis pensamientos, experiencias y momentos especiales..."
                  />
                </div>
                
                <button
                  onClick={saveHomeSettings}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg border-2 border-black hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Save size={20} />
                  Guardar Configuración
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Posts del Blog</h2>
              <button
                onClick={addNew}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Post
              </button>
            </div>

            {posts.length === 0 && !isEditing && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-black">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay posts aún</h3>
                <p className="text-gray-500 mb-4">Crea tu primer post para comenzar</p>
                <button
                  onClick={addNew}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors"
                >
                  Crear Primer Post
                </button>
              </div>
            )}

            <div className="grid gap-6">
              {posts.map((post: any) => (
                <div key={post._id} className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
                  {isEditing === post._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg font-bold text-xl"
                        placeholder="Título del post"
                      />
                      <textarea
                        value={editData.content || ''}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg h-32"
                        placeholder="Contenido del post"
                      />
                      <input
                        type="text"
                        value={editData.date || ''}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg"
                        placeholder="Fecha"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <Save size={16} />
                          Guardar
                        </button>
                        <button
                          onClick={() => setIsEditing(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                          <p className="text-sm text-gray-600">{post.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(post._id, post)}
                            className="bg-blue-500 text-white p-2 rounded-lg border-2 border-black hover:bg-blue-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(post._id)}
                            className="bg-red-500 text-white p-2 rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700">{post.content}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* New post form */}
              {isEditing && !posts.find(p => p._id === isEditing) && (
                <div className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg font-bold text-xl"
                      placeholder="Título del post"
                    />
                    <textarea
                      value={editData.content || ''}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg h-32"
                      placeholder="Contenido del post"
                    />
                    <input
                      type="text"
                      value={editData.date || ''}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg"
                      placeholder="Fecha"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Save size={16} />
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Imágenes de Personajes</h2>
              <div>
                <input
                  type="file"
                  accept=".png"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="character-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="character-upload"
                  className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600 cursor-pointer'} text-white px-4 py-2 rounded-lg border-2 border-black transition-colors flex items-center gap-2`}
                >
                  <Upload size={20} />
                  {isUploading ? 'Subiendo...' : 'Subir Imagen (512x512 PNG)'}
                </label>
              </div>
            </div>

            {images.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-black">
                <Image size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay imágenes aún</h3>
                <p className="text-gray-500 mb-4">Sube tu primera imagen de personaje</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image: any) => (
                <div key={image._id} className="bg-white p-4 rounded-lg border-4 border-black shadow-lg">
                  <img
                    src={image.data}
                    alt={image.name}
                    className="w-full h-48 object-cover rounded-lg border-2 border-black mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{image.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteItem(image._id)}
                      className="bg-red-500 text-white p-2 rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Actividades</h2>
              <button
                onClick={addNew}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Nueva Actividad
              </button>
            </div>

            {activities.length === 0 && !isEditing && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-black">
                <Edit3 size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay actividades aún</h3>
                <p className="text-gray-500 mb-4">Crea tu primera actividad</p>
                <button
                  onClick={addNew}
                  className="bg-teal-500 text-white px-6 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors"
                >
                  Crear Primera Actividad
                </button>
              </div>
            )}

            <div className="grid gap-6">
              {activities.map((activity: any) => (
                <div key={activity._id} className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
                  {isEditing === activity._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editData.title || ''}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg font-bold text-xl"
                        placeholder="Título de la actividad"
                      />
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg h-32"
                        placeholder="Descripción de la actividad"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Enlaces</label>
                          <textarea
                            value={editData.links?.join('\n') || ''}
                            onChange={(e) => setEditData({ 
                              ...editData, 
                              links: e.target.value.split('\n').filter(link => link.trim()) 
                            })}
                            className="w-full p-3 border-2 border-black rounded-lg h-24"
                            placeholder="Un enlace por línea"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          <Save size={16} />
                          Guardar
                        </button>
                        <button
                          onClick={() => setIsEditing(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                          {activity.links && activity.links.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-gray-600 mb-1">Enlaces:</p>
                              {activity.links.map((link: string, index: number) => (
                                <a
                                  key={index}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal-600 hover:text-teal-800 text-sm block"
                                >
                                  <Link size={14} className="inline mr-1" />
                                  {link}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(activity._id, activity)}
                            className="bg-blue-500 text-white p-2 rounded-lg border-2 border-black hover:bg-blue-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(activity._id)}
                            className="bg-red-500 text-white p-2 rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{activity.description}</p>

                      {/* File Upload Section */}
                      <div className="border-t-2 border-gray-200 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Documents Section */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-gray-700">Documentos ({activity.documents?.length || 0}/3)</h4>
                              {(!activity.documents || activity.documents.length < 3) && (
                                <div>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.txt"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleActivityFileUpload(activity._id, file, 'document');
                                    }}
                                    className="hidden"
                                    id={`doc-upload-${activity._id}`}
                                    disabled={isUploading}
                                  />
                                  <label
                                    htmlFor={`doc-upload-${activity._id}`}
                                    className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'} text-white px-3 py-1 rounded text-sm border-2 border-black transition-colors flex items-center gap-1`}
                                  >
                                    <FileUp size={14} />
                                    Subir Doc
                                  </label>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {activity.documents?.map((doc: any, index: number) => (
                                <div key={doc._id || index} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                                  <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                                  <button
                                    onClick={() => deleteActivityFile(activity._id, doc._id, 'document')}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Images Section */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-gray-700">Imágenes ({activity.images?.length || 0}/5)</h4>
                              {(!activity.images || activity.images.length < 5) && (
                                <div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleActivityFileUpload(activity._id, file, 'image');
                                    }}
                                    className="hidden"
                                    id={`img-upload-${activity._id}`}
                                    disabled={isUploading}
                                  />
                                  <label
                                    htmlFor={`img-upload-${activity._id}`}
                                    className={`${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 cursor-pointer'} text-white px-3 py-1 rounded text-sm border-2 border-black transition-colors flex items-center gap-1`}
                                  >
                                    <Image size={14} />
                                    Subir Img
                                  </label>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                              {activity.images?.map((img: any, index: number) => (
                                <div key={img._id || index} className="relative">
                                  <img
                                    src={img.data}
                                    alt={img.name}
                                    className="w-full h-16 object-cover rounded border-2 border-black"
                                  />
                                  <button
                                    onClick={() => deleteActivityFile(activity._id, img._id, 'image')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* New activity form */}
              {isEditing && !activities.find(a => a._id === isEditing) && (
                <div className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg font-bold text-xl"
                      placeholder="Título de la actividad"
                    />
                    <textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg h-32"
                      placeholder="Descripción de la actividad"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enlaces</label>
                      <textarea
                        value={editData.links?.join('\n') || ''}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          links: e.target.value.split('\n').filter(link => link.trim()) 
                        })}
                        className="w-full p-3 border-2 border-black rounded-lg h-24"
                        placeholder="Un enlace por línea"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Save size={16} />
                        Guardar
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-600 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSuccess={onDataUpdate}
      />
    </div>
  );
};