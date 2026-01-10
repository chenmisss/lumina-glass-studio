import { User, HistoryItem, GeneratedDesign, UserRole, CommunityPost, AnalyticsData } from "../types";

const USER_KEY = 'lumina_current_user';
const HISTORY_KEY = 'lumina_history';
const COMMUNITY_KEY = 'lumina_community_posts';

const AVATAR_COLORS = [
  'from-cyan-400 to-blue-600',
  'from-purple-400 to-pink-600',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-red-600',
];

const getAssetPath = (path: string) => {
  const baseUrl = import.meta.env.BASE_URL;
  // Remove leading slash from path if baseUrl already has trailing slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: '林晓明',
    authorAvatar: 'from-purple-400 to-pink-600',
    imageUrl: getAssetPath('/images/mock/glass-blown.png'),
    title: '晨曦琉璃瓶',
    likes: 124,
    isLiked: false,
    comments: [
      { user: 'Lumina Master', content: '光影层次非常丰富，特别是口沿处的渐变处理，显示出极佳的火候控制。', time: '1小时前', isMaster: true, avatar: 'from-blue-600 to-indigo-600' },
      { user: '张雅琪', content: '哇，这个蓝色太通透了！求教怎么防止气泡？', time: '2小时前' }
    ]
  },
  {
    id: '2',
    author: '陈大强',
    authorAvatar: 'from-emerald-400 to-teal-600',
    imageUrl: getAssetPath('/images/mock/glass-fused.png'),
    title: '深海回响',
    likes: 89,
    isLiked: true,
    comments: [
      { user: 'Lumina Master', content: '构图大胆，色彩搭配很有深海的神秘感。建议边缘打磨再精细一些。', time: '10分钟前', isMaster: true, avatar: 'from-blue-600 to-indigo-600' },
    ]
  },
  {
    id: '3',
    author: '王小美',
    authorAvatar: 'from-orange-400 to-red-600',
    imageUrl: getAssetPath('/images/mock/glass-masterpiece.png'),
    title: '熔岩艺术雕塑',
    likes: 256,
    isLiked: false,
    comments: [
      { user: '刘川', content: '太震撼了，这是热熔还是吹制？', time: '5分钟前' },
      { user: 'Lumina Master', content: '完美融合了流体动力学的美感。这不仅仅是工艺品，更是艺术品。', time: '1分钟前', isMaster: true, avatar: 'from-blue-600 to-indigo-600' },
      { user: '林晓明', content: '膜拜大佬！', time: '3分钟前' }
    ]
  }
];

const MOCK_ANALYTICS: AnalyticsData = {
  totalGenerations: 1248,
  computeCost: 452.30,
  activeStudents: 42,
  avgScore: 84.5
};

