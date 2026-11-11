import { icon } from '../icons.js';

const tabs = ['홈', '대화', '설정'];
const tabEnglish = ['Home', 'Chats', 'Settings'];
const easings = {
 standard: { label: 'Smooth out', value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
 balanced: { label: 'Ease in-out', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
 snappy: { label: 'Snappy', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
 linear: { label: 'Linear', value: 'linear' },
};
const tracks = [
 { key: 'enterMove', label: '들어오는 화면 · 이동', color: '#f47a59', duration: 420, delay: 0 },
 { key: 'enterFade', label: '들어오는 화면 · 페이드', color: '#eab08c', duration: 320, delay: 35 },
 { key: 'exitMove', label: '나가는 화면 · 이동', color: '#9ba6f0', duration: 360, delay: 0 },
 { key: 'exitFade', label: '나가는 화면 · 페이드', color: '#bbb7df', duration: 240, delay: 0 },
 { key: 'indicator', label: '탭 선택 표시', color: '#e0cf8b', duration: 360, delay: 0 },
 { key: 'icon', label: '탭 아이콘', color: '#8ebfba', duration: 260, delay: 45 },
 { key: 'label', label: '탭 라벨', color: '#adc593', duration: 220, delay: 60 },
];
const presets = [
 { id: 'slide-fade', number: '01', name: 'Slide + Fade', note: '방향이 느껴지는 이동, 부드러운 겹침.', distance: 96, scale: 1, fadeStart: 0, easing: 'standard' },
 { id: 'soft-slide', number: '02', name: 'Soft slide', note: '작은 움직임으로 차분하게 이어지는 전환.', distance: 32, scale: 1, fadeStart: 0, easing: 'balanced' },
 { id: 'fade-through', number: '03', name: 'Fade through', note: '이전 화면이 사라진 뒤 다음 화면이 나타나요.', distance: 0, scale: 1, fadeStart: 0, easing: 'balanced' },
 { id: 'shared-axis', number: '04', name: 'Shared axis', note: '이동과 크기 변화가 함께 만드는 깊이감.', distance: 64, scale: 0.94, fadeStart: 0, easing: 'standard' },
];

function defaults(id) {
 const preset = presets.find(item => item.id === id) || presets[0];
 const config = { distance: preset.distance, scale: preset.scale, fadeStart: preset.fadeStart, easing: preset.easing, speed: 1, tracks: {} };
 for (const track of tracks) config.tracks[track.key] = { duration: track.duration, delay: track.delay };
 if (id === 'soft-slide') { config.tracks.enterMove.duration = 480; config.tracks.exitMove.duration = 400; }
 if (id === 'fade-through') {
   config.tracks.exitFade = { duration: 160, delay: 0 };
   config.tracks.enterFade = { duration: 260, delay: 160 };
 }
 return config;
}
function loadSaved() {
 try {
   const stored = JSON.parse(localStorage.getItem('motionlab.bottom-tabs.v1') || '{}');
   const result = {};
   for (const preset of presets) {
     const data = stored[preset.id];
     if (!data || typeof data !== 'object') continue;
     const base = defaults(preset.id);
     const finite = (value, min, max, fallback) => typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
     for (const [key, min, max] of [['distance', 0, 180], ['scale', 0.85, 1], ['fadeStart', 0, 0.8], ['speed', 0.25, 2]]) base[key] = finite(data[key], min, max, base[key]);
     if (Object.hasOwn(easings, data.easing)) base.easing = data.easing;
     for (const track of tracks) for (const field of ['duration', 'delay']) {
       base.tracks[track.key][field] = finite(data.tracks?.[track.key]?.[field], field === 'duration' ? 80 : 0, field === 'duration' ? 1200 : 500, base.tracks[track.key][field]);
     }
     result[preset.id] = base;
   }
   return result;
 } catch { return {}; }
}

function screenMarkup(index) {
 if (index === 0) return `<div class="phone-page home-page"><div class="phone-page-heading"><strong>슥삭</strong><span>A NOTE FOR YOU</span></div><p class="phone-greeting">마음을 전하기 좋은 날이에요.</p><div class="note-hero"><span class="note-tag">A LITTLE HELLO</span><h3>잘 쓸 필요 없이,<br>그냥 네 마음대로.</h3><svg class="scribble" viewBox="0 0 220 90" fill="none" aria-hidden="true"><path d="M29 69C42 39 78-3 78 24S19 104 61 69 113 6 106 37 66 103 111 64 146 40 132 59 152 72 162 55" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="m187 23 3 10 10 3-10 3-3 10-3-10-10-3 10-3z" fill="currentColor"/></svg><div class="phone-cta">마음 한 장 쓰기 ${icon('arrow')}</div></div><div class="phone-section-title">내 친구들 <span>3명</span></div>${[['sun','미소','오늘도 작은 행복 한 장'],['pen','준','말 대신 그림으로']].map(([symbol,name,copy])=>`<div class="friend-preview"><div class="friend-avatar">${icon(symbol)}</div><div><strong>${name}</strong><small>${copy}</small></div><span>›</span></div>`).join('')}</div>`;
 if (index === 1) return `<div class="phone-page chats-page"><div class="phone-page-heading"><strong>대화</strong><span>YOUR LITTLE NOTES</span></div><p class="phone-greeting">오가는 마음이 쌓이는 곳.</p><div class="chat-preview"><div class="friend-avatar">${icon('sun')}</div><div><strong>미소</strong><small>오늘도 반가워!</small></div><time>지금</time><span class="unread-dot">2</span></div><div class="paper-peek"><span class="paper-tape"></span><span>안녕!<br>오늘 네 하루는<br>어떤 모양이야?</span><svg viewBox="0 0 100 60" fill="none" aria-hidden="true"><path d="M26 34c-8-7-3-21 6-21s15 14 10 21c-5-7 2-21 12-19s13 15 2 24L41 51Z" stroke="currentColor" stroke-width="2"/></svg></div><div class="chat-preview"><div class="friend-avatar lilac">${icon('pen')}</div><div><strong>준</strong><small>그림 한 장을 보냈어요.</small></div><time>12:42</time></div><div class="chat-preview"><div class="friend-avatar sand">${icon('sun')}</div><div><strong>유나</strong><small>천천히 답장해도 괜찮아.</small></div><time>어제</time></div><p class="phone-footnote">작은 마음이, 한 장씩.</p></div>`;
 return `<div class="phone-page settings-page"><div class="phone-page-heading"><strong>설정</strong><span>MAKE IT YOURS</span></div><p class="phone-greeting">나에게 편한 슥삭으로.</p><div class="profile-preview"><div class="profile-avatar">${icon('sun')}</div><strong>한빈</strong><span>오늘도 슥, 한 장.</span><div class="profile-chip">나의 프로필</div></div><div class="settings-group"><span>손끝의 느낌</span><div class="setting-row">가벼운 진동 <span class="fake-toggle"></span></div><div class="setting-row">알림 <span class="fake-toggle"></span></div><div class="setting-row">화면 테마 <small>밝게　›</small></div></div><div class="settings-group"><span>슥삭에 대해</span><div class="setting-row">도움말 <small>↗</small></div><div class="setting-row">버전 <small>Motion preview</small></div></div></div>`;
}

export function mount(root, { notify }) {
 const saved = loadSaved();
 let presetId = 'slide-fade';
 let config = saved[presetId] || defaults(presetId);
 let selected = 0;
 let last = { from: 0, to: 1 };
 let animations = [];
 let generation = 0;
 let raf = 0;
 let replayTimer = 0;
 let autoTimer = 0;
 let auto = false;
 let loopIndex = 0;
 let disposed = false;
 let allowMotion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
 const loop = [0, 1, 2, 1];
 const listeners = new AbortController();
 const on = (target, event, callback) => target.addEventListener(event, callback, { signal: listeners.signal });
 const maxTime = () => Math.max(...tracks.map(track => config.tracks[track.key].duration + config.tracks[track.key].delay));

 root.innerHTML = `<div class="page-heading"><div class="breadcrumb">INTERACTION <span>/</span> STUDY 001</div><div class="title-line"><h1>Bottom tab transitions<span>.</span></h1><span class="experiment-status"><i></i> Interactive</span></div><p class="page-description">이동은 선명하게, 사라짐은 부드럽게.<br class="mobile-break"> 직접 탭하며 원하는 전환의 감각을 찾아보세요.</p></div>
 <div class="preset-tabs" role="tablist" aria-label="모션 종류">${presets.map((preset, i) => `<button type="button" role="tab" aria-selected="${i === 0}" class="preset-tab ${i === 0 ? 'active' : ''}" data-preset="${preset.id}"><span>${preset.number}</span>${preset.name}</button>`).join('')}</div>
 <div class="lab-layout"><section class="preview-panel" aria-label="실시간 모션 프리뷰"><div class="preview-topline"><span><i class="live-dot"></i> LIVE PREVIEW</span><span class="preview-meta">SWIPE OR TAP ↓</span></div><div class="preview-canvas"><div class="phone"><div class="phone-status"><span>9:41</span><span class="dynamic-island"></span><span class="phone-signal">▴▴ <span class="battery"></span></span></div><div class="phone-viewport" id="phone-viewport"></div><div class="phone-tabbar" role="tablist" aria-label="프리뷰 바텀 탭"><span class="tab-indicator"></span>${['home','chat','settings'].map((name, index) => `<button type="button" class="phone-tab ${index === 0 ? 'active' : ''}" role="tab" aria-selected="${index === 0}" aria-label="${tabs[index]} 탭" data-tab="${index}">${icon(name)}<span class="phone-tab-label">${tabs[index]}</span></button>`).join('')}</div><div class="home-indicator"></div></div><div class="preview-side-label">SSUKSAK<br><span>WEB MOTION PROTOTYPE</span></div></div><div class="preview-footer"><span class="transition-pair">Home <span>→</span> Chats</span><span class="direction-label">오른쪽 탭으로 →</span></div></section>
 <section class="controls-panel" aria-label="모션 조절"><div class="control-heading"><div><p class="eyebrow">MAKE IT FEEL RIGHT</p><h2>Fine-tune the feeling.</h2></div><button type="button" class="icon-button reset-button" aria-label="현재 모션 기본값 복원" title="기본값 복원">${icon('replay')}</button></div><p class="preset-note"></p>
 <div class="playback-actions"><button type="button" class="button primary play-button">${icon('play')}<span>다시 재생</span></button><button type="button" class="button auto-button" aria-pressed="false">자동 반복 <span class="switch-mini"></span></button></div>
 <div class="global-control"><label for="playback-speed">전체 재생 배속 <output id="speed-value">1.00×</output></label><input type="range" id="playback-speed" min="0.25" max="2" step="0.05" value="1"><div class="range-captions"><span>느리게 · 0.25×</span><span>빠르게 · 2×</span></div></div>
 <div class="shape-controls"><div class="global-control"><label for="slide-distance">화면 이동 거리 <output id="distance-value"></output></label><input type="range" id="slide-distance" min="0" max="180" step="2"></div><div class="global-control"><label for="fade-start">시작 불투명도 <output id="opacity-value"></output></label><input type="range" id="fade-start" min="0" max="0.8" step="0.05"></div></div>
 <label class="select-label" for="easing">움직임 곡선<select id="easing">${Object.entries(easings).map(([key, easing]) => `<option value="${key}">${easing.label}</option>`).join('')}</select></label>
 <div class="tracks-heading"><h3>요소별 타이밍</h3><span>TIME / DELAY</span></div><p class="control-hint">이동과 페이드도 각각 조절할 수 있어요. 값을 바꾸면 다시 재생됩니다.</p><div class="track-controls">${tracks.map(track => `<div class="track-control" data-track="${track.key}"><div class="track-title"><span><i style="--track-color:${track.color}"></i>${track.label}</span><output class="track-summary"></output></div><div class="track-sliders"><label><span>시간</span><input aria-label="${track.label} 시간" type="range" data-track="${track.key}" data-field="duration" min="80" max="1200" step="10"><output></output></label><label><span>지연</span><input aria-label="${track.label} 지연" type="range" data-track="${track.key}" data-field="delay" min="0" max="500" step="5"><output></output></label></div></div>`).join('')}</div>
 <label class="motion-permission"><input type="checkbox" id="allow-motion" ${allowMotion ? 'checked' : ''}>실험 모션 재생 허용<span>이 페이지에만 적용</span></label></section></div>
 <section class="timeline-panel" aria-label="타임라인"><div class="timeline-heading"><div><p class="eyebrow">LOOK A LITTLE CLOSER</p><h2>Every millisecond matters.</h2></div><span class="duration-readout"></span></div><div class="scrubber-row"><span class="playback-state">Ready</span><input type="range" id="scrubber" min="0" max="100" step="0.1" value="0" aria-label="모션 타임라인 위치"><output id="progress-value">0%</output></div><div class="timing-chart"></div><p class="timeline-hint">타임라인을 끌면 중간 장면에서 멈춥니다. 재생 버튼으로 이어서 볼 수 있어요.</p></section>
 <section class="implementation-panel"><button type="button" class="implementation-toggle" aria-expanded="false">${icon('code')}<span>지금 설정의 구현값 보기</span><span class="implementation-chevron">＋</span></button><div class="implementation-body" hidden><div class="implementation-intro"><p>Web Animations API 기준 설정입니다. 이동·페이드와 탭바 요소를 독립된 트랙으로 재생합니다.</p><button class="button copy-button" type="button">${icon('copy')}설정 복사</button></div><pre><code id="implementation-code"></code></pre></div></section><footer class="page-footer"><span>MOTION LAB — STUDY 001</span><span>Observe. Adjust. Repeat.</span></footer>`;

 const $ = selector => root.querySelector(selector);
 const stage = $('#phone-viewport');
 const tabButtons = [...root.querySelectorAll('.phone-tab')];
 const indicator = $('.tab-indicator');
 const scrubber = $('#scrubber');
 const code = $('#implementation-code');
 const playButton = $('.play-button');
 let storageFailed = false;
 function persist() {
   saved[presetId] = structuredClone(config);
   try { localStorage.setItem('motionlab.bottom-tabs.v1', JSON.stringify(saved)); }
   catch { if (!storageFailed) notify('이 브라우저에서는 설정을 저장할 수 없어요. 현재 페이지에서는 계속 조절할 수 있어요.'); storageFailed = true; }
 }
 function setState(state) { $('.playback-state').textContent = state; }
 function setProgress(value) { scrubber.value = value; $('#progress-value').textContent = `${Math.round(value)}%`; }
 function showPlay(paused = false) {
   playButton.innerHTML = `${icon(paused ? 'play' : 'pause')}<span>${paused ? '이어서 재생' : '일시정지'}</span>`;
   playButton.setAttribute('aria-label', paused ? '모션 이어서 재생' : '모션 일시정지');
 }
 function indicatorX(index) { return tabButtons[index].offsetLeft; }
 function selectBar(index) {
   tabButtons.forEach((button, i) => { button.classList.toggle('active', i === index); button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1; });
   indicator.style.width = `${tabButtons[index].offsetWidth}px`;
   indicator.style.transform = `translateX(${indicatorX(index)}px)`;
 }
 function layer(index) {
   const element = document.createElement('div');
   element.className = 'screen-layer';
   element.setAttribute('role', 'tabpanel');
   element.setAttribute('aria-label', `${tabs[index]} 프리뷰 화면`);
   element.innerHTML = screenMarkup(index);
   return element;
 }
 function cancel() {
   generation++;
   cancelAnimationFrame(raf);
   for (const animation of animations) animation.cancel();
   animations = [];
 }
 function stopAuto() {
   auto = false;
   clearTimeout(autoTimer);
   $('.auto-button').classList.remove('active');
   $('.auto-button').setAttribute('aria-pressed', 'false');
 }
 function updateCode() {
   code.textContent = `// ${presets.find(item => item.id === presetId).name}\n// right: +1, left: -1\nconst motion = ${JSON.stringify({ type: presetId, easing: easings[config.easing].value, distance: config.distance, initialOpacity: config.fadeStart, initialScale: config.scale, playbackRate: config.speed, tracks: config.tracks }, null, 2)};\n\n// Apply these as TWO independent animations on the entering screen:\nincoming.animate([\n  { transform: \`translateX(\${direction * motion.distance}px) scale(\${motion.initialScale})\` },\n  { transform: 'translateX(0) scale(1)' }\n], { ...motion.tracks.enterMove, fill: 'both', easing: motion.easing });\n\nincoming.animate([\n  { opacity: motion.initialOpacity }, { opacity: 1 }\n], { ...motion.tracks.enterFade, fill: 'both', easing: motion.easing });\n\n// Set animation.playbackRate = motion.playbackRate for every track.\n// Outgoing transform: 0 → -direction * motion.distance; opacity: 1 → 0.\n// The bottom tab bar stays in place. Only its indicator, icon and label animate.`;
 }
 function updateControls() {
   $('#playback-speed').value = config.speed;
   $('#speed-value').textContent = `${config.speed.toFixed(2)}×`;
   $('#slide-distance').value = config.distance;
   $('#distance-value').textContent = `${config.distance}px`;
   $('#fade-start').value = config.fadeStart;
   $('#opacity-value').textContent = `${Math.round(config.fadeStart * 100)}%`;
   $('#easing').value = config.easing;
   $('.preset-note').textContent = presets.find(item => item.id === presetId).note;
   const total = maxTime();
   $('.duration-readout').textContent = `${Math.round(total / config.speed)} ms · ${config.speed.toFixed(2)}×`;
   for (const track of tracks) {
     const row = root.querySelector(`.track-control[data-track="${track.key}"]`);
     const timing = config.tracks[track.key];
     row.querySelector('.track-summary').textContent = `${timing.duration} / ${timing.delay} ms`;
     for (const field of ['duration', 'delay']) {
       const input = row.querySelector(`[data-field="${field}"]`);
       input.value = timing[field];
       input.nextElementSibling.textContent = `${timing[field]} ms`;
     }
   }
   $('.timing-chart').innerHTML = tracks.map(track => {
     const timing = config.tracks[track.key];
     return `<div class="chart-row"><span>${track.label}</span><div class="chart-track"><span style="left:${timing.delay / total * 100}%;width:${timing.duration / total * 100}%;--track-color:${track.color}" title="${timing.duration}ms + delay ${timing.delay}ms"></span></div><span>${Math.round((timing.duration + timing.delay) / config.speed)}ms</span></div>`;
   }).join('');
   updateCode();
 }
 function tick(version) {
   if (version !== generation || disposed) return;
   const longest = animations.reduce((found, animation) => {
     const end = animation.effect.getComputedTiming().endTime;
     return !found || end > found.effect.getComputedTiming().endTime ? animation : found;
   }, null);
   if (longest) setProgress(Math.min(100, Number(longest.currentTime || 0) / maxTime() * 100));
   if (animations.some(animation => animation.playState === 'running')) raf = requestAnimationFrame(() => tick(version));
 }
 function scheduleAuto() {
   clearTimeout(autoTimer);
   if (!auto || disposed) return;
   autoTimer = setTimeout(() => { loopIndex = (loopIndex + 1) % loop.length; transition(selected, loop[loopIndex]); }, 650 / config.speed);
 }
 function transition(from, to) {
   if (from === to) { scheduleAuto(); return; }
   cancel();
   clearTimeout(replayTimer);
   replayTimer = 0;
   const version = generation;
   selected = to;
   last = { from, to };
   const direction = to > from ? 1 : -1;
   $('.transition-pair').innerHTML = `${tabEnglish[from]} <span>→</span> ${tabEnglish[to]}`;
   $('.direction-label').textContent = direction > 0 ? '오른쪽 탭으로 →' : '← 왼쪽 탭으로';
   const outgoing = layer(from);
   outgoing.setAttribute('aria-hidden', 'true');
   const incoming = layer(to);
   stage.replaceChildren(outgoing, incoming);
   const oldX = indicatorX(from);
   selectBar(to);
   setProgress(0);
   if (!allowMotion) {
     outgoing.remove(); setProgress(100); setState('Motion off');
     playButton.innerHTML = `${icon('play')}<span>다시 재생</span>`;
     playButton.setAttribute('aria-label', '모션 다시 재생');
     return;
   }
   const easing = easings[config.easing].value;
   function animate(target, frames, key) {
     const animation = target.animate(frames, { ...config.tracks[key], easing, fill: 'both' });
     animation.playbackRate = config.speed;
     animations.push(animation);
   }
   animate(incoming, [{ transform: `translateX(${direction * config.distance}px) scale(${config.scale})` }, { transform: 'translateX(0) scale(1)' }], 'enterMove');
   animate(incoming, [{ opacity: config.fadeStart }, { opacity: 1 }], 'enterFade');
   animate(outgoing, [{ transform: 'translateX(0) scale(1)' }, { transform: `translateX(${-direction * config.distance}px) scale(${config.scale})` }], 'exitMove');
   animate(outgoing, [{ opacity: 1 }, { opacity: 0 }], 'exitFade');
   animate(indicator, [{ transform: `translateX(${oldX}px)` }, { transform: `translateX(${indicatorX(to)}px)` }], 'indicator');
   animate(tabButtons[to].querySelector('.icon'), [{ transform: 'scale(.8) translateY(2px)' }, { transform: 'scale(1.12) translateY(-1px)', offset: 0.65 }, { transform: 'scale(1) translateY(0)' }], 'icon');
   animate(tabButtons[to].querySelector('.phone-tab-label'), [{ opacity: 0.25, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], 'label');
   setState('Playing'); showPlay(false); tick(version);
   Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
     if (version !== generation || disposed) return;
     outgoing.remove();
     setProgress(100); setState('Complete');
     playButton.innerHTML = `${icon('replay')}<span>다시 재생</span>`;
     playButton.setAttribute('aria-label', '모션 다시 재생');
     scheduleAuto();
   });
 }
 function replaySoon() {
   persist(); updateControls(); stopAuto();
   clearTimeout(replayTimer);
   replayTimer = setTimeout(() => transition(last.from, last.to), 180);
 }

 for (const button of tabButtons) {
   on(button, 'click', () => { stopAuto(); transition(selected, Number(button.dataset.tab)); });
   on(button, 'keydown', event => {
     if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
     event.preventDefault(); stopAuto();
     const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : Math.min(2, Math.max(0, selected + (event.key === 'ArrowRight' ? 1 : -1)));
     tabButtons[next].focus(); transition(selected, next);
   });
 }
 for (const button of root.querySelectorAll('[data-preset]')) on(button, 'click', () => {
   stopAuto(); presetId = button.dataset.preset; config = saved[presetId] ? structuredClone(saved[presetId]) : defaults(presetId);
   root.querySelectorAll('[data-preset]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', String(item === button)); });
   updateControls(); transition(last.from, last.to);
 });
 on($('#playback-speed'), 'input', event => {
   config.speed = Number(event.target.value);
   animations.forEach(animation => animation.updatePlaybackRate(config.speed));
   persist(); updateControls();
 });
 on($('#slide-distance'), 'input', event => { config.distance = Number(event.target.value); replaySoon(); });
 on($('#fade-start'), 'input', event => { config.fadeStart = Number(event.target.value); replaySoon(); });
 on($('#easing'), 'change', event => { config.easing = event.target.value; replaySoon(); });
 for (const input of root.querySelectorAll('input[data-track]')) on(input, 'input', event => {
   config.tracks[event.target.dataset.track][event.target.dataset.field] = Number(event.target.value);
   replaySoon();
 });
 on(playButton, 'click', () => {
   stopAuto();
   if (animations.some(animation => animation.playState === 'running')) { animations.forEach(animation => animation.pause()); cancelAnimationFrame(raf); setState('Paused'); showPlay(true); }
   else if (animations.some(animation => animation.playState === 'paused')) { animations.forEach(animation => animation.play()); setState('Playing'); showPlay(false); tick(generation); }
   else transition(last.from, last.to);
 });
 on($('.auto-button'), 'click', () => {
   if (auto) { stopAuto(); return; }
   if (!allowMotion) { notify('실험 모션 재생을 허용한 뒤 반복할 수 있어요.'); return; }
   auto = true; loopIndex = loop.indexOf(selected);
   $('.auto-button').classList.add('active'); $('.auto-button').setAttribute('aria-pressed', 'true');
   loopIndex = (loopIndex + 1) % loop.length;
   transition(selected, loop[loopIndex]);
 });
 on($('.reset-button'), 'click', () => { config = defaults(presetId); replaySoon(); notify('이 모션의 기본 설정으로 돌아왔어요.'); });
 on($('#allow-motion'), 'change', event => {
   allowMotion = event.target.checked;
   stopAuto(); transition(last.from, last.to);
 });
 on(scrubber, 'input', event => {
   stopAuto();
   if (!allowMotion) return;
   const position = Number(event.target.value);
   if (replayTimer || !animations.length || animations.every(animation => animation.playState === 'finished')) transition(last.from, last.to);
   animations.forEach(animation => { animation.pause(); animation.currentTime = position / 100 * maxTime(); });
   cancelAnimationFrame(raf); setProgress(position); setState('Scrubbing'); showPlay(true);
 });
 on($('.implementation-toggle'), 'click', event => {
   const button = event.currentTarget;
   const expanded = button.getAttribute('aria-expanded') !== 'true';
   button.setAttribute('aria-expanded', String(expanded)); $('.implementation-body').hidden = !expanded;
   $('.implementation-chevron').textContent = expanded ? '−' : '＋';
 });
 on($('.copy-button'), 'click', async () => {
   try { await navigator.clipboard.writeText(code.textContent); notify('현재 모션 설정을 복사했어요.'); }
   catch { notify('클립보드 권한이 없어요. 아래 구현값을 직접 선택해 복사해 주세요.'); }
 });
 let pointerStart = null;
 on(stage, 'pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId }; stage.setPointerCapture(event.pointerId); });
 on(stage, 'pointerup', event => {
   if (!pointerStart || event.pointerId !== pointerStart.id) return;
   const x = event.clientX - pointerStart.x; const y = event.clientY - pointerStart.y;
   pointerStart = null;
   if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.5) { stopAuto(); transition(selected, Math.min(2, Math.max(0, selected + (x < 0 ? 1 : -1)))); }
 });
 on(stage, 'pointercancel', () => { pointerStart = null; });
 on(document, 'visibilitychange', () => {
   if (document.hidden) {
     stopAuto();
     if (animations.some(animation => animation.playState === 'running')) {
       animations.forEach(animation => animation.pause());
       cancelAnimationFrame(raf); showPlay(true); setState('Paused');
     }
   }
 });
 const observer = new ResizeObserver(() => { if (!animations.some(animation => ['running','paused'].includes(animation.playState))) selectBar(selected); });
 observer.observe($('.phone-tabbar'));
 stage.append(layer(0)); selectBar(0); updateControls();
 playButton.setAttribute('aria-label', '모션 다시 재생');
 return () => { disposed = true; stopAuto(); cancel(); clearTimeout(replayTimer); listeners.abort(); observer.disconnect(); };
}
