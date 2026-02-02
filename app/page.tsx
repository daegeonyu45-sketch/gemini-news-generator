'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Newspaper,
  TrendingUp,
  Landmark,
  DollarSign,
  Users,
  Palette,
  Trophy,
  Cpu,
  Sparkles,
  Clock,
  Cloud,
  Sun,
  Moon,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Theme = 'dark' | 'light';

interface CategoryTile {
  id: string;
  title: string;
  icon: any;
  count: number;
  color: string;
  gradient: string;
}

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentTime, setCurrentTime] = useState('');
  const [trendIndex, setTrendIndex] = useState(0);

  // 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('ko-KR', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 테마 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // 테마 전환
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // 트렌드 롤링
  const trends = [
    { rank: 1, keyword: '생성형 AI', change: '+245%' },
    { rank: 2, keyword: '손흥민 20호골', change: '+189%' },
    { rank: 3, keyword: '반도체 수출', change: '+156%' },
    { rank: 4, keyword: '부동산 정책', change: '+134%' },
    { rank: 5, keyword: '기후변화 대응', change: '+112%' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendIndex((prev) => (prev + 1) % trends.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 카테고리 타일
  const categories: CategoryTile[] = [
    { id: 'politics', title: '정치', icon: Landmark, count: 24, color: 'text-blue-400', gradient: 'from-blue-500/20 to-blue-600/20' },
    { id: 'economy', title: '경제', icon: DollarSign, count: 18, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-emerald-600/20' },
    { id: 'society', title: '사회', icon: Users, count: 31, color: 'text-purple-400', gradient: 'from-purple-500/20 to-purple-600/20' },
    { id: 'culture', title: '문화', icon: Palette, count: 15, color: 'text-pink-400', gradient: 'from-pink-500/20 to-pink-600/20' },
    { id: 'sports', title: '스포츠', icon: Trophy, count: 12, color: 'text-orange-400', gradient: 'from-orange-500/20 to-orange-600/20' },
    { id: 'tech', title: 'IT', icon: Cpu, count: 27, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-cyan-600/20' },
  ];

  const themeStyles = {
    dark: {
      bg: 'bg-slate-950',
      text: 'text-slate-100',
      cardBg: 'bg-white/5 backdrop-blur-lg border-white/10',
      muted: 'text-slate-400',
    },
    light: {
      bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      text: 'text-slate-900',
      cardBg: 'bg-white/80 backdrop-blur-lg border-slate-200',
      muted: 'text-slate-600',
    },
  };

  const styles = themeStyles[theme];

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text}`}>
      {/* 배경 효과 */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-slate-950 to-blue-950/20 pointer-events-none" />
      
      <div className="relative container mx-auto px-4 py-8 max-w-[1600px]">
        {/* 헤더 */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Newspaper className="w-12 h-12 text-emerald-500" />
              <Sparkles className="w-5 h-5 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                DONG-A AI Newsroom
              </h1>
              <p className={`text-sm ${styles.muted}`}>차세대 AI 뉴스 생성 플랫폼</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Clock className={`w-5 h-5 ${styles.muted}`} />
              <span className={`text-sm ${styles.muted}`}>{currentTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              <span className="text-sm">18°C</span>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className={`${theme === 'dark' ? 'bg-white/5 border-white/20 hover:bg-white/10' : 'bg-white border-slate-300 hover:bg-slate-50'} rounded-full`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </Button>
          </div>
        </motion.header>

        {/* Bento Grid */}
        <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Hero Tile - 2x2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 row-span-2"
          >
            <Link href="/create">
              <div className="group relative h-full rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-blue-600 transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800')] bg-cover bg-center opacity-30 transition-transform duration-500 group-hover:scale-110" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">AI 추천</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                    생성형 AI, 저널리즘의 미래를 바꾸다
                  </h2>
                  <p className="text-slate-300 text-sm mb-4">
                    인공지능 기술이 뉴스 제작 방식을 혁신하며 새로운 시대를 열고 있습니다
                  </p>
                  <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                    <span className="text-sm font-semibold">기사 작성하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <div className="bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                    <span className="text-white text-xs font-semibold">오늘의 헤드라인</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Trend Tile - 2x1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 row-span-1"
          >
            <Link href="/create">
              <div className={`group relative h-full rounded-2xl overflow-hidden cursor-pointer border ${styles.cardBg} hover:scale-[1.02] transition-all duration-300`}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
                
                <div className="relative h-full p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">실시간 AI 트렌드 분석</h3>
                      <p className={`text-sm ${styles.muted}`}>지금 가장 핫한 키워드</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <motion.div
                      key={trendIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-right"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                          #{trends[trendIndex].rank}
                        </span>
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="text-xl font-bold">{trends[trendIndex].keyword}</div>
                      <div className="text-sm text-green-400">{trends[trendIndex].change}</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Category Tiles - 1x1 each */}
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="col-span-1 row-span-1"
            >
              <Link href="/create">
                <div className={`group relative h-full rounded-2xl overflow-hidden cursor-pointer border ${styles.cardBg} hover:scale-[1.05] transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-100'} group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full px-3 py-1">
                        <span className="text-white text-xs font-bold">+{category.count}건</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{category.title}</h3>
                      <p className={`text-xs ${styles.muted}`}>최신 뉴스 보기</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* AI 기사 작성 CTA - 2x1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="col-span-2 row-span-1"
          >
            <Link href="/create">
              <div className="group relative h-full rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800')] bg-cover bg-center opacity-10" />
                
                <div className="relative h-full p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-white/20 backdrop-blur-md">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">AI 기사 작성 시작하기</h3>
                      <p className="text-white/80 text-sm">주제만 입력하면 전문 기사가 자동으로 생성됩니다</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-white group-hover:gap-4 transition-all">
                    <span className="text-lg font-semibold">시작하기</span>
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* 푸터 */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className={`mt-12 text-center ${styles.muted} text-sm`}
        >
          <p>© 2026 DONG-A AI Newsroom. Powered by Google Gemini AI.</p>
        </motion.footer>
      </div>
    </div>
  );
}
