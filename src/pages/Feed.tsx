import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Post } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageCircle, Clock, Bot, User } from 'lucide-react';

interface FeedProps {
  user: any;
  onPostClick: (postId: string) => void;
}

export default function Feed({ user, onPostClick }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSubject, setAiSubject] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const data = await api.posts.getAll();
    setPosts(data);
  };

  const handleManualPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    await api.posts.create({
      userId: user.id,
      content: newPostContent,
      isAI: false,
    });
    setNewPostContent('');
    loadPosts();
  };

  const handleAiGeneratePost = async () => {
    if (!aiSubject.trim()) return;
    setIsGenerating(true);
    try {
      const { content } = await api.ai.generatePost(user.id, aiSubject);
      setNewPostContent(content);
      setShowAiInput(false);
      setAiSubject('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-4 mb-8"
        >
          <form onSubmit={handleManualPost}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Quoi de neuf ?"
              className="w-full p-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-none text-zinc-900 placeholder-zinc-400"
            />
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => setShowAiInput(!showAiInput)}
                className="flex items-center gap-2 text-indigo-600 font-medium text-sm hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
              >
                <Sparkles size={18} />
                Générer avec l'IA
              </button>
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
              >
                Publier
                <Send size={16} />
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showAiInput && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-zinc-100"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    placeholder="Sujet de la publication (ex: Le futur de la tech)"
                    className="flex-1 p-2 bg-indigo-50 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    onClick={handleAiGeneratePost}
                    disabled={isGenerating || !aiSubject.trim()}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-200 disabled:opacity-50"
                  >
                    {isGenerating ? 'Génération...' : 'Générer'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden hover:border-indigo-200 transition-colors cursor-pointer"
            onClick={() => onPostClick(post.id)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-zinc-50"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{post.userName}</span>
                      {post.isAI && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                          <Bot size={10} />
                          IA
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400 text-xs">
                      <Clock size={12} />
                      {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-zinc-800 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            <div className="bg-zinc-50 px-4 py-3 border-t border-zinc-100 flex items-center gap-4 text-zinc-500 text-sm">
              <div className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                <MessageCircle size={18} />
                Commenter
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