export const storageService = {
  login: (username: string, role: UserRole = 'hobbyist'): User => {
    const user: User = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      username: username || (role === 'hobbyist' ? '学徒' : '主理人'),
      avatarColor: AVATAR_COLORS[Math.abs(username.length) % AVATAR_COLORS.length],
      role,
      level: role === 'hobbyist' ? '中级班' : undefined
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    if (role === 'hobbyist' && storageService.getUserHistory(user.id).length === 0) {
      storageService.initDemoHistory(user.id);
    }

    return user;
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  saveDesign: (userId: string, design: GeneratedDesign): HistoryItem => {
    const history = storageService.getAllHistory();
    const newItem: HistoryItem = {
      ...design,
      id: Date.now().toString(),
      timestamp: Date.now(),
      userId
    };
    history.unshift(newItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return newItem;
  },

  getUserHistory: (userId: string): HistoryItem[] => {
    const allHistory = storageService.getAllHistory();
    return allHistory.filter(item => item.userId === userId);
  },

  getAllHistory: (): HistoryItem[] => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // 获取已收录至艺享会议的作品
  getPortfolioItems: (userId: string): HistoryItem[] => {
    const history = storageService.getUserHistory(userId);
    // 演示模式：假设分值大于85或有主理人反馈的即为作品集内容
    return history.filter(item => item.id === 'demo-1' || item.ownerFeedback);
  },

  clearHistory: (userId: string) => {
    const allHistory = storageService.getAllHistory();
    const newHistory = allHistory.filter(item => item.userId !== userId);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  },

  initDemoHistory: (userId: string) => {
    const demoItems: HistoryItem[] = [
      {
        id: 'demo-1',
        timestamp: Date.now() - 86400000,
        userId,
        imageUrl: getAssetPath('/images/mock/glass-blown.png'),
        userUploadedImageUrl: getAssetPath('/images/mock/glass-student.png'),
        ownerFeedback: "这次吹制的冰裂纹非常自然，尤其是瓶口处的过渡展现了你对火候的精妙掌控。建议下次尝试在夹层中渗入微量银箔粉，增加晨曦般的闪烁感。",
        socialRecords: {
          likes: 42,
          comments: [
            { user: "王小美", content: "这个纹理太高级了！是怎么做出来的？", time: "2小时前" },
            { user: "陈师傅", content: "很有灵气的一件作品。", time: "5小时前" }
          ]
        },
        recipe: {
          title: '冰裂纹肌理杯',
          description: '通过极速冷却形成的自然纹理。',
          techniques: ['吹制', '急冷淬火'],
          difficulty: 'Intermediate',
          estimatedTime: '3小时',
          materials: ['高透玻璃料', '冰水浴'],
          steps: [],
          visualPrompt: 'Ice crackle glass cup'
        }
      },
      {
        id: 'demo-2',
        timestamp: Date.now() - 172800000,
        userId,
        imageUrl: getAssetPath('/images/mock/glass-lampwork.png'),
        recipe: {
          title: '千花艺术纸镇',
          description: '经典的穆拉诺千花工艺尝试。',
          techniques: ['灯工', '模具压制'],
          difficulty: 'Advanced',
          estimatedTime: '5小时',
          materials: ['彩色玻璃棒', '透明包料'],
          steps: [],
          visualPrompt: 'Millefiori glass paperweight'
        }
      }
    ];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(demoItems));
  },

  getCommunityPosts: (): CommunityPost[] => {
    const stored = localStorage.getItem(COMMUNITY_KEY);
    if (!stored) {
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(MOCK_COMMUNITY_POSTS));
      return MOCK_COMMUNITY_POSTS;
    }
    return JSON.parse(stored);
  },

  addCommunityComment: (postId: string, content: string, user: User) => {
    const posts = storageService.getCommunityPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return posts;

    const newComment = {
      user: user.username,
      content,
      time: '刚刚',
      isMaster: user.role === 'owner',
      avatar: user.avatarColor || 'from-gray-400 to-gray-600'
    };

    posts[postIndex].comments.unshift(newComment);
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(posts));
    return posts;
  },

  toggleLike: (postId: string) => {
    const posts = storageService.getCommunityPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return posts;

    const post = posts[postIndex];
    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;

    posts[postIndex] = post;
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(posts));
    return posts;
  },

  getAnalytics: (): AnalyticsData => {
    return MOCK_ANALYTICS;
  },

  getStudentSubmissions: (): HistoryItem[] => {
    const realHistory = storageService.getAllHistory();
    if (realHistory.length > 0) return realHistory;

    return [
      {
        id: 'mock1',
        timestamp: Date.now() - 1000000,
        userId: '学员_021',
        imageUrl: getAssetPath('/images/mock/glass-student.png'),
        recipe: {
          title: '练习：渐变肌理杯',
          description: '初次尝试吹制玻璃技术。',
          difficulty: 'Beginner',
          estimatedTime: '2小时',
          techniques: ['吹制'],
          materials: ['透明玻璃料'],
          steps: [],
          visualPrompt: ''
        }
      }
    ];
  }
};