import { createRouter, createWebHistory } from 'vue-router';
import AirconditioningView from '../views/AirconditioningView.vue';
import AlarmView from '../views/AlarmView.vue';
import DashboardView from '../views/DashboardView.vue';
import IrrigationView from '../views/IrrigationView.vue';
import LightingView from '../views/LightingView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      children: [
        {
          name: 'dashboard',
          path: '',
          component: DashboardView
        },
        {
          name: 'ac',
          path: 'ac',
          component: AirconditioningView
        },
        {
          name: 'alarm',
          path: 'alarm',
          component: AlarmView
        },
        {
          name: 'irrigation',
          path: 'irrigation',
          component: IrrigationView
        },
        {
          name: 'lighting',
          path: 'lighting',
          component: LightingView
        }
      ]
    }
  ]
});

export default router;
