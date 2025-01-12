<template>
  <div class="system-state">
    <div>
      <h1>System overview</h1>
    </div>
    <div>
      <h2>Alerts</h2>
      <AppTable
        :headers="alertHeaders"
        :rows="alertRows"
        :highlight-hover="true"
        :row-selectable="true"
        @row-clicked="rowClicked"
        @row-clicked-close="rowClickedClose"
      ></AppTable>
    </div>
    <div>
      <h2>Modules</h2>
      <AppTable
        :headers="moduleHeaders"
        :rows="moduleRows"
        :highlight-hover="true"
        :row-selectable="true"
        @row-clicked="rowClicked"
        @row-clicked-close="rowClickedClose"
      ></AppTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTable from '@/components/AppTable.vue';
import { useAppStore } from '@/stores/app-store';
import type { TableHeader, TableRow } from '@/types/table';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const appStore = useAppStore();

const { systemState } = storeToRefs(appStore);

const alertHeaders: TableHeader[] = [
  {
    label: 'Title'
  },
  {
    label: 'Message'
  },
  {
    label: 'Link'
  }
];

const alertRows = computed(() => {
  const rows: TableRow[] = [];

  for (let i = 0; i < systemState.value.alerts.length; i++) {
    const alert = systemState.value.alerts[i];

    const row: TableRow = {
      cells: [
        {
          value: alert.title
        },
        {
          value: alert.message
        },
        {
          value: alert.link ?? ''
        }
      ]
    };

    rows.push(row);
  }

  return rows;
});

const moduleHeaders: TableHeader[] = [
  {
    label: 'Name'
  },
  {
    label: 'Status'
  },
  {
    label: 'Description'
  }
];

const moduleRows = computed(() => {
  const rows: TableRow[] = [];

  for (let i = 0; i < systemState.value.modules.length; i++) {
    const module = systemState.value.modules[i];

    const row: TableRow = {
      cells: [
        {
          value: module.name
        },
        {
          value: module.status
        },
        {
          value: module.description
        }
      ]
    };

    rows.push(row);
  }

  return rows;
});

const rowClicked = (i: number): void => {
  console.log(i);
};

const rowClickedClose = (i: number): void => {
  console.log(i);
};
</script>

<style lang="css" scoped>
.system-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  width: 100%;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

h2 {
  font-size: 1.3rem;
  font-weight: 500;
  padding-bottom: 1rem;
}
</style>
