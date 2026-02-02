# 🚀 GitHub 푸시 및 Vercel 배포 가이드

## 프로젝트 이름: gemini-news-generator

---

## 1단계: GitHub 저장소 생성

1. https://github.com/new 방문
2. 저장소 설정:
   - **Repository name**: `gemini-news-generator`
   - **Description**: "AI-powered news content generator using Google Gemini API"
   - **Public** 선택 (또는 Private)
3. **"Create repository" 클릭**

---

## 2단계: GitHub에 푸시

터미널에서 다음 명령어를 실행하세요:

```bash
cd gemini-news-generator

# GitHub 원격 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/gemini-news-generator.git

# 메인 브랜치로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**중요**: `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경하세요!

예시:
```bash
git remote add origin https://github.com/johndoe/gemini-news-generator.git
```

---

## 3단계: Vercel 배포

### 방법 1: Vercel 웹사이트 (추천)

1. https://vercel.com 방문
2. GitHub 계정으로 로그인
3. **"Add New..." → "Project"** 클릭
4. **"Import Git Repository"** 섹션에서 `gemini-news-generator` 선택
5. **"Import"** 클릭
6. 프로젝트 설정 확인:
   - Framework Preset: **Next.js** (자동 감지)
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `.next`
7. **"Deploy"** 클릭

### 방법 2: Vercel CLI

```bash
cd gemini-news-generator
vercel login
vercel --prod
```

---

## 4단계: 환경 변수 설정

배포가 완료되면:

1. Vercel 대시보드에서 프로젝트 선택
2. **"Settings" → "Environment Variables"** 클릭
3. 환경 변수 추가:
   - **Name**: `GOOGLE_API_KEY`
   - **Value**: (Google AI Studio에서 발급받은 API Key)
   - **Environment**: Production, Preview, Development 모두 선택
4. **"Save"** 클릭
5. **"Deployments"** 탭으로 이동
6. 최신 배포에서 **"Redeploy"** 클릭

---

## 5단계: 배포 확인

배포가 완료되면 다음과 같은 URL을 받게 됩니다:

```
https://gemini-news-generator.vercel.app
```

또는

```
https://gemini-news-generator-YOUR_USERNAME.vercel.app
```

---

## ✅ 배포 완료 체크리스트

- [ ] GitHub 저장소 생성
- [ ] 프로젝트 푸시 완료
- [ ] Vercel에서 프로젝트 Import
- [ ] 배포 성공 확인
- [ ] 환경 변수 (`GOOGLE_API_KEY`) 설정
- [ ] 재배포 완료
- [ ] 웹사이트 접속 테스트
- [ ] 기사 생성 기능 테스트

---

## 🎉 구현된 기능

### Bento Grid 대시보드
- Apple 스타일의 현대적인 타일 레이아웃
- Hero Tile, Trend Tile, Category Tiles
- 동아일보 6개 카테고리 (정치, 경제, 사회, 문화, 스포츠, IT)

### Time Machine
- 1980년대 클래식 신문 스타일 ↔ 2026년 모던 스타일 전환
- Sepia 필터, 나눔명조 폰트, 다단 편집 레이아웃

### AI Trust Score
- Recharts 레이더 차트로 신뢰도 시각화
- 5가지 항목: 사실성, 중립성, 출처 명확성, 윤리성, 완전성

### Persona Selector
- 논설위원, 속보팀장, 문화부 에디터 3가지 AI 기자 프로필

### 기타 기능
- Google Gemini API 통합
- 실시간 스트리밍 응답
- 다크/라이트 모드 전환
- 반응형 디자인

---

## 📚 추가 리소스

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포**: https://nextjs.org/docs/deployment
- **Google AI Studio**: https://aistudio.google.com/apikey

---

## 🆘 문제 해결

### 푸시 오류
```bash
# 원격 저장소 확인
git remote -v

# 원격 저장소 변경
git remote set-url origin https://github.com/YOUR_USERNAME/gemini-news-generator.git
```

### 빌드 오류
- Vercel 대시보드 → Deployments → 실패한 배포 클릭 → 로그 확인
- 환경 변수 누락 확인

### API Key 오류
- Google AI Studio에서 새 API Key 발급
- Vercel 환경 변수 업데이트
- 재배포

---

## 🎯 다음 단계

1. 커스텀 도메인 연결 (선택사항)
2. Analytics 설정
3. SEO 최적화
4. 성능 모니터링

---

**배포 성공을 기원합니다! 🚀**
