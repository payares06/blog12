import React, { useState } from 'react';
import { X, Download, Eye, Heart, MessageCircle, ChevronLeft, ChevronRight, FileText, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

interface PostViewerProps {
  post: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const PostViewer: React.FC<PostViewerProps> = ({ 
  post, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !post) return null;

  const images = post.postImages || [];
  const documents = post.documents || [];
  const isLiked = post.likes?.some((like: any) => like.userId === user?.id);

  const handleLike = async () => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      await postsAPI.toggleLike(post._id);
      onUpdate();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsLoading(true);
    try {
      await postsAPI.addComment(post._id, newComment.trim());
      setNewComment('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Error al agregar comentario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadDocument = (doc: any) => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(doc.data.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: doc.mimeType });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error al descargar el documento');
    }
  };

  const handleViewDocument = (doc: any) => {
    try {
      // Open document in new tab
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${doc.name}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: #f5f5f5;
                }
                .container {
                  max-width: 800px;
                  margin: 0 auto;
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                  border-bottom: 2px solid #14B8A6;
                  padding-bottom: 10px;
                  margin-bottom: 20px;
                }
                .download-btn {
                  background: #14B8A6;
                  color: white;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  text-decoration: none;
                  display: inline-block;
                  margin-top: 10px;
                }
                .download-btn:hover {
                  background: #0F766E;
                }
                iframe {
                  width: 100%;
                  height: 600px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>${doc.name}</h2>
                  <p>Tamaño: ${(doc.size / 1024).toFixed(2)} KB</p>
                  <a href="${doc.data}" download="${doc.name}" class="download-btn">
                    Descargar Documento
                  </a>
                </div>
                ${doc.mimeType === 'application/pdf' ? 
                  `<iframe src="${doc.data}" type="application/pdf"></iframe>` :
                  `<div style="padding: 20px; background: #f9f9f9; border-radius: 5px;">
                    <p>Vista previa no disponible para este tipo de archivo.</p>
                    <p>Haz clic en "Descargar Documento" para ver el contenido.</p>
                  </div>`
                }
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Error al visualizar el documento');
    }
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border-4 border-black flex">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 bg-gradient-to-r from-teal-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black">
                <span className="text-sm font-bold text-white">
                  {post.userId?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{post.userId?.name || 'Usuario'}</h3>
                <p className="text-sm text-gray-600">{post.date}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors border-2 border-black rounded-full p-2 bg-white hover:bg-gray-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Post Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Text Content */}
            <div className="p-6 border-b-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{post.content}</p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border border-black"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images Section */}
            {images.length > 0 && (
              <div className="p-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon size={20} className="text-teal-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Imágenes ({images.length})
                  </h3>
                </div>
                
                {/* Main Image Display */}
                <div className="relative mb-4">
                  <img
                    src={images[currentImageIndex]?.data}
                    alt={images[currentImageIndex]?.name}
                    className="w-full max-h-96 object-contain rounded-lg border-2 border-black shadow-lg bg-gray-50"
                  />
                  
                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={goToNextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                          index === currentImageIndex 
                            ? 'border-teal-500 ring-2 ring-teal-200' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image.data}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Section */}
            {documents.length > 0 && (
              <div className="p-6 border-b-2 border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Documentos ({documents.length})
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {documents.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border border-black">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{doc.name}</p>
                          <p className="text-sm text-gray-600">
                            {(doc.size / 1024).toFixed(2)} KB • {doc.mimeType}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg border-2 border-black hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(doc)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg border-2 border-black hover:bg-green-600 transition-colors text-sm"
                        >
                          <Download size={16} />
                          Descargar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black transition-colors ${
                    isLiked
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{post.likes?.length || 0}</span>
                </button>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <MessageCircle size={18} />
                  <span>{post.comments?.length || 0} comentarios</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye size={18} />
                  <span>{post.views || 0} visualizaciones</span>
                </div>
              </div>

              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleAddComment} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Agrega un comentario..."
                      className="flex-1 p-3 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isLoading}
                      className="bg-teal-500 text-white px-6 py-3 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        'Comentar'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <p>Inicia sesión para comentar y dar like</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Sidebar */}
        <div className="w-80 border-l-2 border-gray-200 flex flex-col bg-gray-50">
          <div className="p-4 border-b-2 border-gray-200 bg-white">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} />
              Comentarios ({post.comments?.length || 0})
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment: any) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {comment.userId?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-3 border-2 border-black shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {comment.userId?.name || 'Usuario'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay comentarios aún</p>
                <p className="text-sm">¡Sé el primero en comentar!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};