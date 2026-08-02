export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';
export type RoadmapLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
export type LabCategory =
  | 'Web'
  | 'Network'
  | 'Linux'
  | 'Windows'
  | 'Forensics'
  | 'OSINT'
  | 'Cloud'
  | 'API'
  | 'Binary'
  | 'Reverse Engineering'
  | 'Cryptography'
  | 'Programming';

export interface AppUser {
  uid: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  xp: number;
  coins: number;
  level: number;
  streak: number;
  completedLabs: string[];
  completedRoadmaps: string[];
  badges: string[];
  achievements: string[];
  profileImage: string;
  bio?: string;
  createdAt: number;
  lastLogin: number;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapNode {
  id: string;
  level: RoadmapLevel;
  title: string;
  description: string;
  xp: number;
  estimatedHours: number;
  topics: RoadmapTopic[];
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: number;
  xp: number;
  durationHours: number;
  hasCertificate: boolean;
  thumbnail: string;
}

export interface Lab {
  id: string;
  title: string;
  category: LabCategory;
  difficulty: Difficulty;
  xp: number;
  estimatedMinutes: number;
  description: string;
  tags: string[];
  hints: string[];
  solvedBy: number;
}

export interface CtfEvent {
  id: string;
  title: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  startsAt: number;
  endsAt: number;
  participants: number;
  difficulty: Difficulty;
  prize: string;
  rules: string[];
}

export interface Writeup {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  labId: string;
  category: string;
  excerpt: string;
  content: string;
  likes: number;
  comments: number;
  publishedAt: number;
  tags: string[];
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  username: string;
  profileImage: string;
  xp: number;
  coins: number;
  completedLabs: number;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Submission {
  id: string;
  uid: string;
  labId: string;
  correct: boolean;
  submittedAt: number;
}
