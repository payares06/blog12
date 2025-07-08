import React from 'react';
import { BlogPost as BlogPostType } from '../types';
import { AnimatedCharacter } from './AnimatedCharacter';

interface BlogPostProps {
  post: BlogPostType;
  characterImage: string;
  index: number;
}

export const BlogPost: React.FC<BlogPostProps> = ({ post, characterImage, index }) => {
  const isEven = index % 2 === 0;
  const characterPosition = isEven ? 'right' : 'left';
  
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
            <div className="mb-4">
              <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                {post.date}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {post.title}
            </h2>
            
            <p className="text-gray-700 leading-relaxed text-base">
              {post.content}
            </p>
            
            <div className="mt-6 flex gap-2 flex-wrap">
              <span className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black">
                Personal
              </span>
              <span className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium border-2 border-black">
                Vida
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-center min-h-[350px]">
        <div className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} w-full`}>
          <div className={`bg-white rounded-3xl shadow-lg p-8 border-4 border-black content-area ${
            isEven ? 'mr-32' : 'ml-32'
          } max-w-3xl relative z-20`}>
            <div className="mb-4">
              <span className="text-sm text-teal-600 font-medium bg-teal-100 px-3 py-1 rounded-full border-2 border-black">
                {post.date}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {post.title}
            </h2>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              {post.content}
            </p>
            
            <div className="mt-6 flex gap-2">
              <span className="bg-teal-200 text-teal-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black">
                Personal
              </span>
              <span className="bg-emerald-200 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium border-2 border-black">
                Vida
              </span>
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