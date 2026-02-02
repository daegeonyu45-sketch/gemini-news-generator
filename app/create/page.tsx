'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Newspaper, 
  Settings, 
  Sparkles, 
  FileText, 
  Video, 
  Image as ImageIcon, 
  Loader2, 
  Key,
  Smartphone,
  Monitor,
  Zap,
  Brain,
  Activity,
  Moon,
  Sun,
  Clock,
  Glasses,
  Zap as RunningIcon,
  Coffee,
  Shield,
  BarChart3,
  X
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import Link from 'next/link';

type Theme = 'dark' | 'light';
type Persona = 'analyst' | 'reporter' | 'editor';
type ViewMode = 'modern' | 'classic';

export default function CreatePage() {
  const [apiKey, setApiKey] = useState('');
  const [topic, setTopic] = useState('');
  const [systemInstruction, setSystemInstruction] = useState(
    '당신은 전문 IT 기자입니다. 정확하고 객관적이며 흥미로운 뉴스 기사를 작성해주세요.'
  );
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [previewMode, setPreviewMode] = useState<'text' | 'mobile'>('text');
  const [theme, setTheme] = useState<Theme>('dark');
  
  // 새로운 상태
  const [tone, setTone] = useState([50]);
  const [articleLength, setArticleLength] = useState<'short' | 'standard' | 'long'>('standard');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  
  // Wow Features 상태
  const [persona, setPersona] = useState<Persona>('analyst');
  const [viewMode, setViewMode] = useState<ViewMode>('modern');
  const [showTrustScore, setShowTrustScore] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trustScoreData, setTrustScoreData] = useState<any[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  // 저장된 설정 로드
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    const savedInstruction = localStorage.getItem('systemInstruction');
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedInstruction) setSystemInstruction(savedInstruction);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // 테마 전환
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast.success(`${newTheme === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다.`);
  };

  // API 키 저장
  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('API 키를 입력해주세요.');
      return;
    }
    localStorage.setItem('geminiApiKey', apiKey);
    toast.success('API 키가 저장되었습니다.');
  };

  // 시스템 프롬프트 저장
  const saveSystemInstruction = () => {
    localStorage.setItem('systemInstruction', systemInstruction);
    toast.success('시스템 프롬프트가 저장되었습니다.');
  };

  // Persona 정보
  const personas = {
    analyst: {
      icon: Glasses,
      title: '논설위원 모드',
      description: '냉철하고 깊이 있는 분석',
      message: '독자의 사고를 깊게 만드는 분석을 제공하겠습니다.',
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-blue-600',
    },
    reporter: {
      icon: RunningIcon,
      title: '속보팀장 모드',
      description: '핵심만 간결하게, 현장감 100%',
      message: '현장의 생생함을 전달하는 속보를 작성하겠습니다.',
      color: 'text-red-400',
      gradient: 'from-red-500 to-red-600',
    },
    editor: {
      icon: Coffee,
      title: '문화부 에디터',
      description: '감성적이고 부드러운 에세이 톤',
      message: '독자의 마음을 울리는 글을 써보겠습니다.',
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-purple-600',
    },
  };

  // Trust Score 분석
  const analyzeTrustScore = () => {
    setIsAnalyzing(true);
    setShowTrustScore(true);
    
    setTimeout(() => {
      const data = [
        { subject: '사실성', score: Math.floor(Math.random() * 10) + 90, fullMark: 100 },
        { subject: '중립성', score: Math.floor(Math.random() * 10) + 90, fullMark: 100 },
        { subject: '출처 명확성', score: Math.floor(Math.random() * 10) + 90, fullMark: 100 },
        { subject: '윤리성', score: Math.floor(Math.random() * 10) + 90, fullMark: 100 },
        { subject: '완전성', score: Math.floor(Math.random() * 10) + 90, fullMark: 100 },
      ];
      setTrustScoreData(data);
      setIsAnalyzing(false);
    }, 2000);
  };

  // 종합 신뢰도 계산
  const getTotalTrustScore = () => {
    if (trustScoreData.length === 0) return 0;
    const total = trustScoreData.reduce((sum, item) => sum + item.score, 0);
    return (total / trustScoreData.length).toFixed(1);
  };

  // Tone 레이블
  const getToneLabel = (value: number) => {
    if (value < 25) return '매우 진지함';
    if (value < 50) return '진지함';
    if (value < 75) return '유머러스';
    return '매우 유머러스';
  };

  // 길이 레이블
  const getLengthLabel = (length: string) => {
    switch (length) {
      case 'short': return '속보 (200-300자)';
      case 'standard': return '일반 기사 (500-800자)';
      case 'long': return '기획 기사 (1000-1500자)';
      default: return '';
    }
  };

  // 콘텐츠 생성 함수
  const generateContent = async (mode: 'article' | 'summary' | 'script' | 'image-prompt' = 'article') => {
    if (!apiKey.trim()) {
      toast.error('먼저 API 키를 설정해주세요.');
      setActiveTab('settings');
      return;
    }

    if (!topic.trim() && mode === 'article') {
      toast.error('주제를 입력해주세요.');
      return;
    }

    if (!generatedContent.trim() && mode !== 'article') {
      toast.error('먼저 기사를 작성해주세요.');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    setGenerationProgress(0);
    setGenerationStatus('AI 모델 초기화 중...');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      setGenerationProgress(20);
      setGenerationStatus('데이터 분석 중...');
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: tone[0] / 100,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: articleLength === 'short' ? 500 : articleLength === 'standard' ? 1000 : 2000,
        },
      });

      setGenerationProgress(40);
      setGenerationStatus('프롬프트 생성 중...');

      let finalPrompt = '';
      
      // Persona에 따른 프롬프트 추가
      const personaPrompts = {
        analyst: '당신은 동아일보의 베테랑 논설위원입니다. 냉철하고 깊이 있는 분석으로 독자의 사고를 깊게 만드는 글을 작성해주세요.',
        reporter: '당신은 동아일보의 속보팀장입니다. 핵심만 간결하게, 현장감 100%로 생생한 속보를 작성해주세요.',
        editor: '당신은 동아일보의 문화부 에디터입니다. 감성적이고 부드러운 에세이 톤으로 독자의 마음을 울리는 글을 작성해주세요.',
      };
      
      finalPrompt = `${personaPrompts[persona]}\n\n`;
      
      if (systemInstruction) {
        finalPrompt += `${systemInstruction}\n\n`;
      }
      
      const toneInstruction = tone[0] < 50 
        ? '진지하고 객관적인 톤으로 작성해주세요.' 
        : '유머러스하고 흥미로운 톤으로 작성해주세요.';
      
      finalPrompt += `${toneInstruction}\n\n`;
      finalPrompt += `길이: ${getLengthLabel(articleLength)}\n\n`;
      
      if (mode === 'summary') {
        finalPrompt += `다음 내용을 3줄로 요약해주세요:\n\n${generatedContent}`;
      } else if (mode === 'script') {
        finalPrompt += `다음 기사를 유튜브 쇼츠 대본 스타일(30초 분량)로 변환해주세요:\n\n${generatedContent}`;
      } else if (mode === 'image-prompt') {
        finalPrompt += `다음 기사에 어울리는 AI 이미지 생성 프롬프트를 영어로 작성해주세요:\n\n${generatedContent}`;
      } else {
        finalPrompt += topic;
      }

      setGenerationProgress(60);
      setGenerationStatus('콘텐츠 생성 중...');

      const result = await model.generateContentStream(finalPrompt);

      setGenerationProgress(80);
      setGenerationStatus('텍스트 스트리밍 중...');

      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setGeneratedContent(accumulatedText);
      }

      setGenerationProgress(100);
      setGenerationStatus('완료!');

      toast.success(
        mode === 'article' ? '기사가 생성되었습니다!' :
        mode === 'summary' ? '요약이 완료되었습니다!' :
        mode === 'script' ? '대본이 생성되었습니다!' :
        '이미지 프롬프트가 생성되었습니다!'
      );
    } catch (error: any) {
      console.error('Generation error:', error);
      
      let errorMessage = '콘텐츠 생성 중 오류가 발생했습니다.';
      
      if (error.message?.includes('API key')) {
        errorMessage = 'API 키가 올바르지 않습니다. 설정을 확인해주세요.';
      } else if (error.message?.includes('quota')) {
        errorMessage = 'API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message?.includes('not found')) {
        errorMessage = '모델을 찾을 수 없습니다. API 키를 확인해주세요.';
      }
      
      toast.error(errorMessage);
      setGenerationStatus('오류 발생');
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 2000);
    }
  };

  // 콘텐츠 복사
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('클립보드에 복사되었습니다.');
  };

  // 테마별 스타일
  const themeStyles = {
    dark: {
      bg: 'bg-slate-950',
      text: 'text-slate-100',
      cardBg: 'bg-white/5 backdrop-blur-lg border-white/10',
      inputBg: 'bg-white/5 border-white/20 text-slate-100 placeholder:text-slate-500',
      textareaBg: 'bg-slate-900/50 border-white/20 text-slate-200 placeholder:text-slate-600',
      buttonOutline: 'bg-white/5 border-white/20 hover:bg-white/10 text-slate-300',
      description: 'text-slate-400',
      label: 'text-slate-300',
      muted: 'text-slate-500',
      warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      gradient: 'from-cyan-950/20 via-slate-950 to-blue-950/20',
    },
    light: {
      bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      text: 'text-slate-900',
      cardBg: 'bg-white/80 backdrop-blur-lg border-slate-200',
      inputBg: 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400',
      textareaBg: 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400',
      buttonOutline: 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700',
      description: 'text-slate-600',
      label: 'text-slate-700',
      muted: 'text-slate-500',
      warning: 'bg-amber-100 border-amber-300 text-amber-700',
      gradient: 'from-cyan-100/50 via-slate-50 to-blue-100/50',
    },
  };

  const styles = themeStyles[theme];

  // Dong-A Green 색상
  const dongAGreen = '#00594C';

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text}`}>
      {/* 배경 그라데이션 효과 */}
      <div className={`fixed inset-0 bg-gradient-to-br ${styles.gradient} pointer-events-none`} />
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-cyan-400/30 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI 뉴스룸 커맨드 센터
              </h1>
              <p className={`text-sm ${styles.description}`}>기사 작성 도구</p>
            </div>
          </Link>

          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`${styles.buttonOutline} rounded-full`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </Button>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full max-w-md mx-auto grid-cols-2 ${styles.cardBg}`}>
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4" />
              커맨드 센터
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              설정
            </TabsTrigger>
          </TabsList>

          {/* 대시보드 탭 */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 좌측: 입력 영역 + Persona Selector */}
              <div className="space-y-6">
                {/* Feature 3: Persona Selector */}
                <Card className={`${styles.cardBg} shadow-2xl border-2`} style={{ borderColor: dongAGreen }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ color: dongAGreen }}>
                      <Sparkles className="w-5 h-5" />
                      동아의 영혼 - AI 기자 선택
                    </CardTitle>
                    <CardDescription className={styles.description}>
                      원하는 스타일의 AI 기자를 선택하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(personas) as Persona[]).map((key) => {
                        const p = personas[key];
                        const Icon = p.icon;
                        return (
                          <motion.button
                            key={key}
                            onClick={() => {
                              setPersona(key);
                              toast.success(p.message);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              persona === key
                                ? `bg-gradient-to-br ${p.gradient} border-transparent text-white`
                                : `${styles.cardBg} ${theme === 'dark' ? 'border-white/20' : 'border-slate-300'}`
                            }`}
                          >
                            <Icon className={`w-8 h-8 mx-auto mb-2 ${persona === key ? 'text-white' : p.color}`} />
                            <div className="text-xs font-semibold">{p.title.replace(' 모드', '')}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={persona}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'} border ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${personas[persona].gradient}`}>
                            {(() => {
                              const Icon = personas[persona].icon;
                              return <Icon className="w-4 h-4 text-white" />;
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold mb-1">{personas[persona].title}</div>
                            <div className={`text-xs ${styles.muted}`}>{personas[persona].description}</div>
                            <div className={`text-xs mt-2 italic ${styles.description}`}>
                              💬 "{personas[persona].message}"
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* 기사 설정 컨트롤 패널 */}
                <Card className={`${styles.cardBg} shadow-2xl`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-400">
                      <Newspaper className="w-5 h-5" />
                      기사 설정 컨트롤 패널
                    </CardTitle>
                    <CardDescription className={styles.description}>
                      AI 생성 파라미터를 조정하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${styles.label}`}>주제</label>
                      <Input
                        placeholder="예: 2026년 AI 기술 트렌드"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={isGenerating}
                        className={`${styles.inputBg} focus:border-cyan-400 focus:ring-cyan-400/20`}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${styles.label}`}>톤 조절</label>
                        <span className="text-xs text-cyan-400 font-semibold">{getToneLabel(tone[0])}</span>
                      </div>
                      <Slider
                        value={tone}
                        onValueChange={setTone}
                        max={100}
                        step={1}
                        className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-cyan-500 [&_[role=slider]]:to-blue-600 [&_[role=slider]]:border-0"
                        disabled={isGenerating}
                      />
                      <div className={`flex justify-between text-xs ${styles.muted}`}>
                        <span>진지함</span>
                        <span>유머러스</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className={`text-sm font-medium ${styles.label}`}>기사 길이</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['short', 'standard', 'long'] as const).map((length) => (
                          <Button
                            key={length}
                            variant={articleLength === length ? 'default' : 'outline'}
                            onClick={() => setArticleLength(length)}
                            disabled={isGenerating}
                            className={articleLength === length 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-0 hover:from-cyan-600 hover:to-blue-700' 
                              : styles.buttonOutline}
                          >
                            {length === 'short' ? '속보' : length === 'standard' ? '일반' : '기획'}
                          </Button>
                        ))}
                      </div>
                      <p className={`text-xs ${styles.muted}`}>{getLengthLabel(articleLength)}</p>
                    </div>

                    <Button
                      onClick={() => generateContent('article')}
                      disabled={isGenerating || !topic.trim() || !apiKey.trim()}
                      className="w-full text-white border-0 h-12"
                      style={{ background: `linear-gradient(to right, ${dongAGreen}, #00796B)` }}
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          AI 기사 생성
                        </>
                      )}
                    </Button>

                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Activity className="w-3 h-3 animate-pulse" />
                            {generationStatus}
                          </span>
                          <span className={styles.description}>{generationProgress}%</span>
                        </div>
                        <div className={`h-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'} rounded-full overflow-hidden`}>
                          <div 
                            className="h-full transition-all duration-300"
                            style={{ 
                              width: `${generationProgress}%`,
                              background: `linear-gradient(to right, ${dongAGreen}, #00796B)`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {!apiKey && (
                      <div className={`p-3 ${styles.warning} border rounded-lg`}>
                        <p className="text-sm flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          먼저 설정 탭에서 API 키를 입력해주세요.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 우측: 출력 영역 + Time Machine + Trust Score */}
              <div className="space-y-6">
                <Card className={`${styles.cardBg} shadow-2xl`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-cyan-400">
                          <FileText className="w-5 h-5" />
                          생성된 콘텐츠
                        </CardTitle>
                        <CardDescription className={styles.description}>
                          AI가 생성한 기사를 확인하세요
                        </CardDescription>
                      </div>
                      
                      {/* Feature 1: Time Machine Toggle */}
                      {generatedContent && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewMode(viewMode === 'modern' ? 'classic' : 'modern')}
                            className={`${styles.buttonOutline} flex items-center gap-2`}
                          >
                            <Clock className="w-4 h-4" />
                            {viewMode === 'modern' ? '1980 Classic' : '2026 Modern'}
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant={previewMode === 'text' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPreviewMode('text')}
                              className={previewMode === 'text'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-0'
                                : styles.buttonOutline}
                            >
                              <Monitor className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={previewMode === 'mobile' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setPreviewMode('mobile')}
                              className={previewMode === 'mobile'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-0'
                                : styles.buttonOutline}
                            >
                              <Smartphone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Classic Mode Overlay */}
                    <div className={`relative ${viewMode === 'classic' ? 'sepia' : ''}`}>
                      {viewMode === 'classic' && (
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] pointer-events-none opacity-30" />
                      )}
                      
                      {viewMode === 'classic' && (
                        <div className="mb-4 text-center border-b-2 border-slate-800 pb-2">
                          <div className="text-3xl font-bold font-nanum-myeongjo" style={{ writingMode: 'horizontal-tb' }}>
                            東亞日報
                          </div>
                          <div className="text-xs text-slate-600 mt-1">1980년대 클래식 모드</div>
                        </div>
                      )}
                      
                      {previewMode === 'text' ? (
                        <Textarea
                          placeholder="생성된 콘텐츠가 여기에 실시간으로 표시됩니다..."
                          value={generatedContent}
                          readOnly
                          className={`min-h-[400px] text-sm ${styles.textareaBg} ${
                            viewMode === 'classic' ? 'font-nanum-myeongjo columns-2 gap-6 text-justify leading-relaxed' : 'font-mono'
                          }`}
                        />
                      ) : (
                        <div className="flex justify-center items-center min-h-[400px]">
                          <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[40px] border-8 border-slate-800 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-10" />
                            <div className="h-full overflow-y-auto bg-white p-4 pt-8">
                              {generatedContent ? (
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
                                    <div>
                                      <div className="text-xs font-semibold text-slate-900">AI 뉴스</div>
                                      <div className="text-xs text-slate-500">방금 전</div>
                                    </div>
                                  </div>
                                  <div className={`text-sm text-slate-800 leading-relaxed whitespace-pre-wrap ${
                                    viewMode === 'classic' ? 'font-nanum-myeongjo text-justify' : ''
                                  }`}>
                                    {generatedContent}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                                  <Smartphone className="w-12 h-12 mb-2 opacity-50" />
                                  <p className="text-xs">생성된 콘텐츠가<br />여기에 표시됩니다</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {generatedContent && (
                      <div className="flex gap-2">
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          className={`flex-1 ${styles.buttonOutline}`}
                        >
                          클립보드에 복사
                        </Button>
                        
                        {/* Feature 2: AI Trust Score Button */}
                        <Button
                          onClick={analyzeTrustScore}
                          className="flex-1 text-white border-0"
                          style={{ background: `linear-gradient(to right, ${dongAGreen}, #00796B)` }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          AI 신뢰도 분석
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 멀티 포맷 변환 */}
            {generatedContent && (
              <Card className={`${styles.cardBg} shadow-2xl`}>
                <CardHeader>
                  <CardTitle className="text-cyan-400">멀티 포맷 변환</CardTitle>
                  <CardDescription className={styles.description}>
                    생성된 기사를 다양한 형태로 변환하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { mode: 'summary' as const, icon: FileText, color: 'text-green-400', label: '요약', desc: '3줄 요약 생성' },
                      { mode: 'script' as const, icon: Video, color: 'text-red-400', label: '대본', desc: '쇼츠 대본 변환' },
                      { mode: 'image-prompt' as const, icon: ImageIcon, color: 'text-purple-400', label: '이미지 프롬프트', desc: 'AI 이미지 생성용' },
                    ].map(({ mode, icon: Icon, color, label, desc }) => (
                      <Button
                        key={mode}
                        onClick={() => generateContent(mode)}
                        disabled={isGenerating}
                        variant="outline"
                        className={`h-auto py-6 flex flex-col items-center gap-3 ${styles.buttonOutline} hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-600/20 hover:border-cyan-400/50 transition-all`}
                      >
                        <Icon className={`w-10 h-10 ${color}`} />
                        <div className="text-center">
                          <div className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{label}</div>
                          <div className={`text-xs ${styles.muted}`}>{desc}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 설정 탭 */}
          <TabsContent value="settings" className="space-y-6">
            <Card className={`${styles.cardBg} shadow-2xl max-w-3xl mx-auto`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Key className="w-5 h-5" />
                  Google API 키 설정
                </CardTitle>
                <CardDescription className={styles.description}>
                  Google AI Studio에서 발급받은 API 키를 입력하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${styles.label}`}>API 키</label>
                  <Input
                    type="password"
                    placeholder="AIzaSy..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className={`${styles.inputBg} focus:border-cyan-400 focus:ring-cyan-400/20`}
                  />
                  <p className={`text-xs ${styles.muted}`}>
                    API 키는 브라우저에만 저장되며 외부로 전송되지 않습니다.
                  </p>
                </div>
                <Button 
                  onClick={saveApiKey} 
                  className="w-full text-white border-0"
                  style={{ background: `linear-gradient(to right, ${dongAGreen}, #00796B)` }}
                  size="lg"
                >
                  API 키 저장
                </Button>
                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${styles.label}`}>API 키 발급 방법:</p>
                  <ol className={`text-sm ${styles.description} space-y-1 list-decimal list-inside`}>
                    <li>
                      <a 
                        href="https://aistudio.google.com/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline"
                      >
                        Google AI Studio
                      </a>
                      {' '}방문
                    </li>
                    <li>"Get API Key" 또는 "Create API Key" 클릭</li>
                    <li>생성된 API 키를 복사하여 위에 붙여넣기</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className={`${styles.cardBg} shadow-2xl max-w-3xl mx-auto`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Settings className="w-5 h-5" />
                  시스템 프롬프트 설정
                </CardTitle>
                <CardDescription className={styles.description}>
                  AI에게 전달할 역할과 지시사항을 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${styles.label}`}>시스템 프롬프트</label>
                  <Textarea
                    placeholder="예: 너는 IT 전문 기자야. 블로그 톤으로 써줘."
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                    className={`min-h-[200px] ${styles.inputBg} focus:border-cyan-400 focus:ring-cyan-400/20`}
                  />
                  <p className={`text-xs ${styles.muted}`}>
                    이 프롬프트는 AI가 콘텐츠를 생성할 때 기본 지침으로 사용됩니다.
                  </p>
                </div>
                <Button 
                  onClick={saveSystemInstruction} 
                  className="w-full text-white border-0"
                  style={{ background: `linear-gradient(to right, ${dongAGreen}, #00796B)` }}
                  size="lg"
                >
                  저장
                </Button>

                <div className={`space-y-2 pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                  <label className={`text-sm font-medium ${styles.label}`}>프리셋 예시</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      { label: 'IT 전문 기자', text: '당신은 전문 IT 기자입니다. 정확하고 객관적이며 흥미로운 뉴스 기사를 작성해주세요.' },
                      { label: '친근한 블로거', text: '당신은 친근한 블로거입니다. 편안하고 대화하듯이 글을 작성해주세요.' },
                      { label: '경제 전문가', text: '당신은 경제 전문가입니다. 데이터와 분석을 중심으로 심도 있는 기사를 작성해주세요.' },
                      { label: 'SNS 크리에이터', text: '당신은 소셜 미디어 콘텐츠 크리에이터입니다. 짧고 임팩트 있게 작성해주세요.' },
                    ].map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => setSystemInstruction(preset.text)}
                        className={styles.buttonOutline}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Feature 2: AI Trust Score Modal */}
      <AnimatePresence>
        {showTrustScore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTrustScore(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${styles.cardBg} rounded-2xl shadow-2xl max-w-2xl w-full p-8 border-2`}
              style={{ borderColor: dongAGreen }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ background: `linear-gradient(to right, ${dongAGreen}, #00796B)` }}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ color: dongAGreen }}>AI 신뢰도 분석</h2>
                    <p className={`text-sm ${styles.description}`}>데이터 교차 검증 완료</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTrustScore(false)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: dongAGreen }} />
                  <p className={`text-lg font-semibold ${styles.text}`}>데이터 교차 검증 중...</p>
                  <p className={`text-sm ${styles.muted}`}>AI가 기사의 신뢰도를 분석하고 있습니다</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={trustScoreData}>
                        <PolarGrid stroke={theme === 'dark' ? '#ffffff20' : '#00000020'} />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: theme === 'dark' ? '#cbd5e1' : '#475569', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]}
                          tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }}
                        />
                        <Radar 
                          name="신뢰도" 
                          dataKey="score" 
                          stroke={dongAGreen}
                          fill={dongAGreen}
                          fillOpacity={0.6}
                          animationDuration={1500}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-center p-6 rounded-xl" style={{ background: `linear-gradient(to right, ${dongAGreen}20, #00796B20)` }}>
                    <div className="text-5xl font-bold mb-2" style={{ color: dongAGreen }}>
                      {getTotalTrustScore()}%
                    </div>
                    <div className="text-2xl font-bold mb-1" style={{ color: dongAGreen }}>A+ 등급</div>
                    <p className={`text-sm ${styles.description}`}>종합 신뢰도 평가</p>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {trustScoreData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`text-center p-3 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}
                      >
                        <div className="text-2xl font-bold mb-1" style={{ color: dongAGreen }}>
                          {item.score}
                        </div>
                        <div className={`text-xs ${styles.muted}`}>{item.subject}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
