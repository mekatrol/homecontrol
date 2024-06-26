import { createRouter, createWebHistory } from 'vue-router';
import AirConditioningView from '../views/AirConditioningView.vue';
import AlarmView from '../views/AlarmView.vue';
import HomeView from '../views/HomeView.vue';
import IrrigationView from '../views/IrrigationView.vue';
import LightingView from '../views/LightingView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      children: [
        {
          name: 'home',
          path: '',
          component: HomeView
        },
        {
          name: 'ac',
          path: 'ac',
          component: AirConditioningView
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
