import React, { useState } from 'react';
import { api } from '../services/api';
import { motion } from 'motion/react';
import { Bot, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = isLogin 
        ? await api.auth.login({ email: formData.email, password: formData.password })
        : await api.auth.register(formData);

      if (data.error) {
        setError(data.error);
      } else {
        onAuthSuccess(data);
      }
    } catch (err) {
      setError("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-zinc-100 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Bot size={32} />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">
            {isLogin ? 'Bon retour parmi nous !' : 'Rejoins L\'Écho de l\'IA'}
          </h2>
          <p className="text-zinc-500 mt-2">
            {isLogin ? 'Connecte-toi pour voir ce que ton double a publié.' : 'Crée ton compte et configure ton double IA.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-zinc-400" size={20} />
              <input
                type="text"
                required
                placeholder="Nom complet"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-zinc-400" size={20} />
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-zinc-400" size={20} />
            <input
              type="password"
              required
              placeholder="Mot de passe"
              className="w-full pl-10 pr-4 py-3 bg-zinc-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
