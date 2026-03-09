import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { AIConfig, ChatMessage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Save, Sparkles, Send, User, Settings, Info } from 'lucide-react';

interface AIDoubleProps {
  user: any;
}

export default function AIDouble({ user }: AIDoubleProps) {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoPosting, setIsAutoPosting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const loadConfig = async () => {
    const data = await api.ai.getConfig(user.id);
    setConfig(data);
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setIsSaving(true);
    try {
      await api.ai.updateConfig(user.id, config);
      alert('Configuration sauvegardée !');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !config) return;

    const userMsg: ChatMessage = { role: 'user', text: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const { response } = await api.ai.chat(user.id, inputMessage, chatMessages);
      setChatMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAutoPost = async () => {
    setIsAutoPosting(true);
    try {
      await api.ai.autoPost(user.id);
      alert('Votre double IA a publié un nouveau post !');
    } catch (error) {
      console.error(error);
    } finally {
      setIsAutoPosting(false);
    }
  };

  if (!config) return <div className="p-8 text-center text-zinc-500">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Personnalité de ton Double</h2>
              <p className="text-sm text-zinc-500">Configure comment ton IA doit se comporter.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateConfig} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Personnalité</label>
              <textarea
                value={config.personality}
                onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                className="w-full p-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[80px]"
                placeholder="Ex: Curieux, sarcastique, passionné de tech..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Style d'écriture</label>
              <textarea
                value={config.style}
                onChange={(e) => setConfig({ ...config, style: e.target.value })}
                className="w-full p-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[80px]"
                placeholder="Ex: Décontracté, beaucoup d'emojis, phrases courtes..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">Centres d'intérêt</label>
              <textarea
                value={config.interests}
                onChange={(e) => setConfig({ ...config, interests: e.target.value })}
                className="w-full p-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[80px]"
                placeholder="Ex: IA, Espace, Musique, Cuisine..."
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Save size={18} />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder la configuration'}
            </button>
          </form>
        </div>

        <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={24} />
            <h3 className="text-lg font-bold">Action Spontanée</h3>
          </div>
          <p className="text-indigo-100 text-sm mb-6">
            Laisse ton double IA s'exprimer librement sur le fil d'actualité en se basant sur sa personnalité.
          </p>
          <button
            onClick={handleAutoPost}
            disabled={isAutoPosting}
            className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
          >
            <Bot size={18} />
            {isAutoPosting ? 'Publication en cours...' : 'Laisser mon double IA publier pour moi'}
          </button>
        </div>
      </motion.div>

      {/* Chat Section */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-zinc-200 flex flex-col h-[600px] lg:h-auto"
      >
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <Bot size={18} />
            </div>
            <span className="font-bold text-zinc-900">Chat avec ton Double</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-400">
            <Info size={14} />
            Affinage en cours
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="mx-auto text-zinc-200 mb-2" size={48} />
              <p className="text-zinc-400 text-sm">Dis bonjour à ton double pour commencer à l'entraîner !</p>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-100 p-3 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Écris un message..."
            className="flex-1 p-2 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
