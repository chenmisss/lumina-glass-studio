import React from 'react';
import GlassCard from './GlassCard';
import GlassImage from './GlassImage';
import FeedbackModal from './FeedbackModal';

interface StudentProgress {
  id: string;
  name: string;
  level: string;
  progress: number;
  worksCount: number;
  lastActive: string;
  avgScore: number;
  achievements: string[];
  lastWorkThumb: string;
}

const MOCK_STUDENTS: StudentProgress[] = [
  {
    id: 's1',
    name: '林晓明',
    level: '高级学员',
    progress: 85,
    worksCount: 42,
    lastActive: '1小时前',
    avgScore: 92,
    achievements: ['吹制达人', '配色天才'],
    lastWorkThumb: '/images/mock/glass-blown.png'
  },
  {
    id: 's2',
    name: '张雅琪',
    level: '中级学员',
    progress: 58,
    worksCount: 24,
    lastActive: '3小时前',
    avgScore: 85,
    achievements: ['冷加工先锋'],
    lastWorkThumb: '/images/mock/glass-fused.png'
  },
  {
    id: 's3',
    name: '刘川',
    level: '入门学员',
    progress: 22,
    worksCount: 8,
    lastActive: '昨天',
    avgScore: 78,
    achievements: [],
    lastWorkThumb: '/images/mock/glass-student.png'
  },
  {
    id: 's4',
    name: '陈大强',
    level: '中级学员',
    progress: 64,
    worksCount: 31,
    lastActive: '4小时前',
    avgScore: 88,
    achievements: ['热熔工艺专家'],
    lastWorkThumb: '/images/mock/glass-lampwork.png'
  }
];

const StudentProgressView: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = React.useState<any>(null);

  const handleShowDetail = (student: StudentProgress) => {
    // 构造一个临时的 HistoryItem 用于展示
    const mockSubmission = {
      id: student.id,
      timestamp: Date.now(),
      imageUrl: student.lastWorkThumb,
      userId: student.name,
      recipe: {
        title: student.name === '林晓明' ? '冰裂纹肌理杯' :
          student.name === '张雅琪' ? '千花艺术纸镇' :
            student.name === '刘川' ? '基础吹制练习' : '热熔盘',
        description: '学员近期完成的练习作品',
        difficulty: student.level === '高级学员' ? 'Advanced' :
          student.level === '中级学员' ? 'Intermediate' : 'Beginner',
        estimatedTime: '4小时',
        techniques: student.achievements,
        materials: ['高硅硼玻璃'],
        steps: [],
        visualPrompt: ''
      },
      // 预设不同的评语
      ownerFeedback: `这是${student.name}在${student.level}阶段的代表作。
       
整体造型非常完整，特别是对于${student.achievements[0] || '基础工艺'}的掌握已经相当熟练。建议在细节抛光上再多花一些功夫。`
    };
    setSelectedSubmission(mockSubmission);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 fade-in-standard">
      {/* 顶部统计看板 */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">学情成长档案</h2>
        <p className="text-slate-300 text-sm font-medium">实时监控工作室 {MOCK_STUDENTS.length} 位学员的工艺掌握进度</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_STUDENTS.map((student) => (
          <GlassCard key={student.id} className="p-0 overflow-hidden group hover:border-cyan-500/50 transition-all duration-300" opacity={40}>
            {/* 学员基本信息头部保持不变 */}
            <div className="p-5 flex items-start justify-between border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-black text-lg border border-white/10">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{student.name}</h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{student.level}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{student.avgScore}</div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">平均分</div>
              </div>
            </div>

            {/* 进度条区域保持不变 */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">总体掌握度</span>
                  <span className="text-xs text-white font-black">{student.progress}%</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)] transition-all duration-1000 ease-out"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">作品总数</div>
                  <div className="text-lg font-black text-white">{student.worksCount} <span className="text-[10px] text-slate-400">件</span></div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">最后活跃</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">{student.lastActive}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[24px]">
                {student.achievements.length > 0 ? student.achievements.map((ach, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-200 text-[9px] font-bold rounded-md border border-purple-500/30">
                    🏆 {ach}
                  </span>
                )) : (
                  <span className="text-[9px] text-slate-600 font-bold italic tracking-wider">暂无获得成就</span>
                )}
              </div>
            </div>

            {/* 最近作品缩略图 */}
            <div className="px-5 pb-5 mt-2">
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-3">最新产出记录</p>
              <div
                className="flex items-center gap-3 bg-black/30 p-2 rounded-xl border border-white/5 group-hover:bg-black/50 transition-colors cursor-pointer"
                onClick={() => handleShowDetail(student)}
              >
                <GlassImage src={student.lastWorkThumb} containerClassName="w-12 h-12 rounded-lg" className="w-full h-full object-cover" alt="" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">查看工艺对比详情</p>
                  <p className="text-[10px] text-slate-400 mt-1">AI 评分: <span className="text-emerald-400">已评定</span></p>
                </div>
                <button className="p-2 text-slate-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <FeedbackModal
        isOpen={!!selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        submission={selectedSubmission}
        readOnly={true}
      />
    </div>
  );
};

export default StudentProgressView;