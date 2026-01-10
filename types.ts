export interface GlassRecipe {
  title: string;
  description: string;
  techniques: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  estimatedTime: string;
  materials: string[];
  steps: Step[];
  visualPrompt: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  tip?: string;
}

export interface GeneratedDesign {
  imageUrl: string;
  recipe: GlassRecipe;
}

export interface ComparisonResult {
  score: number;
  comment: string;
  strengths: string[];
  improvements: string[];
}

export type UserRole = 'hobbyist' | 'owner';

export interface User {
  id: string;
  username: string;
  avatarColor: string;
  role: UserRole;
  level?: string;
}

export interface HistoryItem extends GeneratedDesign {
  id: string;
  timestamp: number;
  userId: string;
  userUploadedImageUrl?: string; // 学员实作图片
  ownerFeedback?: string;       // 主理人点评
  socialRecords?: {             // 社区互动记录
    likes: number;
    comments: { user: string; content: string; time: string }[];
  };
  // 对比迭代记录 (多次尝试)
  comparisonIterations?: {
    attemptNumber: number;
    userImageUrl: string;
    aiScore: number;
    aiFeedback: string;
    aiStrengths: string[];
    aiImprovements: string[];
    masterEndorsement?: string; // 主理人对AI建议的认可/补充
    timestamp: number;
  }[];
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  imageUrl: string;
  title: string;
  likes: number;
  isLiked: boolean;
  comments: {
    user: string;
    avatar?: string;
    content: string;
    time: string;
    isMaster?: boolean;
  }[];
}

export interface AnalyticsData {
  totalGenerations: number;
  computeCost: number;
  activeStudents: number;
  avgScore: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RENDERING = 'RENDERING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export type ViewMode = 'generator' | 'history' | 'dashboard' | 'portfolio';