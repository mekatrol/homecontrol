<template>
  <div class="sidebar-slider">
    <router-link :to="button.to" v-for="button in buttons" :key="button.icon" exact-active-class="link-active" exact>
      <SvgIcon :name="button.icon" :width="iconWidth" />
      <span>{{ button.label }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/controls/SvgIcon.vue';

interface Props {
  iconWidth?: number;
}

withDefaults(defineProps<Props>(), {
  iconWidth: 40
});

interface SidebarSliderButton {
  icon: string;
  label: string;
  to: string;
}

const buttons: SidebarSliderButton[] = [
  {
    icon: 'homeinfo',
    label: 'Home',
    to: '/'
  },
  {
    icon: 'air-conditioning',
    label: 'A/C',
    to: '/ac'
  },
  {
    icon: 'alarm',
    label: 'Alarm',
    to: '/alarm'
  },
  {
    icon: 'irrigation',
    label: 'Irrigation',
    to: '/irrigation'
  },
  {
    icon: 'lighting',
    label: 'Lights',
    to: '/lighting'
  }
];
</script>

<style lang="css">
.sidebar-slider {
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  padding-inline: 20px;
  gap: 1rem;
  align-items: center;
}

.sidebar-slider > a {
  border-radius: 10px;
  outline: 2px solid currentColor;
  padding: 0.5em;
  width: 100%;
  cursor: pointer;
  color: currentColor;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: green;
}

.sidebar-slider > a.link-active,
.sidebar-slider > a:hover {
  --clr-hover: #ff4500;
  border-color: var(--clr-hover);
  color: var(--clr-hover);
}
</style>
