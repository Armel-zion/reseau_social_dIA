import React from 'react';
import { User, Bot, LogOut, UserCircle, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({ user, onLogout, currentPage, setCurrentPage }: NavbarProps) {
  const navItems = [
    { id: 'feed', label: 'Fil', icon: MessageSquare },
    { id: 'ai-double', label: 'Mon double IA', icon: Bot },
    { id: 'profile', label: 'Profil', icon: UserCircle },
  ];

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('feed')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Bot size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 hidden sm:block">
              L'Écho de l'IA
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            {user ? (
              <>
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="hidden md:block">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden md:block">Déconnexion</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentPage('auth')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
              >
                Connexion / Inscription
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
