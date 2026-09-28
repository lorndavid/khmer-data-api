import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ApisView from '../views/ApisView.vue';
import DocsView from '../views/DocsView.vue';
import ExplorerView from '../views/ExplorerView.vue';
import StatusView from '../views/StatusView.vue';
import DemographicsView from '../views/DemographicsView.vue';
import NotFoundView from '../views/NotFoundView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'KhmerAPI — Free & Open APIs for Cambodian Developers' },
  },
  {
    path: '/apis',
    name: 'apis',
    component: ApisView,
    meta: { title: 'API Catalog — KhmerAPI' },
  },
  {
    path: '/demographics',
    name: 'demographics',
    component: DemographicsView,
    meta: { title: 'Population & Demographics — KhmerAPI' },
  },
  {
    path: '/docs/:slug?',
    name: 'docs',
    component: DocsView,
    meta: { title: 'Documentation — KhmerAPI' },
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: ExplorerView,
    meta: { title: 'API & Data Explorer — KhmerAPI' },
  },
  {
    path: '/status',
    name: 'status',
    component: StatusView,
    meta: { title: 'System State & Live Latency — KhmerAPI' },
  },
  // Redirect legacy auth paths to free docs/explorer
  {
    path: '/login',
    redirect: '/docs',
  },
  {
    path: '/register',
    redirect: '/docs',
  },
  {
    path: '/dashboard/:tab?',
    redirect: '/status',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '404 Not Found — KhmerAPI' },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = String(to.meta.title);
  }
  next();
});

export default router;

