# 타로 마스터 리딩 ✦ TOP 1%

상위 1% 타로 AI 해석 앱 — Next.js + Vercel 배포 버전

---

## 🚀 Vercel 배포 방법 (5분 완성)

### 1단계 — GitHub에 올리기
1. github.com 접속 → 로그인
2. **New repository** → 이름: `tarot-master` → Create
3. 이 폴더 안의 파일들을 모두 업로드 (Upload files)

### 2단계 — Vercel 연결
1. vercel.com 접속 → GitHub 계정으로 로그인
2. **Add New Project** → GitHub에서 `tarot-master` 선택
3. **Import** 클릭

### 3단계 — API 키 환경변수 설정 ⭐ 중요
Vercel 프로젝트 설정에서:
1. **Settings** → **Environment Variables**
2. **Name**: `ANTHROPIC_API_KEY`
3. **Value**: `sk-ant-api03-...` (본인 API 키)
4. **Save** 클릭

### 4단계 — 배포
1. **Deploy** 클릭
2. 1~2분 후 `https://tarot-master-xxx.vercel.app` URL 생성
3. 완료! 🎉

---

## 🔑 Anthropic API 키 발급
1. console.anthropic.com 접속
2. 로그인 → **API Keys** → **Create Key**
3. 키 복사 (`sk-ant-api03-...`)

---

## 📁 파일 구조
```
tarot-master/
├── pages/
│   ├── index.js        ← 타로 앱 메인
│   ├── _app.js         ← 전역 설정
│   └── api/
│       └── tarot.js    ← Anthropic API 프록시 (CORS 해결)
├── styles/
│   └── globals.css
├── package.json
├── next.config.js
└── README.md           ← 이 파일
```

---

## ✅ 기능
- 78장 전체 덱 (메이저 22장 + 마이너 56장)
- 내담자 직접 뽑기 / 상담사 리딩 2가지 모드
- 카드 번호 입력 선택
- 원카드 / 쓰리카드 / 파이브크로스 / 켈틱크로스(10장)
- 상위 1% AI 해석 (융 심리학 · 3단계 해석 · 패턴 분석)
- 꼬리질문 3개 자동 생성
- 결과 저장 · 공유 기능
