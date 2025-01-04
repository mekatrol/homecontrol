<template>
  <div class="wrapper open-flow">
    <AppTable
      :headers="headers"
      :rows="rows"
      :highlight-hover="true"
      :row-selectable="true"
      caption="Select a flow to open"
      @row-clicked="rowClicked"
      @row-clicked-close="rowClickedClose"
    ></AppTable>
  </div>
</template>

<script setup lang="ts">
import type { Flow } from '@/services/api-generated';
import { useAppStore } from '@/stores/app-store';
import type { TableHeader, TableRow } from '@/types/table';
import { computed, onMounted, ref } from 'vue';
import AppTable from './AppTable.vue';
import { formatDateTime } from '@/services/date';

const appStore = useAppStore();
const { getFlowSummaries } = appStore;
const flowSummaries = ref<Flow[]>([]);

const emit = defineEmits<{
  (e: 'flow-clicked', flow: Flow): void;
  (e: 'flow-clicked-close', flow: Flow): void;
}>();

const rowClicked = (i: number): void => {
  emit('flow-clicked', flowSummaries.value[i]);
};

const rowClickedClose = (i: number): void => {
  emit('flow-clicked-close', flowSummaries.value[i]);
};

const headers: TableHeader[] = [
  {
    label: 'Label'
  },
  {
    label: 'Last updated'
  },
  {
    label: 'Created'
  }
];

const rows = computed(() => {
  const rows: TableRow[] = [];

  for (let i = 0; i < flowSummaries.value.length; i++) {
    const flow = flowSummaries.value[i];

    const row: TableRow = {
      cells: [
        {
          value: flow.label
        },
        {
          value: formatDateTime(flow.updated)
        },
        {
          value: formatDateTime(flow.created)
        }
      ]
    };

    rows.push(row);
  }

  return rows;
});

onMounted(async () => {
  flowSummaries.value = await getFlowSummaries();
});
</script>

<style scoped lang="css">
.open-flow {
  min-height: 100%;
  min-width: 100%;
}
</style>
