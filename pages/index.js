// Add an experiment here; the sidebar and overview are generated from this registry.
export const experiments = [
  {
    id: 'bottom-tabs',
    number: '001',
    title: 'Bottom tab transitions',
    subtitle: '바텀 탭 전환',
    category: 'Navigation',
    description: '화면이 이동하는 방향과 사라지는 속도. 탭 사이의 감각을 조율해 보세요.',
    load: () => import('./bottom-tabs.js'),
  },
];
