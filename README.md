# Gemini News Generator

Google Gemini API를 활용한 AI 기반 뉴스 및 콘텐츠 자동화 플랫폼입니다. 키워드만 입력하면 기사 작성, 요약, 대본 생성이 자동으로 수행됩니다.

## 🚀 주요 기능

### 1. 프롬프트 엔지니어링 설정
- AI(Gemini)에게 보낼 시스템 프롬프트를 저장하고 관리
- 프리셋 예시 제공 (IT 전문 기자, 블로거, 경제 전문가, SNS 크리에이터)
- LocalStorage를 통한 설정 영구 저장

### 2. Gemini 기반 기사 작성 자동화
- 주제 입력만으로 전문적인 기사 자동 생성
- **Gemini 1.5 Flash** 모델 사용
- **실시간 스트리밍 응답** - 타자 치듯 글자가 실시간으로 생성

### 3. 멀티 포맷 변환 (One-Click Actions)
- **요약**: 작성된 기사를 3줄로 요약
- **대본**: 유튜브 쇼츠 대본 스타일로 변환
- **이미지 프롬프트**: AI 이미지 생성용 영어 프롬프트 생성

### 4. 반응형 UI/UX
- 모바일, 태블릿, 데스크탑 완벽 대응
- Shadcn/UI 기반의 세련된 뉴스룸 스타일 디자인
- 다크 모드 지원

### 5. 에러 핸들링
- API 할당량 초과, 키 오류 등 친절한 에러 메시지
- Toast 알림을 통한 사용자 피드백

## 📦 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI/UX**: Tailwind CSS, Shadcn/UI
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **State Management**: React Hooks / Context API
- **Icons**: Lucide React

## 📁 프로젝트 구조

```
ai-news-platform/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Gemini API 통합 백엔드 라우트
│   ├── favicon.ico
│   ├── globals.css               # 전역 스타일
│   ├── layout.tsx                # 루트 레이아웃 (Toaster 포함)
│   └── page.tsx                  # 메인 페이지 (대시보드 + 설정)
├── components/
│   └── ui/                       # Shadcn/UI 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── tabs.tsx
│       └── sonner.tsx
├── lib/
│   └── utils.ts                  # 유틸리티 함수
├── public/                       # 정적 파일
├── .env.local                    # 환경변수 (GOOGLE_API_KEY)
├── components.json               # Shadcn/UI 설정
├── next.config.ts                # Next.js 설정
├── package.json                  # 의존성 패키지
├── tailwind.config.ts            # Tailwind CSS 설정
└── tsconfig.json                 # TypeScript 설정
```

## 🛠️ 설치 및 실행

### 1. 패키지 설치

```bash
pnpm install
```

### 필수 패키지 목록
- `@google/generative-ai` - Google Gemini API SDK
- `class-variance-authority` - CVA 유틸리티
- `clsx` - 클래스 이름 조합
- `tailwind-merge` - Tailwind 클래스 병합
- `lucide-react` - 아이콘 라이브러리
- `sonner` - Toast 알림

### 2. 환경변수 설정

`.env.local` 파일에 Google API Key를 설정하세요:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

**Google API Key 발급 방법:**
1. [Google AI Studio](https://aistudio.google.com/apikey) 방문
2. "Get API Key" 클릭
3. 프로젝트 선택 또는 새로 생성
4. API Key 복사하여 `.env.local`에 붙여넣기

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 🎯 사용 방법

### 기사 작성
1. **대시보드** 탭에서 "주제" 입력란에 원하는 주제 입력
2. "기사 생성" 버튼 클릭
3. 실시간으로 생성되는 기사 확인

### 멀티 포맷 변환
1. 기사 생성 후 하단의 "멀티 포맷 변환" 섹션 확인
2. 원하는 형식 버튼 클릭:
   - **요약**: 3줄 요약 생성
   - **대본**: 유튜브 쇼츠 대본 변환
   - **이미지 프롬프트**: AI 이미지 생성용 프롬프트

### 시스템 프롬프트 설정
1. **설정** 탭으로 이동
2. 시스템 프롬프트 입력란에 AI 역할 및 지시사항 입력
3. "저장" 버튼 클릭
4. 또는 프리셋 예시 중 하나 선택

## 🔧 API 라우트 상세

### POST `/api/generate`

**요청 본문:**
```json
{
  "prompt": "2026년 AI 기술 트렌드",
  "systemInstruction": "당신은 전문 IT 기자입니다...",
  "mode": "article" // "article" | "summary" | "script" | "image-prompt"
}
```

**응답:**
- Content-Type: `text/plain; charset=utf-8`
- Transfer-Encoding: `chunked` (스트리밍)

**에러 응답:**
```json
{
  "error": "API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요."
}
```

## 🎨 UI 컴포넌트

### Shadcn/UI 컴포넌트 사용
- **Button**: 다양한 variant (default, outline, ghost 등)
- **Card**: 콘텐츠 그룹화 및 섹션 구분
- **Input**: 단일 라인 텍스트 입력
- **Textarea**: 멀티 라인 텍스트 입력/출력
- **Tabs**: 대시보드와 설정 탭 전환
- **Sonner**: Toast 알림 (성공, 에러, 정보)

## 🔐 보안 설정

### Gemini API Safety Settings
```typescript
safetySettings: [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_ONLY_HIGH',
  },
  // ... 기타 카테고리
]
```

- 콘텐츠 생성을 막지 않도록 `BLOCK_ONLY_HIGH` 설정
- 유해 콘텐츠 필터링 최소화

## 📱 반응형 디자인

- **모바일** (< 768px): 단일 컬럼 레이아웃
- **태블릿** (768px - 1024px): 2컬럼 그리드
- **데스크탑** (> 1024px): 최대 너비 7xl, 최적화된 레이아웃

## 🐛 트러블슈팅

### API Key 오류
```
Error: API 키가 올바르지 않습니다. 설정을 확인해주세요.
```
→ `.env.local` 파일의 `GOOGLE_API_KEY` 확인

### 할당량 초과
```
Error: API 할당량이 초과되었습니다. 잠시 후 다시 시도해주세요.
```
→ Google AI Studio에서 할당량 확인 또는 유료 플랜 전환

### 스트리밍 응답 오류
→ 브라우저 콘솔에서 네트워크 탭 확인
→ API 라우트 로그 확인 (`console.error`)

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Google AI Expert & Senior Full Stack Developer

---

**Powered by Google Gemini 1.5 Flash**
