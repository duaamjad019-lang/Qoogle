import React, { useState } from 'react';
import type { View } from './types';
import Search from './components/Search';
import Reels from './components/Reels';
import Streaks from './components/Streaks';
import BottomNav from './components/BottomNav';
import Auth from './components/Auth';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('search');
  const { currentUser } = useAuth();

  const renderView = () => {
    switch (activeView) {
      case 'search':
        return <Search />;
      case 'reels':
        return <Reels />;
      case 'streaks':
        return <Streaks />;
      default:
        return <Search />;
    }
  };

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-gray-900">
      <main className="flex-1 overflow-y-auto pb-16">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;