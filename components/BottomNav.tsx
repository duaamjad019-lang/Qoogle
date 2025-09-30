
import React from 'react';
import type { View } from '../types';
import { SearchIcon, ReelsIcon, FireIcon } from './icons/Icons';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavButton: React.FC<{
    label: string;
    view: View;
    activeView: View;
    setActiveView: (view: View) => void;
    children: React.ReactNode;
}> = ({ label, view, activeView, setActiveView, children }) => {
    const isActive = activeView === view;
    return (
        <button
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}
        >
            {children}
            <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    )
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 flex justify-around items-center">
      <NavButton label="Search" view="search" activeView={activeView} setActiveView={setActiveView}>
        <SearchIcon className="h-6 w-6" />
      </NavButton>
      <NavButton label="Reels" view="reels" activeView={activeView} setActiveView={setActiveView}>
        <ReelsIcon className="h-6 w-6" />
      </NavButton>
      <NavButton label="Streaks" view="streaks" activeView={activeView} setActiveView={setActiveView}>
        <FireIcon className="h-6 w-6" />
      </NavButton>
    </footer>
  );
};

export default BottomNav;
