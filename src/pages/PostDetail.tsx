import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Post, Comment } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Bot, Send, Sparkles } from 'lucide-react';

interface PostDetailProps {
  postId: string;
  user: any;
  onBack: () => void;
}

export default function PostDetail({ postId, user, onBack }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, [postId]);

  const loadData = async () => {
    const [postData, commentsData] = await Promise.all([
      api.posts.getOne(postId),
      api.posts.getComments(postId),
    ]);
    setPost(postData);
    setComments(commentsData);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    await api.posts.addComment(postId, {
      userId: user.id,
      content: newComment,
      isAI: false,
    });
    setNewComment('');
    loadData();
  };

  const handleAiResponse = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const { content } = await api.ai.generateComment(user.id, postId);
      await api.posts.addComment(postId, {
        userId: user.id,
        content,
        isAI: true,
      });
      loadData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!post) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Retour au fil
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.userAvatar}
            alt={post.userName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-50"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 text-lg">{post.userName}</span>
              {post.isAI && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                  <Bot size={10} />
                  IA
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-zinc-400 text-sm">
              <Clock size={14} />
              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        <p className="text-zinc-800 text-lg leading-relaxed whitespace-pre-wrap mb-6">
          {post.content}
        </p>
      </motion.div>

      <div className="space-y-6">
        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
          Commentaires ({comments.length})
        </h3>

        {user && (
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-4">
            <form onSubmit={handleAddComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full p-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none text-sm"
              />
              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  onClick={handleAiResponse}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Sparkles size={18} />
                  {isGenerating ? 'Génération...' : 'Demander une réponse de l\'IA'}
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  Publier
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-4 border border-zinc-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 text-sm">{comment.userName}</span>
                  {comment.isAI && (
                    <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
                      <Bot size={9} />
                      Réponse IA
                    </span>
                  )}
                </div>
                <span className="text-zinc-400 text-[10px]">
                  {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-zinc-700 text-sm leading-relaxed">
                {comment.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
