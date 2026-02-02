# Bento Grid 메인 대시보드 구현

## 🎨 디자인 컨셉: "Dynamic AI News Grid"

Apple 스타일의 Bento Grid 레이아웃을 적용하여 동아일보의 전통적인 카테고리를 현대적이고 역동적으로 표현했습니다.

## ✅ 구현된 기능

### 1. Bento Grid Layout System

CSS Grid를 사용하여 화면을 불규칙하지만 조화로운 타일 형태로 분할했습니다. 전체 레이아웃은 `grid-cols-4`를 기반으로 하며, 각 타일은 `auto-rows-[200px]`로 균일한 높이를 유지합니다.

**Hero Tile (2x2)** - 가장 큰 타일로, "AI 추천 오늘의 헤드라인"을 표시합니다. 배경에 고화질 이미지를 배치하고, 하단에 그라데이션(`from-black/80 via-black/40 to-transparent`)과 함께 제목을 표시합니다. 우측 상단에는 "오늘의 헤드라인" 뱃지가 Glassmorphism 스타일로 구현되어 있습니다.

**Trend Tile (2x1)** - 가로로 긴 타일로, "실시간 AI 트렌드 분석"을 표시합니다. 1위부터 5위까지의 키워드가 3초마다 롤링되는 애니메이션이 적용되어 있으며, 각 키워드는 순위, 이름, 변화율을 표시합니다.

**Category Tiles (1x1)** - 정치, 경제, 사회, 문화, 스포츠, IT 등 6개의 카테고리 타일입니다. 각 카드에는 Lucide React 아이콘과 실시간 기사 수 뱃지(`+24건` 형식)가 표시됩니다. 아이콘은 카테고리별로 고유한 색상을 가지고 있습니다.

**CTA Tile (2x1)** - "AI 기사 작성 시작하기" 타일로, 사용자를 `/create` 페이지로 유도합니다. Emerald-Cyan 그라데이션 배경에 Sparkles 아이콘과 함께 구현되었습니다.

### 2. Visual Effects & Interactions

**Hover Interaction**은 모든 타일에 적용되어 있습니다. 마우스를 올리면 카드가 살짝 떠오르는 효과(`hover:scale-[1.02]` 또는 `hover:scale-[1.05]`)가 적용되며, Hero Tile의 경우 배경 이미지가 줌인(`group-hover:scale-110`)됩니다.

**Glassmorphism**은 타일의 텍스트 박스와 뱃지에 적용되어 있습니다. `bg-black/30 backdrop-blur-md` 또는 `bg-white/5 backdrop-blur-lg`를 사용하여 반투명 유리 효과를 구현했습니다.

**Color Palette**는 다음과 같이 구성되어 있습니다. 배경은 `bg-slate-950` (다크 모드)를 유지하며, 포인트 컬러로 동아일보 로고 색상과 유사한 `Emerald-500` (#10B981)을 사용했습니다. 카테고리별로 Blue, Emerald, Purple, Pink, Orange, Cyan 색상을 배정했습니다.

### 3. Content Structure

**Header**는 좌측에 "DONG-A AI Newsroom" 로고와 Newspaper 아이콘, Sparkles 애니메이션이 배치되어 있습니다. 우측에는 현재 시간, 날씨 위젯(18°C), 테마 전환 버튼이 위치합니다.

**Content**는 더미 데이터로 채워져 있으며, 현실적인 뉴스 제목을 사용했습니다. Hero Tile에는 "생성형 AI, 저널리즘의 미래를 바꾸다"라는 제목과 설명이 표시되며, Trend Tile에는 "생성형 AI", "손흥민 20호골", "반도체 수출", "부동산 정책", "기후변화 대응" 등의 키워드가 롤링됩니다.

**Footer**는 "© 2026 DONG-A AI Newsroom. Powered by Google Gemini AI." 문구가 중앙에 표시됩니다.

### 4. Technical Implementation

**Framer Motion**을 사용하여 부드러운 진입 애니메이션을 구현했습니다. 각 타일은 `initial={{ opacity: 0, scale: 0.9 }}`에서 시작하여 `animate={{ opacity: 1, scale: 1 }}`로 전환되며, `delay`를 0.1초씩 증가시켜 순차적으로 나타납니다.

**Next.js Link Component**를 사용하여 모든 타일이 `/create` 페이지로 라우팅됩니다. 클릭 시 기존의 기사 작성 페이지로 이동합니다.

**Responsive Grid**는 `grid-cols-4`를 기반으로 하며, `col-span-2`, `row-span-2` 등을 사용하여 타일의 크기를 조절합니다. 모바일 환경에서는 자동으로 단일 컬럼으로 전환됩니다.

### 5. Animation Details

**Trend Rolling Animation**은 `setInterval`을 사용하여 3초마다 트렌드 인덱스를 변경하며, Framer Motion의 `initial`, `animate`, `exit` 속성을 사용하여 부드러운 전환 효과를 구현했습니다.

**Icon Pulse Effect**는 Sparkles 아이콘에 `animate-pulse` 클래스를 적용하여 구현했습니다.

**Time Update**는 `setInterval`을 사용하여 1분마다 현재 시간을 업데이트합니다.

## 🚀 사용자 경험

메인 대시보드는 사용자가 웹사이트에 처음 접속했을 때 보게 되는 페이지입니다. Bento Grid 레이아웃은 시각적으로 매력적이며, 각 타일은 명확한 목적을 가지고 있습니다. 사용자는 Hero Tile에서 추천 헤드라인을 확인하고, Trend Tile에서 실시간 트렌드를 파악하며, Category Tiles에서 관심 있는 섹션을 선택할 수 있습니다. 모든 타일은 `/create` 페이지로 연결되어, 사용자가 즉시 AI 기사 작성을 시작할 수 있도록 유도합니다.

## 📊 라우팅 구조

- `/` - Bento Grid 메인 대시보드 (새로 구현)
- `/create` - AI 기사 작성 페이지 (기존 페이지 이동)

모든 타일에서 `/create`로 라우팅되며, Next.js의 `<Link>` 컴포넌트를 사용하여 클라이언트 사이드 네비게이션을 구현했습니다.

## 🎯 디자인 원칙

**Apple-inspired Bento Grid**는 불규칙하지만 조화로운 레이아웃으로, 각 요소가 명확한 위계를 가지고 있습니다. Hero Tile이 가장 큰 비중을 차지하며, 나머지 타일들은 균형 있게 배치되어 있습니다.

**Emerald Accent Color**는 동아일보의 전통적인 그린 색상을 현대적으로 재해석한 것으로, Emerald-500을 포인트 컬러로 사용했습니다.

**Smooth Animations**는 모든 인터랙션에 부드러운 전환 효과를 적용하여 프리미엄 경험을 제공합니다.

**Glassmorphism**은 현대적이고 세련된 느낌을 주며, 배경 이미지와 텍스트의 조화를 이룹니다.

모든 요구사항이 성공적으로 구현되었습니다! 🎉
