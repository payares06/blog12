import React, { useState, useEffect } from 'react';
import { X, Heart, Send, Trash2 } from 'lucide-react';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onUpdate: () => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({ 
  isOpen, 
  onClose, 
  post, 
  onUpdate 
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setComments(post.comments || []);
    }
  }, [isOpen, post]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsLoading(true);
    try {
      const response = await postsAPI.addComment(post._id, newComment.trim());
      setComments(response.comments);
      setNewComment('');
      onUpdate();
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Error al agregar comentario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este comentario?')) return;

    try {
      await postsAPI.deleteComment(post._id, commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      onUpdate();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Error al eliminar comentario');
    }
  };

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

  if (!isOpen || !post) return null;

  const isLiked = post.likes?.some((like: any) => like.userId === user?.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-4 border-black flex">
        {/* Image Section */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {post.postImages && post.postImages.length > 0 ? (
            <img
              src={post.postImages[0].data}
              alt={post.title}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-white text-center p-8">
              <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-300">{post.content}</p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="w-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-gray-200">
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
              className="text-gray-600 hover:text-gray-800 transition-colors border-2 border-black rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Post Content */}
          <div className="p-4 border-b-2 border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2">{post.title}</h4>
            <p className="text-gray-700 text-sm">{post.content}</p>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No hay comentarios aún</p>
                <p className="text-sm">¡Sé el primero en comentar!</p>
              </div>
            ) : (
              comments.map((comment: any) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full flex items-center justify-center border-2 border-black flex-shrink-0">
                    <span className="text-xs font-bold text-white">
                      {comment.userId?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3 border-2 border-black">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-800">
                          {comment.userId?.name || 'Usuario'}
                        </span>
                        {(user?.id === comment.userId?._id || user?.id === post.userId?._id) && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t-2 border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black transition-colors ${
                  isLiked
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{post.likes?.length || 0}</span>
              </button>
              <div className="text-sm text-gray-500">
                {post.views || 0} visualizaciones
              </div>
            </div>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Agrega un comentario..."
                  className="flex-1 p-2 border-2 border-black rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isLoading}
                  className="bg-teal-500 text-white p-2 rounded-lg border-2 border-black hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                <p>Inicia sesión para comentar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};