import React, { useState, useEffect, useCallback } from 'react';
import type { Friend } from '../types';
import { useAuth } from '../context/AuthContext';

const STREAK_DURATION_MS = 24 * 60 * 60 * 1000;
const WARNING_THRESHOLD_MS = 20 * 60 * 60 * 1000;

const INITIAL_FRIENDS: Friend[] = [
  { id: 1, name: 'Alex', avatar: 'https://picsum.photos/seed/alex/100', streak: 12, lastInteraction: Date.now() - 5 * 60 * 60 * 1000 },
  { id: 2, name: 'Ben', avatar: 'https://picsum.photos/seed/ben/100', streak: 45, lastInteraction: Date.now() - 22 * 60 * 60 * 1000 },
  { id: 3, name: 'Casey', avatar: 'https://picsum.photos/seed/casey/100', streak: 3, lastInteraction: Date.now() - 2 * 24 * 60 * 60 * 1000 },
  { id: 4, name: 'Dana', avatar: 'https://picsum.photos/seed/dana/100', streak: 112, lastInteraction: Date.now() - 10 * 60 * 60 * 1000 },
  { id: 5, name: 'Frankie', avatar: 'https://picsum.photos/seed/frankie/100', streak: 0, lastInteraction: 0 },
];

const Streaks: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const storedFriends = localStorage.getItem(`friends-streaks-${currentUser?.username}`);
      return storedFriends ? JSON.parse(storedFriends) : INITIAL_FRIENDS;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return INITIAL_FRIENDS;
    }
  });

  const updateStreaks = useCallback(() => {
    const now = Date.now();
    let streaksUpdated = false;
    const updatedFriends = friends.map(friend => {
      if (friend.streak > 0 && now - friend.lastInteraction > STREAK_DURATION_MS) {
        streaksUpdated = true;
        return { ...friend, streak: 0 };
      }
      return friend;
    });
    if(streaksUpdated) {
        setFriends(updatedFriends);
    }
  }, [friends]);

  useEffect(() => {
    updateStreaks();
    const interval = setInterval(updateStreaks, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if(currentUser) {
        localStorage.setItem(`friends-streaks-${currentUser.username}`, JSON.stringify(friends));
      }
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [friends, currentUser]);

  const handleStreak = (friendId: number) => {
    setFriends(prevFriends =>
      prevFriends.map(friend => {
        if (friend.id === friendId) {
          const now = Date.now();
          const isStreakContinuing = friend.streak > 0 && now - friend.lastInteraction < STREAK_DURATION_MS;
          return {
            ...friend,
            streak: isStreakContinuing ? friend.streak + 1 : 1,
            lastInteraction: now,
          };
        }
        return friend;
      })
    );
  };
  
  const getStatusEmoji = (friend: Friend) => {
    if (friend.streak === 0) return '';
    const timeSinceInteraction = Date.now() - friend.lastInteraction;
    if (timeSinceInteraction > WARNING_THRESHOLD_MS && timeSinceInteraction < STREAK_DURATION_MS) {
      return '⌛';
    }
    return '🔥';
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-400">Streaks</h1>
        <button 
          onClick={logout}
          className="bg-gray-700 text-sm text-white px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
      <div className="space-y-3">
        {friends.sort((a,b) => b.streak - a.streak).map(friend => (
          <div key={friend.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-4">
              <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full border-2 border-purple-500" />
              <div>
                <p className="text-lg font-semibold">{friend.name}</p>
                {friend.streak > 0 && (
                  <p className="text-gray-400">
                    <span className="text-orange-400 font-bold">{friend.streak}</span> {getStatusEmoji(friend)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleStreak(friend.id)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-transform"
            >
              Send
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Streaks;