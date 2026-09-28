import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ApisView from '../views/ApisView.vue';
import DocsView from '../views/DocsView.vue';
import ExplorerView from '../views/ExplorerView.vue';
import StatusView from '../views/StatusView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import { useAuthStore } from '../stores/auth.store';

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
    path: '/docs/:slug?',
    name: 'docs',
    component: DocsView,
    meta: { title: 'Documentation — KhmerAPI' },
  },
  {
    path: '/explorer',
    name: 'explorer',
    component: ExplorerView,
    meta: { title: 'API Explorer — KhmerAPI' },
  },
  {
    path: '/status',
    name: 'status',
    component: StatusView,
    meta: { title: 'System Status & Telemetry — KhmerAPI' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Developer Sign In — KhmerAPI', guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: 'Get API Key — KhmerAPI', guestOnly: true },
  },
  {
    path: '/dashboard/:tab?',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Developer Portal — KhmerAPI', requiresAuth: true },
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
  // Update document title for SEO
  if (to.meta.title) {
    document.title = String(to.meta.title);
  }

  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
