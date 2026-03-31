# GEMINI.md - 마이링크 (MyLink) 프로젝트 가이드

> **[필수 규칙] 언어 정책**: 이 프로젝트에서 AI는 **반드시 한국어**를 사용해야 합니다.
> 대화 응답, 계획(implementation_plan), 태스크(task), 워크스루(walkthrough), 주석, 커밋 메시지 등
> **모든 텍스트 산출물은 예외 없이 한국어로 작성**합니다. 영어로 작성하는 것은 절대 허용되지 않습니다.

이 파일은 마이링크 프로젝트의 구조, 기술 스택, 개발 규칙 및 실행 방법을 정의합니다. Gemini CLI는 이 가이드를 최우선적으로 준수하여 작업을 수행해야 합니다.

## 1. 프로젝트 개요 (Project Overview)
마이링크(MyLink)는 사용자가 SNS, 쇼핑몰, 블로그 등 다양한 링크를 하나의 통합 페이지에서 관리하고 공유할 수 있는 프로필 링크 서비스(Linktree 클론)입니다.

### 핵심 목표
- **간결함**: 텍스트 중심의 프로필 관리 (이미지 업로드 없음).
- **직관성**: 인라인 편집(Inline Edit)을 통한 즉각적인 데이터 수정 및 저장.
- **데이터 보존**: 사용자가 탈퇴하더라도 통계 및 링크 데이터는 영구 보존.

### 주요 기술 스택
- **Framework**: Next.js 16.1.7 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS 4.2.1, shadcn/ui
- **Icons**: Hugeicons (React 버전)
- **Language**: TypeScript 5.9.3

## 2. 프로젝트 구조 (Architecture)
- `app/`: Next.js App Router 기반의 페이지 및 레이아웃.
- `components/`: 재사용 가능한 UI 컴포넌트 (`ui/` 폴더 내 shadcn/ui 포함).
- `docs/`: PRD, 사용자 시나리오, 와이어프레임 등 기획 문서.
- `lib/`: 공통 유틸리티 함수 (`utils.ts`).
- `hooks/`: 커스텀 React 훅.
- `public/`: 정적 자산 (파비콘 등).

## 3. 실행 및 관리 명령어 (Commands)
| 작업 | 명령어 |
| :--- | :--- |
| **개발 서버 실행** | `npm run dev` |
| **프로젝트 빌드** | `npm run build` |
| **프로덕션 실행** | `npm run start` |
| **린트 체크** | `npm run lint` |
| **코드 포맷팅** | `npm run format` |
| **타입 체크** | `npm run typecheck` |
| **컴포넌트 추가** | `npx shadcn@latest add [component-name]` |

## 4. 개발 규칙 및 컨벤션 (Conventions)
- **언어 설정 (필수)**: 모든 응답, 계획(implementation_plan), 태스크(task), 워크스루(walkthrough), 문서, 주석, 커밋 메시지는 **반드시 한국어**로 작성합니다. 영어 사용은 절대 금지이며, 기술 용어(예: API, URL 등)에 한해서만 영어 표기를 허용합니다.
- **인라인 편집 (Inline Edit)**: 프로필 및 링크 수정 시 `onBlur` 또는 `onKeyDown(Enter)` 이벤트를 사용하여 즉시 저장되도록 구현합니다.
- **식별자 체계**:
  - `displayName`: URL 슬러그로 사용 (가입 시 이메일 아이디 자동 추출).
  - `username`: 페이지에 표시되는 실제 이름.
- **검증**: 개발 완료 후 반드시 `npm run build` 또는 `npm run lint`를 통해 코드를 검증합니다.
- **데이터 정책**: 탈퇴 시에도 데이터를 삭제하지 않는 정책(Soft Delete 또는 보존)을 염두에 두고 설계합니다.
- **파비콘**: 각 링크의 아이콘은 Google Favicon API(`https://www.google.com/s2/favicons?domain=...`)를 사용합니다.

## 5. 참고 문서 (Reference)
- `docs/PRD.md`: 상세 제품 요구사항 정의서.
- `docs/UserScenario.md`: 사용자 시나리오 및 경험 설계.
- `docs/Wireframe.md`: 페이지 구조 및 UI 설계 (Mermaid 다이어그램 포함).
