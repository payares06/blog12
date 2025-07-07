import React, { useState, useEffect } from 'react';
import { Save, Upload, Edit3, Image, FileText, Trash2, Plus, Link, FileUp, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI, activitiesAPI, imagesAPI, siteSettingsAPI } from '../services/api';
import { BlogPost, Activity, CharacterImage } from '../types';

interface DashboardProps {
  onDataUpdate: () => void;
}

interface UploadProgress {
  [key: string]: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ onDataUpdate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'images' | 'activities' | 'settings'>('content');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [images, setImages] = useState<CharacterImage[]>([]);
  const [siteSettings, setSiteSettings] = useState({
    heroTitle: 'Bienvenidos a Mi Mundo',
    heroDescription: 'Un espacio donde comparto mis pensamientos, experiencias y momentos especiales. Cada historia es una ventana a mi corazón y mis reflexiones sobre la vida.'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  // Load data from API
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
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
      } else if (activeTab === 'settings') {
        const settingsData = await siteSettingsAPI.getSettings();
        setSiteSettings(settingsData);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('png')) {
      showError('Solo se permiten archivos PNG');
      return;
    }

    // Create image to check dimensions
    const img = new Image();
    img.onload = async () => {
      if (img.width !== 512 || img.height !== 512) {
        showError('La imagen debe ser de 512x512 píxeles');
        return;
      }

      try {
        setLoading(true);
        const uploadId = `image-${Date.now()}`;
        
        await imagesAPI.upload(file, '', [], false, (progress) => {
          setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        });
        
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[uploadId];
          return newProgress;
        });
        
        await loadData();
        onDataUpdate();
        showSuccess('Imagen subida exitosamente');
      } catch (error) {
        console.error('Upload failed:', error);
        showError('Error al subir la imagen');
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[uploadId];
          return newProgress;
        });
      } finally {
        setLoading(false);
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleActivityFileUpload = async (activityId: string, file: File, type: 'document' | 'image') => {
    try {
      const uploadId = `${type}-${activityId}-${Date.now()}`;
      
      if (type === 'document') {
        await activitiesAPI.uploadDocument(activityId, file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        });
      } else {
        await activitiesAPI.uploadImage(activityId, file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
        });
      }
      
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[uploadId];
        return newProgress;
      });
      
      await loadData();
      showSuccess(`${type === 'document' ? 'Documento' : 'Imagen'} subido exitosamente`);
    } catch (error) {
      console.error('Upload failed:', error);
      showError(`Error al subir ${type === 'document' ? 'el documento' : 'la imagen'}`);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[uploadId];
        return newProgress;
      });
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
          showSuccess('Post actualizado exitosamente');
        } else {
          await postsAPI.create(editData);
          showSuccess('Post creado exitosamente');
        }
      } else if (activeTab === 'activities') {
        if (editData._id) {
          await activitiesAPI.update(editData._id, editData);
          showSuccess('Actividad actualizada exitosamente');
        } else {
          await activitiesAPI.create(editData);
          showSuccess('Actividad creada exitosamente');
        }
      } else if (activeTab === 'settings') {
        await siteSettingsAPI.updateSettings(editData);
        showSuccess('Configuración actualizada exitosamente');
      }

      await loadData();
      onDataUpdate();
      setIsEditing(null);
      setEditData({});
    } catch (error) {
      console.error('Save failed:', error);
      showError('Error al guardar. Por favor, intenta de nuevo.');
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
        showSuccess('Post eliminado exitosamente');
      } else if (activeTab === 'activities') {
        await activitiesAPI.delete(id);
        showSuccess('Actividad eliminada exitosamente');
      } else if (activeTab === 'images') {
        await imagesAPI.delete(id);
        showSuccess('Imagen eliminada exitosamente');
      }

      await loadData();
      onDataUpdate();
    } catch (error) {
      console.error('Delete failed:', error);
      showError('Error al eliminar. Por favor, intenta de nuevo.');
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
        image: '',
        tags: []
      });
    } else if (activeTab === 'activities') {
      startEditing(newId, {
        title: 'Nueva Actividad',
        description: 'Descripción de la nueva actividad...',
        character: '/12.png',
        links: [],
        category: 'academic',
        difficulty: 'beginner',
        estimatedTime: 60
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
          <p className="text-lg text-gray-600">Gestiona el contenido de tu blog</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="mb-6 space-y-2">
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Subiendo archivo...</span>
                  <span className="text-sm text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b-2 border-black">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors ${
                activeTab === 'content'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <FileText className="inline mr-2" size={20} />
              Contenido
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors ${
                activeTab === 'images'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <Image className="inline mr-2" size={20} />
              Imágenes
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors ${
                activeTab === 'activities'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <Edit3 className="inline mr-2" size={20} />
              Actividades
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium border-2 border-black rounded-t-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-teal-50'
              }`}
            >
              <Edit3 className="inline mr-2" size={20} />
              Configuración
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Configuración del Sitio</h2>
            </div>

            <div className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
              {isEditing === 'settings' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Título Principal</label>
                    <input
                      type="text"
                      value={editData.heroTitle || ''}
                      onChange={(e) => setEditData({ ...editData, heroTitle: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg font-bold text-xl"
                      placeholder="Título principal del sitio"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={editData.heroDescription || ''}
                      onChange={(e) => setEditData({ ...editData, heroDescription: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg h-32"
                      placeholder="Descripción que aparece en la página principal"
                      maxLength={500}
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
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Configuración del Hero</h3>
                      <p className="text-sm text-gray-600">Edita el título y descripción que aparecen en la página principal</p>
                    </div>
                    <button
                      onClick={() => startEditing('settings', siteSettings)}
                      className="bg-blue-500 text-white p-2 rounded-lg border-2 border-black hover:bg-blue-600 transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Título:</h4>
                      <p className="text-gray-800 text-lg">{siteSettings.heroTitle}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">Descripción:</h4>
                      <p className="text-gray-700">{siteSettings.heroDescription}</p>
                    </div>
                  </div>
                </div>
              )}
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
              {posts.map((post: BlogPost) => (
                <div key={post._id || post.id} className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
                  {isEditing === (post._id || post.id) ? (
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
                      <input
                        type="url"
                        value={editData.image || ''}
                        onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg"
                        placeholder="URL de la imagen (opcional)"
                      />
                      <input
                        type="text"
                        value={editData.tags?.join(', ') || ''}
                        onChange={(e) => setEditData({ 
                          ...editData, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                        })}
                        className="w-full p-3 border-2 border-black rounded-lg"
                        placeholder="Tags separados por comas"
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
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-2 flex gap-1 flex-wrap">
                              {post.tags.map((tag, index) => (
                                <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(post._id || post.id, post)}
                            className="bg-blue-500 text-white p-2 rounded-lg border-2 border-black hover:bg-blue-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(post._id || post.id)}
                            className="bg-red-500 text-white p-2 rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      {post.image && (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg border-2 border-black"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* New post form */}
              {isEditing && !posts.find(p => (p._id || p.id) === isEditing) && (
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
                    <input
                      type="url"
                      value={editData.image || ''}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg"
                      placeholder="URL de la imagen (opcional)"
                    />
                    <input
                      type="text"
                      value={editData.tags?.join(', ') || ''}
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                      })}
                      className="w-full p-3 border-2 border-black rounded-lg"
                      placeholder="Tags separados por comas"
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
                />
                <label
                  htmlFor="character-upload"
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Upload size={20} />
                  Subir Imagen (512x512 PNG)
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
              {images.map((image: CharacterImage) => (
                <div key={image._id || image.id} className="bg-white p-4 rounded-lg border-4 border-black shadow-lg">
                  <img
                    src={image.data}
                    alt={image.name}
                    className="w-full h-48 object-cover rounded-lg border-2 border-black mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{image.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(image.createdAt || '').toLocaleDateString()}
                      </p>
                      {image.description && (
                        <p className="text-sm text-gray-500 mt-1">{image.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteItem(image._id || image.id)}
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
              {activities.map((activity: Activity) => (
                <div key={activity._id || activity.id} className="bg-white p-6 rounded-lg border-4 border-black shadow-lg">
                  {isEditing === (activity._id || activity.id) ? (
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                          <select
                            value={editData.category || 'academic'}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="w-full p-3 border-2 border-black rounded-lg"
                          >
                            <option value="academic">Académico</option>
                            <option value="personal">Personal</option>
                            <option value="professional">Profesional</option>
                            <option value="creative">Creativo</option>
                            <option value="other">Otro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                          <select
                            value={editData.difficulty || 'beginner'}
                            onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                            className="w-full p-3 border-2 border-black rounded-lg"
                          >
                            <option value="beginner">Principiante</option>
                            <option value="intermediate">Intermedio</option>
                            <option value="advanced">Avanzado</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo estimado (minutos)</label>
                        <input
                          type="number"
                          value={editData.estimatedTime || ''}
                          onChange={(e) => setEditData({ ...editData, estimatedTime: parseInt(e.target.value) })}
                          className="w-full p-3 border-2 border-black rounded-lg"
                          placeholder="60"
                        />
                      </div>
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
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                          <div className="flex gap-2 mt-2">
                            {activity.category && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {activity.category}
                              </span>
                            )}
                            {activity.difficulty && (
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                {activity.difficulty}
                              </span>
                            )}
                            {activity.estimatedTime && (
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                                {activity.estimatedTime}min
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(activity._id || activity.id, activity)}
                            className="bg-blue-500 text-white p-2 rounded-lg border-2 border-black hover:bg-blue-600 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(activity._id || activity.id)}
                            className="bg-red-500 text-white p-2 rounded-lg border-2 border-black hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{activity.description}</p>

                      {/* Links */}
                      {activity.links && activity.links.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                            <Link size={14} />
                            Enlaces:
                          </h4>
                          <div className="space-y-1">
                            {activity.links.map((link: string, index: number) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-800 text-sm block"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Documents */}
                      {activity.documents && activity.documents.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                            <FileText size={14} />
                            Documentos ({activity.documents.length}/3):
                          </h4>
                          <div className="space-y-2">
                            {activity.documents.map((doc: any, index: number) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                                <div className="flex items-center gap-2">
                                  <FileText size={16} className="text-gray-600" />
                                  <span className="text-sm text-gray-700">{doc.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(doc.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <a
                                    href={doc.data}
                                    download={doc.name}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                    title="Descargar"
                                  >
                                    <Download size={14} />
                                  </a>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await activitiesAPI.deleteDocument(activity._id || activity.id, doc._id);
                                        await loadData();
                                        showSuccess('Documento eliminado exitosamente');
                                      } catch (error) {
                                        showError('Error al eliminar el documento');
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Eliminar"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Images */}
                      {activity.images && activity.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                            <Image size={14} />
                            Imágenes ({activity.images.length}/5):
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {activity.images.map((img: any, index: number) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img.data}
                                  alt={img.name}
                                  className="w-full h-24 object-cover rounded border-2 border-gray-300"
                                />
                                <button
                                  onClick={async () => {
                                    try {
                                      await activitiesAPI.deleteImage(activity._id || activity.id, img._id);
                                      await loadData();
                                      showSuccess('Imagen eliminada exitosamente');
                                    } catch (error) {
                                      showError('Error al eliminar la imagen');
                                    }
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Eliminar imagen"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload buttons */}
                      <div className="flex gap-2 mt-4">
                        {(!activity.documents || activity.documents.length < 3) && (
                          <div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.txt"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleActivityFileUpload(activity._id || activity.id, file, 'document');
                                }
                              }}
                              className="hidden"
                              id={`doc-upload-${activity._id || activity.id}`}
                            />
                            <label
                              htmlFor={`doc-upload-${activity._id || activity.id}`}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm border-2 border-black hover:bg-blue-600 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <FileUp size={14} />
                              Subir Documento
                            </label>
                          </div>
                        )}
                        
                        {(!activity.images || activity.images.length < 5) && (
                          <div>
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleActivityFileUpload(activity._id || activity.id, file, 'image');
                                }
                              }}
                              className="hidden"
                              id={`img-upload-${activity._id || activity.id}`}
                            />
                            <label
                              htmlFor={`img-upload-${activity._id || activity.id}`}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm border-2 border-black hover:bg-green-600 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Image size={14} />
                              Subir Imagen
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* New activity form */}
              {isEditing && !activities.find(a => (a._id || a.id) === isEditing) && (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <select
                          value={editData.category || 'academic'}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="w-full p-3 border-2 border-black rounded-lg"
                        >
                          <option value="academic">Académico</option>
                          <option value="personal">Personal</option>
                          <option value="professional">Profesional</option>
                          <option value="creative">Creativo</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dificultad</label>
                        <select
                          value={editData.difficulty || 'beginner'}
                          onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                          className="w-full p-3 border-2 border-black rounded-lg"
                        >
                          <option value="beginner">Principiante</option>
                          <option value="intermediate">Intermedio</option>
                          <option value="advanced">Avanzado</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo estimado (minutos)</label>
                      <input
                        type="number"
                        value={editData.estimatedTime || ''}
                        onChange={(e) => setEditData({ ...editData, estimatedTime: parseInt(e.target.value) })}
                        className="w-full p-3 border-2 border-black rounded-lg"
                        placeholder="60"
                      />
                    </div>
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
    </div>
  );
};