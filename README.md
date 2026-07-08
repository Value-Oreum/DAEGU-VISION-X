# DAEGU VISION X

**안경을 파는 거리에서, 미래를 체험하는 도시로**
스마트글라스·AR/XR 기반 대구 북구 미래 체험관 조성 구상 — 정책 제안형 랜딩 페이지.

## 개요
대구 북구 안경산업특구를 스마트글라스 시대의 **도시 체험 플랫폼**으로 전환하는 제안을
하나의 스크롤형 페이지로 담았습니다. (문제 → 전환 → 경험 → 체험관 → 추진 구조)

- 순수 **HTML / CSS / JS** (빌드 도구·프레임워크 없음)
- 외부 의존성: Pretendard 웹폰트 CSS 1건(CDN)뿐
- 다크 시네마틱(임팩트) ↔ 라이트 에디토리얼(정책 신뢰) 섹션 교차 구성
- 국/영 병기 · 반응형(데스크톱 프레젠테이션 느낌 + 모바일 최적화)

## 구조
```
index.html            # 전체 페이지 (섹션 마크업)
assets/
  css/style.css       # 디자인 시스템 · 반응형 · 애니메이션
  js/main.js          # 스크롤 리빌 · 네비 · 모바일 메뉴 (무의존성)
  img/                # 웹용 이미지 (원본 images/ 에서 안전한 파일명으로 복사)
vercel.json           # 정적 배포 · 캐시 헤더
images/               # 원본 이미지 소스 (참고용)
```

## 로컬 미리보기
정적 파일이라 서버가 필요 없지만, 절대경로(`/assets/...`) 사용으로 로컬에서 열 때는
간단한 정적 서버 사용을 권장합니다.

```bash
npx serve .
# 또는
python -m http.server 3000
```

## 배포 (Vercel)
1. 이 저장소를 Vercel에 Import
2. Framework Preset: **Other** (빌드 명령 없음, 루트가 그대로 정적 배포)
3. Deploy

## 문의 폼 연결 (Google 시트 저장 + 메일 알림)
문의 폼은 **Google Apps Script 웹앱**을 백엔드로 사용합니다. 서버·유료 서비스 없이
구글 시트에 데이터가 쌓이고, 지정한 3개 메일로 알림이 발송됩니다.

**설정 (약 5분, 구글 계정 필요):**
1. [sheets.new](https://sheets.new) 로 새 구글 시트를 하나 만듭니다.
2. 상단 메뉴 **확장 프로그램 → Apps Script** 클릭.
3. 기본 코드를 모두 지우고, `docs/apps-script.gs` 파일 내용을 통째로 붙여넣습니다.
   - 필요하면 `NOTIFY_TO` 의 메일 주소를 수정하세요. (기본값: unboundedvalue / echa.value / dkkim@dkglobalkorea)
4. **배포 → 새 배포 → 유형: 웹 앱** 선택
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자(Anyone)**  ← 반드시 이 옵션
   - **배포** 클릭 → 처음이면 권한 승인(본인 구글 계정).
5. 표시되는 **웹 앱 URL**(`https://script.google.com/macros/s/.../exec`)을 복사.
6. 프로젝트의 `assets/js/config.js` 를 열어 `contactEndpoint` 에 붙여넣고 커밋/배포:
   ```js
   window.DVX_CONFIG = {
     contactEndpoint: "https://script.google.com/macros/s/AKfycb.../exec"
   };
   ```

이후 방문자가 폼을 제출하면 → 구글 시트에 한 줄 저장 + 3개 메일로 알림이 갑니다.
(엔드포인트가 비어 있으면 폼은 "연결되지 않았습니다" 안내를 표시합니다.)

> 코드를 수정해 재배포할 때는 **배포 → 배포 관리 → 편집 → 버전: 새 버전**으로 올려야
> 변경분이 반영됩니다. URL은 그대로 유지됩니다.

## 이미지 자산
`assets/img/` 파일은 `images/` 원본을 웹 안전 파일명으로 복사한 것입니다.
(예: `concept3(16 9).png → hero.png`, `DAEGU FC1.png → fc1.png`, `작가1.png → artist1.png`)

---
DK글로벌코리아 | OREUM · 2026
