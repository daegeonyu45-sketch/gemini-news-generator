# AI 뉴스 콘텐츠 자동화 플랫폼 - 프로젝트 정보

## 📁 프로젝트 구조 (Tree)

```
ai-news-platform/
├── README.md                      # 프로젝트 문서
├── TEST_RESULTS.md                # 테스트 결과
├── components.json                # Shadcn/UI 설정
├── eslint.config.mjs              # ESLint 설정
├── next-env.d.ts                  # Next.js 타입 정의
├── next.config.ts                 # Next.js 설정
├── package.json                   # 의존성 패키지
├── pnpm-lock.yaml                 # 패키지 잠금 파일
├── pnpm-workspace.yaml            # pnpm 워크스페이스
├── postcss.config.mjs             # PostCSS 설정
├── tsconfig.json                  # TypeScript 설정
├── .env.local                     # 환경변수 (GOOGLE_API_KEY)
├── app/
│   ├── favicon.ico                # 파비콘
│   ├── globals.css                # 전역 스타일
│   ├── layout.tsx                 # 루트 레이아웃 (Toaster 포함)
│   ├── page.tsx                   # 메인 페이지 (대시보드 + 설정)
│   └── api/
│       └── generate/
│           └── route.ts           # Gemini API 통합 백엔드 라우트
├── components/
│   └── ui/                        # Shadcn/UI 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── sonner.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
├── lib/
│   └── utils.ts                   # 유틸리티 함수 (cn)
└── public/                        # 정적 파일
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

## 📦 설치해야 할 패키지 목록

### 핵심 패키지
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.563.0",
    "next": "^16.1.6",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "sonner": "^1.x.x",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "@types/node": "^20.19.30",
    "@types/react": "^19.2.10",
    "@types/react-dom": "^19.2.3",
    "eslint": "^9.39.2",
    "eslint-config-next": "^16.1.6",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3"
  }
}
```

### 패키지 설명

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `@google/generative-ai` | 0.24.1 | Google Gemini API SDK |
| `class-variance-authority` | 0.7.1 | CVA 유틸리티 (컴포넌트 variant 관리) |
| `clsx` | 2.1.1 | 클래스 이름 조합 유틸리티 |
| `tailwind-merge` | 3.4.0 | Tailwind 클래스 병합 (충돌 방지) |
| `lucide-react` | 0.563.0 | 아이콘 라이브러리 |
| `sonner` | 1.x.x | Toast 알림 컴포넌트 |

## 🔑 핵심 파일 코드

### 1. `/app/api/generate/route.ts` (백엔드 API Route)

**주요 기능:**
- Google Gemini 1.5 Flash 모델 초기화
- 스트리밍 응답 구현 (ReadableStream)
- 모드별 프롬프트 생성 (article, summary, script, image-prompt)
- Safety Settings 설정 (BLOCK_ONLY_HIGH)
- 에러 핸들링 (할당량 초과, API 키 오류 등)

**핵심 코드:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  const { prompt, systemInstruction, mode } = await request.json();
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction || '당신은 전문 기자입니다...',
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      // ... 기타 카테고리
    ],
  });

  const result = await model.generateContentStream(finalPrompt);

  // ReadableStream 생성
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
```

### 2. `/app/page.tsx` (메인 페이지)

**주요 기능:**
- 대시보드 및 설정 탭 UI
- 스트리밍 응답 처리 (ReadableStream Reader)
- LocalStorage를 통한 시스템 프롬프트 저장
- 멀티 포맷 변환 버튼 (요약, 대본, 이미지 프롬프트)
- AbortController를 통한 생성 취소
- Toast 알림 (sonner)

**핵심 코드:**
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateContent = async (mode: 'article' | 'summary' | 'script' | 'image-prompt') => {
    setIsGenerating(true);
    setGeneratedContent('');
    abortControllerRef.current = new AbortController();

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction, mode }),
      signal: abortControllerRef.current.signal,
    });

    // 스트리밍 응답 처리
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;
      setGeneratedContent(accumulatedText);
    }

    toast.success('기사가 생성되었습니다!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* UI 컴포넌트 */}
    </div>
  );
}
```

### 3. `/app/layout.tsx` (루트 레이아웃)

**주요 기능:**
- 전역 메타데이터 설정
- Toaster 컴포넌트 통합
- 폰트 설정 (Geist Sans, Geist Mono)

