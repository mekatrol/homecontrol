import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/stores/app';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
});

router.beforeEach((to, _from) => {
  const { userToken } = useAppStore();
  const isAuthenticated = !!userToken;

  if (
    // User is not authenticated
    !isAuthenticated &&
    // ❗️ Avoid an infinite redirect
    to.name !== 'login'
  ) {
    // Encode original path as query param
    const returnQueryParam = { return: encodeURIComponent(to.fullPath) };

    // Redirect the user to the login page
    return { name: 'login', to: '/login', query: returnQueryParam };
  }

  return true;
});

export default router;
