<template>
  <div class="tab-view-container">
    <div class="tab-view-tabs">
      <button
        :class="`tab-view-links ${i == activeTab ? 'active' : ''}`"
        v-for="(tab, i) in tabs"
        :key="tab.id"
        @click="() => emit('tab-changed', i)"
      >
        {{ tab.name }}
      </button>
    </div>

    <div class="tab-view-content active">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tab } from '@/types/tab';

interface Props {
  tabs: Tab[];
  activeTab: number;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'tab-changed', index: number): void;
}>();
</script>

<style scoped lang="css">
.tab-view-container {
  display: flex;
  flex-direction: column;
  min-width: 100%;
}

/* Style the tab-view */
.tab-view-tabs {
  border: 1px solid #ccc;
  background-color: #f1f1f1;
  /* min-width: 100%; */
}

/* Style the buttons inside the tab-view */
.tab-view-tabs button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-size: 17px;
  color: black;
}

/* Change background color of buttons on hover */
.tab-view-tabs button:hover {
  background-color: #ddd;
}

.tab-view-tabs button.active {
  background-color: #ccc;
}

/* Style the tab-view content */
.tab-view-content {
  display: none;
  padding: 6px 12px;
  -webkit-animation: fadeEffect 0.3s;
  animation: fadeEffect 0.3s;
}

.tab-view-content.active {
  display: flex;
  background-color: inherit;
  min-height: 100%;
}

/* Fade in tabs */
@-webkit-keyframes fadeEffect {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeEffect {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
