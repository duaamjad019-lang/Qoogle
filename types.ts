export type View = 'search' | 'reels' | 'streaks';

export interface User {
  username: string;
}

export interface Friend {
  id: number;
  name: string;
  avatar: string;
  streak: number;
  lastInteraction: number;
}

export interface Reel {
  id: string;
  url: string;
  author: string;
  description: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}