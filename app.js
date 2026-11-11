import { experiments } from './pages/index.js';
import { icon } from './icons.js';

const main = document.querySelector('#main');
const navigation = document.querySelector('#experiment-nav');
let dispose = () => {};
let routeVersion = 0;

export function notify(message) {
 const toast = document.querySelector('#toast');
 toast.textContent = message;
 toast.classList.add('visible');
 clearTimeout(notify.timeout);
 notify.timeout = setTimeout(() => toast.classList.remove('visible'), 2200);
}

navigation.innerHTML = experiments.map(page => `<a href="#/${page.id}" class="experiment-link" data-page="${page.id}"><span class="experiment-index">${page.number}</span><span>${page.subtitle}<small>${page.title}</small></span></a>`).join('');
document.querySelector('#experiment-count').textContent = String(experiments.length).padStart(2, '0');

async function route() {
 const version = ++routeVersion;
 dispose();
 dispose = () => {};
 const id = location.hash.replace(/^#\//, '') || 'bottom-tabs';
 document.body.classList.remove('menu-open');
 document.querySelector('.mobile-menu').setAttribute('aria-expanded', 'false');
 document.querySelectorAll('[data-page]').forEach(link => {
   const active = link.dataset.page === id;
   link.classList.toggle('selected', active);
   if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
 });
 document.querySelector('.overview-link').classList.toggle('selected', id === 'overview');
 document.querySelectorAll('.header-nav a').forEach(link => link.classList.toggle('active', link.hash === `#/${id}` || (id !== 'overview' && link.hash === '#/bottom-tabs')));
 if (id === 'overview') {
   document.title = 'Experiments — Motion Lab';
   main.innerHTML = `<div class="page-heading"><p class="eyebrow">THE COLLECTION</p><h1>Every little move.</h1><p class="page-description">눌러보고, 느리게 보고, 조금씩 바꿔보는 인터랙션 실험실.</p></div><div class="experiment-grid">${experiments.map(page => `<a class="experiment-card" href="#/${page.id}"><div class="experiment-art"><div class="mini-tabs"><span></span><span></span><span></span></div><span class="art-arrow">↔</span></div><div class="card-meta"><span>STUDY ${page.number}</span><span>${page.category}</span></div><h2>${page.title} ${icon('arrow')}</h2><p>${page.description}</p></a>`).join('')}</div><div class="collection-note"><span class="status-dot"></span> 이 공간은 계속 자랍니다.<p>새로운 실험은 왼쪽 목록에 차곡차곡 추가됩니다.</p></div>`;
   return;
 }
 const page = experiments.find(item => item.id === id);
 if (!page) {
   main.innerHTML = '<div class="empty-state"><h1>아직 없는 실험이에요.</h1><a class="button primary" href="#/overview">실험 목록 보기</a></div>';
   return;
 }
 main.innerHTML = '<div class="loading" role="status">실험 불러오는 중…</div>';
 try {
   const module = await page.load();
   if (version !== routeVersion) return;
   document.title = `${page.title} — Motion Lab`;
   dispose = module.mount(main, { notify }) || (() => {});
 } catch (error) {
   if (version !== routeVersion) return;
   main.innerHTML = '<div class="empty-state"><h1>실험을 불러오지 못했어요.</h1><p>네트워크를 확인한 뒤 새로고침해 주세요.</p></div>';
   console.error(error);
 }
}
document.querySelector('.mobile-menu').addEventListener('click', event => {
 const open = document.body.classList.toggle('menu-open');
 event.currentTarget.setAttribute('aria-expanded', String(open));
});
document.querySelector('.skip-link').addEventListener('click', event => {
 event.preventDefault();
 main.focus();
});
window.addEventListener('hashchange', route);
route();
