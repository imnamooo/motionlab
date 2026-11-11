# Motion Lab

**모션과 인터랙션의 감각을 직접 실험하고 기록하는 개인 실험실.**

작동하는 프리뷰를 보며 전환 방식, 움직임 곡선, 요소별 시간과 지연을 조정합니다. 특정 앱의 데모에 머무르지 않고 탭 이동·메시지 전송·시트·드래그 등 새로운 실험을 계속 쌓아가는 공간입니다.

**[↗ Motion Lab 열기 — GitHub Pages](https://imnamooo.github.io/motionlab/)**

[첫 실험: Bottom tab transitions](https://imnamooo.github.io/motionlab/#/bottom-tabs)

## 공간 구성

- **왼쪽 실험 목록:** 등록한 순서대로 실험 페이지가 누적됩니다.
- **오른쪽 실험 페이지:** 실제로 조작하는 프리뷰, 전체 배속, 요소별 타이밍, 타임라인, 구현값.
- **Overview:** 등록한 실험을 카드 형태로 모아 봅니다.
- 휴대폰에서는 상단 메뉴 버튼으로 실험 목록을 엽니다.

## Study 001 — Bottom tab transitions

슥삭의 홈·대화·설정을 예시로, 바텀 탭은 고정하고 화면 콘텐츠가 전환되는 모션을 연구합니다. 이 프리뷰는 브라우저의 HTML/CSS/JavaScript로 만든 모션 시제품입니다. 실제 iOS 네이티브 탭바 실행 환경과는 구분됩니다.

### 비교할 모션

| 모션 | 관찰할 점 |
| --- | --- |
| Slide + Fade | 다음 탭의 방향으로 화면이 움직이면서 이동과 페이드가 동시에 재생됩니다. 기본 실험입니다. |
| Soft slide | 이동 거리를 줄여 더 차분한 전환을 만듭니다. |
| Fade through | 이전 화면이 사라진 다음 새 화면이 나타납니다. |
| Shared axis | 좌우 이동과 미세한 크기 변화로 공간의 깊이를 만듭니다. |

### 직접 조절하는 값

- 전체 재생 배속: **0.25×~2×**. 요소별 원본 시간을 유지한 채 느리게/빠르게 봅니다.
- 화면 이동 거리: **0~180px**.
- 들어오는 화면의 시작 불투명도: **0~80%**.
- 움직임 곡선: Smooth out / Ease in-out / Snappy / Linear.
- 아래 **7개 트랙 각각의 시간 80~1,200ms, 지연 0~500ms**:
  1. 들어오는 화면의 이동
  2. 들어오는 화면의 페이드
  3. 나가는 화면의 이동
  4. 나가는 화면의 페이드
  5. 탭 선택 표시
  6. 탭 아이콘
  7. 탭 라벨

화면의 이동과 불투명도도 서로 다른 트랙입니다. ‘슬라이드한 뒤 페이드’가 아닌 **동시에 겹치는 슬라이드·페이드**를 각자 조율할 수 있습니다. 기본 Fade through는 등장 지연을 둡니다. 값을 조절하면 다른 겹침도 만들 수 있습니다.

### 사용 방법

1. 모션 종류를 선택합니다.
2. 휴대폰 프리뷰의 홈·대화·설정을 누르거나 콘텐츠를 좌우로 드래그합니다.
3. 슬라이더를 움직이면 바뀐 값으로 다시 재생됩니다. 배속은 현재 재생 중에도 반영됩니다.
4. 자동 반복으로 양방향 전환을 비교합니다. 재생 버튼으로 정지·이어서 재생·다시 재생합니다.
5. 타임라인을 끌어 중간 프레임에서 멈추고 요소가 어떻게 겹치는지 봅니다.
6. ‘지금 설정의 구현값 보기’에서 설정을 복사합니다. 시간 값은 배속 적용 전 ms입니다.

설정은 **모션별로 이 브라우저의 localStorage에만** 저장됩니다. 서버에 전송하지 않습니다. 기본값 복원은 선택한 모션만 초기화합니다. 비공개 모드나 저장 제한 환경에서는 현재 페이지에서만 조절할 수 있습니다.

시스템의 동작 줄이기가 켜져 있으면 모션 재생을 기본으로 끕니다. 실험을 직접 보고 싶을 때만 ‘실험 모션 재생 허용’을 켜면 됩니다. 시스템 설정 자체는 바꾸지 않습니다. 브라우저 탭이 숨겨지면 반복과 재생을 멈춥니다.

## 새 실험 추가

모든 실험은 `pages/index.js`의 **레지스트리 하나**에서 관리합니다.

1. `pages/` 안에 새 모듈을 만듭니다. 예: `pages/message-send.js`.
2. 모듈에서 `mount(root, { notify })`를 내보냅니다. 화면을 만들고 이벤트를 등록합니다.
3. `pages/index.js`에 항목을 추가합니다.

```js
{
  id: 'message-send',
  number: '002',
  title: 'Sending a note',
  subtitle: '메시지 전송',
  category: 'Feedback',
  description: '한 장을 보내는 순간의 움직임과 피드백.',
  load: () => import('./message-send.js'),
}
```

4. `mount`는 정리 함수를 반환해야 합니다. 실험 페이지를 떠날 때 반복 타이머, 애니메이션, 이벤트를 해제합니다.

```js
export function mount(root, { notify }) {
  root.innerHTML = '<h1>New study</h1>';
  const events = new AbortController();
  // Add interactions with { signal: events.signal }.
  return () => events.abort();
}
```

등록하면 왼쪽 목록과 Overview 카드에 자동으로 나타납니다. 경로는 `#/message-send`가 됩니다. 해시 라우팅을 사용해 GitHub Pages의 하위 경로에서도 새로고침할 수 있습니다.

## 파일 구조

```text
index.html            공통 헤더와 좌측 탐색 구조
app.js                페이지 전환, 레지스트리 탐색, Overview
styles.css            공통 디자인과 반응형 화면
icons.js              코드로 관리하는 SVG 아이콘
pages/index.js        실험 목록 레지스트리
pages/bottom-tabs.js  첫 번째 실험과 요소별 애니메이션
assets/favicon.svg    Motion Lab 아이콘
.nojekyll             GitHub Pages에서 정적 파일 직접 제공
```

## 로컬 실행

빌드 도구와 패키지 설치가 필요 없는 정적 사이트입니다. 저장소 폴더에서:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. ES module을 사용하므로 `index.html`을 파일로 직접 더블 클릭하는 대신 HTTP 서버로 실행하세요. 본문은 시스템 폰트로도 동작하며, 온라인에서는 Google Fonts의 Manrope와 DM Sans를 보조로 사용합니다.

## 배포

GitHub Pages의 **Settings → Pages → Deploy from a branch → main / (root)**로 배포합니다. 이후 `main`에 변경 사항을 푸시하면 갱신됩니다. 유료 서버나 API 키는 사용하지 않습니다.

라이브 주소: **https://imnamooo.github.io/motionlab/**

## 실험 원칙

- 타이밍을 조절했을 때 프리뷰에 실제 반영되어야 합니다.
- 한 번에 바꾸는 값과 비교할 기준을 명확하게 둡니다.
- 여러 모션의 사용자 설정을 섞어 저장하지 않습니다.
- 실험 페이지가 늘어나도 공통 내비게이션을 다시 작성하지 않습니다.
- 예쁜 장면뿐 아니라 빠른 반복 입력·반대 방향·일시정지·접근성도 확인합니다.
- 웹에서 찾은 감각은 iOS 실기기에 옮긴 뒤 한 번 더 검증합니다.