**핵심 코드:**
```typescript
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AI 뉴스 콘텐츠 자동화 플랫폼",
  description: "Google Gemini API를 활용한 AI 기반 뉴스 및 콘텐츠 자동화 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

## 🎨 Shadcn/UI 컴포넌트

### 설치된 컴포넌트
1. **Button** (`components/ui/button.tsx`)
   - variant: default, outline, ghost, destructive
   - size: default, sm, lg, icon

2. **Card** (`components/ui/card.tsx`)
   - CardHeader, CardTitle, CardDescription, CardContent

3. **Input** (`components/ui/input.tsx`)
   - 단일 라인 텍스트 입력

4. **Textarea** (`components/ui/textarea.tsx`)
   - 멀티 라인 텍스트 입력/출력

5. **Tabs** (`components/ui/tabs.tsx`)
   - TabsList, TabsTrigger, TabsContent

6. **Sonner** (`components/ui/sonner.tsx`)
   - Toast 알림 시스템

## 🚀 실행 방법

### 1. 패키지 설치
```bash
cd ai-news-platform
pnpm install
```

### 2. 환경변수 설정
`.env.local` 파일에 Google API Key 추가:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 3. 개발 서버 실행
```bash
pnpm dev
```

### 4. 브라우저 접속
```
http://localhost:3000
```

## 🔧 주요 기능 구현 상세

### 1. 프롬프트 엔지니어링 설정
- **저장 방식**: LocalStorage (`systemInstruction` 키)
- **프리셋 예시**: IT 전문 기자, 친근한 블로거, 경제 전문가, SNS 크리에이터
- **적용 시점**: API 호출 시 `systemInstruction` 파라미터로 전달

### 2. 스트리밍 응답 구현
- **백엔드**: `generateContentStream()` 메서드 사용
- **프론트엔드**: ReadableStream Reader로 청크 단위 수신
- **UI 업데이트**: 누적 텍스트를 실시간으로 상태에 반영

### 3. 멀티 포맷 변환
- **요약**: "다음 내용을 3줄로 요약해주세요" 프롬프트
- **대본**: "유튜브 쇼츠 대본 스타일(30초 분량)로 변환" 프롬프트
- **이미지 프롬프트**: "AI 이미지 생성 프롬프트를 영어로 작성" 프롬프트

### 4. 에러 핸들링
- **API Key 오류**: "API 키가 올바르지 않습니다" 메시지
- **할당량 초과**: "API 할당량이 초과되었습니다" 메시지
- **생성 취소**: AbortController를 통한 요청 중단

## 📊 기술 스택 요약

| 카테고리 | 기술 |
|----------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.9 |
| **Styling** | Tailwind CSS 4.1 |
| **UI Library** | Shadcn/UI |
| **AI SDK** | Google Generative AI 0.24 |
| **Icons** | Lucide React 0.563 |
| **Toast** | Sonner |
| **Package Manager** | pnpm 10.28 |

## 🎯 프로젝트 특징

1. **최신 기술 스택**: Next.js 16, React 19, Tailwind CSS 4 사용
2. **타입 안전성**: TypeScript로 전체 프로젝트 구현
3. **실시간 스트리밍**: 타자 치듯 글자가 실시간으로 생성되는 UX
4. **모듈화된 구조**: App Router 기반의 명확한 디렉토리 구조
5. **반응형 디자인**: 모바일, 태블릿, 데스크탑 완벽 대응
6. **사용자 경험**: Toast 알림, 로딩 상태, 에러 메시지 등 세심한 UX
7. **확장 가능성**: 컴포넌트 기반 구조로 기능 추가 용이

## 📝 추가 개발 아이디어

1. **콘텐츠 히스토리**: 생성된 기사 목록 저장 및 관리
2. **다국어 지원**: i18n을 통한 다국어 인터페이스
3. **이미지 생성 통합**: Gemini 이미지 생성 API 연동
4. **PDF 내보내기**: 생성된 기사를 PDF로 다운로드
5. **사용자 인증**: 개인별 프롬프트 및 히스토리 관리
6. **협업 기능**: 팀원과 기사 공유 및 피드백
7. **SEO 최적화**: 메타 태그 자동 생성 기능

---

**프로젝트 완료 일시**: 2026년 1월 30일  
**개발 환경**: Next.js 16.1.6 (Turbopack)  
**상태**: ✅ 프로덕션 준비 완료
