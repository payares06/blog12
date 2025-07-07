import React from 'react';
import { BlogPost as BlogPostType } from '../types';
import { AnimatedCharacter } from './AnimatedCharacter';
import { Heart, Eye, Calendar, Tag } from 'lucide-react';

interface BlogPostProps {
  post: BlogPostType;
  characterImage: string;
  index: number;
  onLike?: (postId: string) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post, characterImage, index, onLike }) => {
  const isEven = index % 2 === 0;
  const characterPosition = isEven ? 'right' : 'left';
  
  const handleLike = () => {
    if (onLike && (post.id || post._id)) {
      onLike(post.id || post._id!);
    }
  };

  return (
    <article className="relative mb-8 sm:mb-16 max-w-6xl mx-auto">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={characterImage}
            alt={`character-${index}`}
            className="w-32 h-32 drop-shadow-2xl"
          />
          <div className="bg-white rounded-3xl shadow-lg p-6 border-4 border-black w-full relative z-20">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                <Calendar size={14} />
                {post.date}
              </div>
              {post.views !== undefined && (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Eye size={14} />
                  {post.views}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {post.title}
            </h2>
            
            <p className="text-gray-700 leading-relaxed text-base mb-4">
              {post.content}
            </p>

            {post.image && (
              <div className="mb-4">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg border-2 border-black"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {post.tags && post.tags.length > 0 ? (
                  post.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black flex items-center gap-1"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black">
                      Personal
                    </span>
                    <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black">
                      Vida
                    </span>
                  </>
                )}
              </div>

              {onLike && (
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Heart size={16} className={post.likes && post.likes.length > 0 ? 'fill-current' : ''} />
                  <span className="text-sm">{post.likes?.length || 0}</span>
                </button>
              )}
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
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                <Calendar size={14} />
                {post.date}
              </div>
              {post.views !== undefined && (
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Eye size={16} />
                  {post.views}
                </div>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {post.title}
            </h2>
            
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {post.content}
            </p>

            {post.image && (
              <div className="mb-6">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg border-2 border-black"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {post.tags && post.tags.length > 0 ? (
                  post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="bg-teal-200 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black flex items-center gap-1"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="bg-teal-200 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black">
                      Personal
                    </span>
                    <span className="bg-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black">
                      Vida
                    </span>
                  </>
                )}
              </div>

              {onLike && (
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors px-3 py-2 rounded-full hover:bg-red-50 border-2 border-black"
                >
                  <Heart size={18} className={post.likes && post.likes.length > 0 ? 'fill-current' : ''} />
                  <span>{post.likes?.length || 0}</span>
                </button>
              )}
            </div>
          </div>

          <AnimatedCharacter
            imageSrc={characterImage}
            alt={`character-${index}`}
            delay={index * 300}
            position={characterPosition}
          />
        </div>
      </div>
    </article>
  );
};