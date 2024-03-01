import { createRouter, createWebHistory } from 'vue-router';
import AirconditioningView from '../views/AirconditioningView.vue';
import AlarmView from '../views/AlarmView.vue';
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
          path: 'ac',
          component: AirconditioningView
        },
        {
          path: 'alarm',
          component: AlarmView
        },
        {
          path: 'irrigation',
          component: IrrigationView
        },
        {
          path: 'lighting',
          component: LightingView
        }
      ]
    }
  ]
});

export default router;
