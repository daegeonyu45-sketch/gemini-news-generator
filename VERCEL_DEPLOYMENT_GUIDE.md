# 🚀 Vercel 배포 가이드

## 개요

이 가이드는 AI 뉴스 콘텐츠 자동화 플랫폼을 Vercel에 배포하여 영구적인 웹사이트 URL을 얻는 방법을 설명합니다.

**예상 소요 시간**: 5-10분  
**비용**: 무료 (Hobby 플랜)

---

## 방법 1: GitHub + Vercel (추천)

### 1단계: GitHub 저장소 생성

1. https://github.com/new 방문
2. 저장소 설정:
   - **Repository name**: `ai-news-platform`
   - **Description**: "AI 뉴스 콘텐츠 자동화 플랫폼 - Google Gemini API"
   - **Public** 또는 **Private** 선택 (둘 다 가능)
3. "Create repository" 클릭

### 2단계: 프로젝트 업로드

로컬에서 압축 파일을 해제한 후:

```bash
cd ai-news-platform

# Git 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/ai-news-platform.git

# 메인 브랜치로 변경 (GitHub 기본값)
git branch -M main

# 푸시
git push -u origin main
```

**참고**: `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경하세요.

### 3단계: Vercel 배포

1. https://vercel.com 방문
2. "Sign Up" 또는 "Log In" (GitHub 계정으로 로그인 추천)
3. 대시보드에서 "Add New..." → "Project" 클릭
4. "Import Git Repository" 섹션에서 `ai-news-platform` 선택
5. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `pnpm build` (자동 설정됨)
   - **Output Directory**: `.next` (자동 설정됨)
6. "Deploy" 클릭

### 4단계: 환경 변수 설정

배포가 완료되면:

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Environment Variables" 클릭
3. 환경 변수 추가:
   - **Name**: `GOOGLE_API_KEY`
   - **Value**: (Google AI Studio에서 발급받은 API Key)
   - **Environment**: Production, Preview, Development 모두 선택
4. "Save" 클릭
5. "Deployments" 탭으로 이동하여 "Redeploy" 클릭

---

## 방법 2: Vercel CLI (고급 사용자)

### 1단계: Vercel CLI 로그인

```bash
vercel login
```

이메일 주소를 입력하면 인증 링크가 전송됩니다.

### 2단계: 프로젝트 배포

```bash
cd ai-news-platform
vercel
```

프롬프트에 따라 설정:
- **Set up and deploy**: Yes
- **Which scope**: (본인 계정 선택)
- **Link to existing project**: No
- **Project name**: ai-news-platform
- **Directory**: `./`
- **Override settings**: No

### 3단계: 환경 변수 설정

```bash
vercel env add GOOGLE_API_KEY
```

API Key를 입력하고 Production 환경 선택.

### 4단계: 프로덕션 배포

```bash
vercel --prod
```

---

## 배포 후 확인

### 1. 배포 URL 확인

Vercel 대시보드 또는 CLI 출력에서 배포 URL을 확인할 수 있습니다:

```
https://ai-news-platform.vercel.app
```

또는 사용자 지정 도메인:

```
https://ai-news-platform-YOUR_USERNAME.vercel.app
```

### 2. 웹사이트 테스트

1. 배포 URL 접속
2. 메인 대시보드 (Bento Grid) 확인
3. "AI 기사 생성" 페이지로 이동 (`/create`)
4. 설정 탭에서 Google API Key 입력 및 저장
5. 주제 입력 후 기사 생성 테스트
6. Time Machine, AI Trust Score, Persona Selector 기능 테스트

### 3. 커스텀 도메인 설정 (선택사항)

Vercel 대시보드에서:
1. "Settings" → "Domains" 클릭
2. 원하는 도메인 입력 (예: `news.yourdomain.com`)
3. DNS 설정 안내에 따라 도메인 연결

---

## 문제 해결

### 빌드 오류

**증상**: 배포 중 빌드 실패

**해결**:
1. Vercel 대시보드에서 "Deployments" → 실패한 배포 클릭
2. 빌드 로그 확인
3. 일반적인 원인:
   - 환경 변수 누락 → `GOOGLE_API_KEY` 설정 확인
   - 패키지 설치 실패 → `package.json` 확인

### API Key 오류

**증상**: "API key not valid" 오류

**해결**:
1. Google AI Studio에서 새 API Key 발급
2. Vercel 환경 변수 업데이트
3. 프로젝트 재배포

### 페이지 로딩 느림

**증상**: 초기 로딩이 느림

**해결**:
- 정상입니다. Vercel의 Serverless Functions는 Cold Start가 있을 수 있습니다.
- Pro 플랜으로 업그레이드하면 성능이 향상됩니다.

---

## 자동 배포 설정

GitHub 저장소에 푸시할 때마다 자동으로 배포되도록 설정되어 있습니다.

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# Vercel이 자동으로 새 버전 배포
```

---

## Vercel 플랜 비교

### Hobby (무료)
- ✅ 무제한 배포
- ✅ 자동 HTTPS
- ✅ 100GB 대역폭/월
- ✅ 서버리스 함수 (10초 제한)
- ❌ 팀 협업 기능 없음

### Pro ($20/월)
- ✅ Hobby의 모든 기능
- ✅ 1TB 대역폭/월
- ✅ 서버리스 함수 (60초 제한)
- ✅ 팀 협업 기능
- ✅ 우선 지원

**추천**: 개인 프로젝트는 Hobby 플랜으로 충분합니다.

---

## 추가 리소스

- **Vercel 문서**: https://vercel.com/docs
- **Next.js 배포 가이드**: https://nextjs.org/docs/deployment
- **Vercel CLI 문서**: https://vercel.com/docs/cli

---

## 요약

1. GitHub에 저장소 생성 및 푸시
2. Vercel에서 GitHub 저장소 연결
3. 환경 변수 (`GOOGLE_API_KEY`) 설정
4. 배포 완료 → 영구 URL 획득!

**배포 완료 후 URL**: `https://ai-news-platform.vercel.app`

모든 기능이 정상 작동하며, 영구적으로 접근 가능합니다! 🎉
