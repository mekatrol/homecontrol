import type { Component } from 'vue';

export interface Tab {
  name: string;
  id: string;
  component: Component;
}
