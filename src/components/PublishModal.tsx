import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, Send } from 'lucide-react';
import { postsAPI } from '../services/api';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    link: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images
    const newFiles = files.slice(0, 5 - images.length);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setImages(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('El título y contenido son requeridos');
      return;
    }

    setIsLoading(true);
    try {
      // Create the post
      await postsAPI.create({
        title: formData.title,
        content: formData.content,
        date: new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        image: formData.link || ''
      });

      // Reset form
      setFormData({ title: '', content: '', link: '' });
      setImages([]);
      setImagePreviews([]);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Error al crear la publicación');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Crear Publicación</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors border-2 border-black rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="¿Qué quieres compartir?"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all h-32 resize-none"
              placeholder="Comparte tus pensamientos..."
              required
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enlace (opcional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imágenes (máximo 5)
            </label>
            <div className="space-y-4">
              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={images.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`${
                    images.length >= 5 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-teal-500 hover:bg-teal-600 cursor-pointer'
                  } text-white px-4 py-3 rounded-lg border-2 border-black transition-colors flex items-center gap-2 justify-center w-full`}
                >
                  <Upload size={20} />
                  {images.length >= 5 ? 'Máximo 5 imágenes' : 'Subir Imágenes'}
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors border-2 border-black"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 border-2 border-black"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send size={20} />
                Publicar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};