import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import AIDouble from './pages/AIDouble';
import Auth from './pages/Auth';
import PostDetail from './pages/PostDetail';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('feed');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Simulation de session
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('feed');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage('feed');
  };

  const navigateToPost = (postId: string) => {
    setSelectedPostId(postId);
    setCurrentPage('post-detail');
  };

  const renderPage = () => {
    if (currentPage === 'auth') {
      return <Auth onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentPage) {
      case 'feed':
        return <Feed user={user} onPostClick={navigateToPost} />;
      case 'ai-double':
        return user ? <AIDouble user={user} /> : <Auth onAuthSuccess={handleAuthSuccess} />;
      case 'post-detail':
        return selectedPostId ? (
          <PostDetail 
            postId={selectedPostId} 
            user={user} 
            onBack={() => setCurrentPage('feed')} 
          />
        ) : <Feed user={user} onPostClick={navigateToPost} />;
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto py-12 px-4 text-center">
            <img 
              src={user?.avatar} 
              className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-indigo-50 shadow-lg" 
              referrerPolicy="no-referrer"
            />
            <h2 className="text-2xl font-bold text-zinc-900">{user?.name}</h2>
            <p className="text-zinc-500">{user?.email}</p>
            <div className="mt-8 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
              <p className="text-sm text-zinc-400 italic">
                C'est ici que tu pourras bientôt voir tes statistiques et tes badges.
              </p>
            </div>
          </div>
        );
      default:
        return <Feed user={user} onPostClick={navigateToPost} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}
